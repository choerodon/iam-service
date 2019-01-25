package io.choerodon.iam.infra.common.utils.ldap;

import static org.springframework.ldap.query.LdapQueryBuilder.query;

import java.util.*;
import java.util.stream.Collectors;
import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.filter.AndFilter;
import org.springframework.ldap.filter.EqualsFilter;
import org.springframework.ldap.filter.HardcodedFilter;
import org.springframework.ldap.query.SearchScope;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import io.choerodon.iam.app.service.OrganizationUserService;
import io.choerodon.iam.domain.iam.entity.UserE;
import io.choerodon.iam.domain.repository.LdapHistoryRepository;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.infra.common.utils.CollectionUtils;
import io.choerodon.iam.infra.dataobject.LdapDO;
import io.choerodon.iam.infra.dataobject.LdapHistoryDO;
import io.choerodon.iam.infra.dataobject.UserDO;


/**
 * @author wuguokai
 */
@RefreshScope
@Component
public class LdapSyncUserTask {
    private static final Logger logger = LoggerFactory.getLogger(LdapSyncUserTask.class);

    private static final String OBJECT_CLASS = "objectclass";

    private static final BCryptPasswordEncoder ENCODER = new BCryptPasswordEncoder();

    private UserRepository userRepository;

    private OrganizationUserService organizationUserService;

    private LdapHistoryRepository ldapHistoryRepository;

    public LdapSyncUserTask(UserRepository userRepository,
                            OrganizationUserService organizationUserService,
                            LdapHistoryRepository ldapHistoryRepository) {
        this.userRepository = userRepository;
        this.organizationUserService = organizationUserService;
        this.ldapHistoryRepository = ldapHistoryRepository;
    }

    @Async("ldap-executor")
    public void syncLDAPUser(LdapTemplate ldapTemplate, LdapDO ldap, FinishFallback fallback,Integer countLimit) {
        logger.info("@@@ start async user");
        Long organizationId = ldap.getOrganizationId();
        LdapSyncReport ldapSyncReport = new LdapSyncReport(organizationId);
        ldapSyncReport.setLdapId(ldap.getId());
        ldapSyncReport.setStartTime(new Date(System.currentTimeMillis()));

        LdapHistoryDO ldapHistory = new LdapHistoryDO();
        ldapHistory.setLdapId(ldap.getId());
        ldapHistory.setSyncBeginTime(ldapSyncReport.getStartTime());
        LdapHistoryDO ldapHistoryDO = ldapHistoryRepository.insertSelective(ldapHistory);

        List<UserDO> users = getUsersFromLdapServer(ldapTemplate, ldap, organizationId, ldapSyncReport,countLimit);
        logger.info("###total user count : {}", ldapSyncReport.getCount());
        //写入
        if (!users.isEmpty()) {
            compareWithDbAndInsert(users, ldapSyncReport, organizationId, ldap.getSagaBatchSize());
        }
        ldapSyncReport.setEndTime(new Date(System.currentTimeMillis()));
        logger.info("async finished : {}", ldapSyncReport);
        fallback.callback(ldapSyncReport, ldapHistoryDO);
    }

    private List<UserDO> getUsersFromLdapServer(LdapTemplate ldapTemplate, LdapDO ldap, Long organizationId, LdapSyncReport ldapSyncReport,Integer countLimit) {
        AndFilter andFilter = getAndFilterByObjectClass(ldap);
        HardcodedFilter hardcodedFilter = new HardcodedFilter(ldap.getCustomFilter());
        andFilter.and(hardcodedFilter);
        List<Attributes> attributesList =
                ldapTemplate.search(
                        query()
                                .searchScope(SearchScope.SUBTREE)
                                .countLimit(countLimit)
                                .filter(andFilter),
                        new AttributesMapper() {
                            @Override
                            public Object mapFromAttributes(Attributes attributes) throws NamingException {
                                return attributes;
                            }
                        });
        List<UserDO> users = new ArrayList<>();
        if (attributesList.isEmpty()) {
            logger.warn("can not find any attributes while filter is {}", andFilter);
        } else {
            processUserFromAttributes(ldap, organizationId, attributesList, users, ldapSyncReport);
            ldapSyncReport.setCount(Long.valueOf(users.size()));
        }
        return users;
    }

    private void processUserFromAttributes(LdapDO ldap, Long organizationId, List<Attributes> attributesList, List<UserDO> users, LdapSyncReport ldapSyncReport) {
        attributesList.forEach(attributes -> {
            String loginNameFiled = ldap.getLoginNameField();
            String emailFiled = ldap.getEmailField();
            Attribute loginNameAttribute = attributes.get(loginNameFiled);
            Attribute emailAttribute = attributes.get(emailFiled);
            Attribute realNameAttribute = attributes.get(ldap.getRealNameField());
            Attribute phoneAttribute = attributes.get(ldap.getPhoneField());
            if (loginNameAttribute == null || emailAttribute == null) {
                ldapSyncReport.incrementError();
                logger.warn("the filed [{}, {}] of attributes is null, so skip the attributes {}", loginNameFiled, emailFiled, attributes);
                return;
            } else {
                UserDO user = new UserDO();
                user.setOrganizationId(organizationId);
                try {
                    user.setLoginName(loginNameAttribute.get().toString());
                    user.setEmail(emailAttribute.get().toString());
                    if (ldap.getRealNameField() != null && realNameAttribute != null) {
                        user.setRealName(realNameAttribute.get().toString());
                    }
                    if (ldap.getPhoneField() != null && phoneAttribute != null) {
                        user.setPhone(phoneAttribute.get().toString());
                    }
                    user.setLanguage("zh_CN");
                    user.setTimeZone("CTT");
                    user.setEnabled(true);
                    user.setLocked(false);
                    user.setLdap(true);
                    user.setAdmin(false);
                    user.setLastPasswordUpdatedAt(new Date(System.currentTimeMillis()));
                } catch (NamingException e) {
                    ldapSyncReport.incrementError();
                    logger.error("Attribute get() exception, skip the attributes {}, exception: {}", attributes, e);
                    return;
                }
                users.add(user);
            }
        });
    }

