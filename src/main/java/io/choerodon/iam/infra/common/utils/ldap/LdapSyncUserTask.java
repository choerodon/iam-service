package io.choerodon.iam.infra.common.utils.ldap;

import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;
import javax.naming.NamingException;
import javax.naming.directory.Attributes;

import io.choerodon.core.ldap.DirectoryType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
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

import static org.springframework.ldap.query.LdapQueryBuilder.query;


/**
 * @author wuguokai
 */
@RefreshScope
@Component
public class LdapSyncUserTask {
    private static final Logger logger = LoggerFactory.getLogger(LdapSyncUserTask.class);

    private static final String DIMISSION_VALUE = "1";

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
    public void syncLDAPUser(LdapTemplate ldapTemplate, LdapDO ldap, FinishFallback fallback) {
        Long organizationId = ldap.getOrganizationId();
        LdapSyncReport ldapSyncReport = new LdapSyncReport(organizationId);
        ldapSyncReport.setLdapId(ldap.getId());


        logger.info("@@@ start async user");
        ldapSyncReport.setStartTime(new Date(System.currentTimeMillis()));
        LdapHistoryDO ldapHistory = new LdapHistoryDO();
        ldapHistory.setLdapId(ldap.getId());
        ldapHistory.setSyncBeginTime(ldapSyncReport.getStartTime());
        LdapHistoryDO ldapHistoryDO = ldapHistoryRepository.insertSelective(ldapHistory);

        List<Attributes> attributesList =
                ldapTemplate.search(
                        query()
                                .searchScope(SearchScope.SUBTREE)
                                .where("objectclass")
                                .is(ldap.getObjectClass()),
                        new AttributesMapper() {
                            @Override
                            public Object mapFromAttributes(Attributes attributes) throws NamingException {
                                return attributes;
                            }
                        });
        List<UserDO> users = new CopyOnWriteArrayList<>();
        if (attributesList.isEmpty()) {
            logger.info("can not find attributes where objectclass = {}", ldap.getObjectClass());
        } else {
            attributesList.parallelStream().forEach(attributes -> {
                UserDO user = extractUser(attributes, organizationId, ldap);
                if (user == null) {
                    return;
                }
                users.add(user);
            });
            ldapSyncReport.setCount(Long.valueOf(users.size()));
        }
        logger.info("###total user count : {}", ldapSyncReport.getCount());
        //写入
        if (!users.isEmpty()) {
            compareWithDbAndInsert(users, ldapSyncReport);
        }
        ldapSyncReport.setEndTime(new Date(System.currentTimeMillis()));
        logger.info("async finished : {}", ldapSyncReport);
        fallback.callback(ldapSyncReport, ldapHistoryDO);
    }

    private void compareWithDbAndInsert(List<UserDO> users, LdapSyncReport ldapSyncReport) {
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
        users.forEach(u -> {
            // 用户不存在 且 非离职状态 则 插入
            if (!existedNames.contains(u.getLoginName()) && u.getEnabled()) {
                //插入
                if (existedEmails.contains(u.getEmail())) {
                    //邮箱重复，报错
                    ldapSyncReport.incrementError();
                    logger.info("duplicate email, email : {}", u.getEmail());
                } else {
                    //可以插入
                    u.setLanguage("zh_CN");
                    u.setTimeZone("CTT");
                    u.setPassword(ENCODER.encode("unknown password"));
                    u.setLocked(false);
                    u.setLdap(true);
                    u.setAdmin(false);
                    u.setLastPasswordUpdatedAt(new Date(System.currentTimeMillis()));
                    insertUsers.add(u);
                    ldapSyncReport.incrementNewInsert();
                }
            } else if (existedNames.contains(u.getLoginName()) && !u.getEnabled()) {
                // 用户存在 且 离职状态 则 停用
                UserE userE = userRepository.selectByLoginName(u.getLoginName());
                if (userE.getEnabled()) {
                    organizationUserService.disableUser(userE.getOrganizationId(), userE.getId());
                    ldapSyncReport.incrementUpdate();
                }
            } else {
                //更新,目前不做更新操作
            }
        });
        List<List<UserDO>> list = CollectionUtils.subList(insertUsers, 1000);
        list.forEach(l -> {
            if (!l.isEmpty()) {
                organizationUserService.batchCreateUsers(l);
            }
        });
    }

    private UserDO extractUser(Attributes attributes, Long organizationId, LdapDO ldap) {
        UserDO user = new UserDO();
        user.setOrganizationId(organizationId);
        String dirType = ldap.getDirectoryType();
        try {
            //用户离职，状态改为停用,其余用户状态为可用
            //active directory 目前设置为全量同步
            user.setEnabled(true);
            if (DirectoryType.OPEN_LDAP.value().equals(dirType)
                    && attributes.get("employeeType") != null
                    && DIMISSION_VALUE.equals(attributes.get("employeeType").get().toString())) {
                user.setEnabled(false);
            }
            if (ldap.getLoginNameField() == null
                    || attributes.get(ldap.getLoginNameField()) == null) {
                return null;
            } else {
                user.setLoginName(attributes.get(ldap.getLoginNameField()).get().toString());
            }
            if (ldap.getEmailField() == null
                    || attributes.get(ldap.getEmailField()) == null) {
                return null;
            } else {
                user.setEmail(attributes.get(ldap.getEmailField()).get().toString());
            }
            //不是匿名用户，匹配phone和displayName
            if (ldap.getRealNameField() != null && attributes.get(ldap.getRealNameField()) != null) {
                user.setRealName(attributes.get(ldap.getRealNameField()).get().toString());
            }
            if (ldap.getPhoneField() != null && attributes.get(ldap.getPhoneField()) != null) {
                user.setPhone(attributes.get(ldap.getPhoneField()).get().toString());
            }
        } catch (NamingException e) {
            logger.info("user extract fail: {}", e);
        }
        return user;
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