    private AndFilter getAndFilterByObjectClass(LdapDO ldapDO) {
        String objectClass = ldapDO.getObjectClass();
        String[] arr = objectClass.split(",");
        AndFilter andFilter = new AndFilter();
        for (String str : arr) {
            andFilter.and(new EqualsFilter(OBJECT_CLASS, str));
        }
        return andFilter;
    }

    private void compareWithDbAndInsert(List<UserDO> users, LdapSyncReport ldapSyncReport, Long organizationId, Integer sagaBatchSize) {
        List<UserDO> insertUsers = new ArrayList<>();
        Set<String> nameSet = users.stream().map(UserDO::getLoginName).collect(Collectors.toSet());
        Set<String> emailSet = users.stream().map(UserDO::getEmail).collect(Collectors.toSet());
        //oracle In-list上限为1000，这里List size要小于1000
        List<Set<String>> subNameSet = CollectionUtils.subSet(nameSet, 999);
        List<Set<String>> subEmailSet = CollectionUtils.subSet(emailSet, 999);
        Set<String> existedNames = new HashSet<>();
        Set<String> existedEmails = new HashSet<>();
        subNameSet.forEach(set -> existedNames.addAll(userRepository.matchLoginName(set)));
        subEmailSet.forEach(set -> existedEmails.addAll(userRepository.matchEmail(set)));

        users.forEach(user -> {
            String loginName = user.getLoginName();
            if (!existedNames.contains(user.getLoginName())) {
                if (existedEmails.contains(user.getEmail())) {
                    //邮箱重复，报错
                    ldapSyncReport.incrementError();
                    logger.warn("duplicate email, email : {}", user.getEmail());
                } else {
                    //加密为耗时操作，只有在插入的时候才加密，或者可以考虑取消掉
                    user.setPassword(ENCODER.encode("unknown password"));
                    insertUsers.add(user);
                    ldapSyncReport.incrementNewInsert();
                }
            } else {
                UserE userE = userRepository.selectByLoginName(loginName);
                //lastUpdatedBy=0则是程序同步的，跳过在用户界面上手动禁用的情况
                if (userE.getLastUpdatedBy().equals(0L) && !userE.getEnabled()) {
                    organizationUserService.enableUser(organizationId, userE.getId());
                    ldapSyncReport.incrementUpdate();
                }
            }
        });
        UserDO example = new UserDO();
        example.setOrganizationId(organizationId);
        example.setLdap(true);
        List<UserDO> userList = userRepository.select(example);
        //把已经存在的，不满足自定义过滤条件的用户禁用掉
        userList.forEach(user -> {
            if (!nameSet.contains(user.getLoginName()) && user.getEnabled()) {
                organizationUserService.disableUser(organizationId, user.getId());
                ldapSyncReport.incrementUpdate();
            }
        });
        List<List<UserDO>> list = CollectionUtils.subList(insertUsers, sagaBatchSize);
        list.forEach(usrList -> {
            if (!usrList.isEmpty()) {
                Long errorCount = ldapSyncReport.getError() + organizationUserService.batchCreateUsers(usrList);
                ldapSyncReport.setError(errorCount);
            }
        });
    }

    public interface FinishFallback {
        /**
         * 同步完成后回调
         *
         * @param ldapSyncReport 同步结果
         */
        LdapHistoryDO callback(LdapSyncReport ldapSyncReport, LdapHistoryDO ldapHistoryDO);
    }


    @Component
    public class FinishFallbackImpl implements FinishFallback {

        private LdapHistoryRepository ldapHistoryRepository;

        public FinishFallbackImpl(LdapHistoryRepository ldapHistoryRepository) {
            this.ldapHistoryRepository = ldapHistoryRepository;
        }

        @Override
        public LdapHistoryDO callback(LdapSyncReport ldapSyncReport, LdapHistoryDO ldapHistoryDO) {
            ldapHistoryDO.setSyncEndTime(ldapSyncReport.getEndTime());
            ldapHistoryDO.setNewUserCount(ldapSyncReport.getInsert());
            ldapHistoryDO.setUpdateUserCount(ldapSyncReport.getUpdate());
            ldapHistoryDO.setErrorUserCount(ldapSyncReport.getError());
            return ldapHistoryRepository.updateByPrimaryKeySelective(ldapHistoryDO);
        }
    }
}
