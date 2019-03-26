package io.choerodon.iam.infra.common.utils.ldap;

import java.util.*;
import java.util.stream.Collectors;
import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchControls;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.ldap.control.PagedResultsDirContextProcessor;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapOperations;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapOperationsCallback;
import org.springframework.ldap.core.support.SingleContextSource;
import org.springframework.ldap.filter.AndFilter;
import org.springframework.ldap.filter.EqualsFilter;
import org.springframework.ldap.filter.HardcodedFilter;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import io.choerodon.iam.app.service.OrganizationUserService;
import io.choerodon.iam.domain.iam.entity.UserE;
import io.choerodon.iam.domain.repository.LdapHistoryRepository;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.infra.common.utils.CollectionUtils;
import io.choerodon.iam.infra.dataobject.LdapDO;
import io.choerodon.iam.infra.dataobject.LdapErrorUserDO;
import io.choerodon.iam.infra.dataobject.LdapHistoryDO;
import io.choerodon.iam.infra.dataobject.UserDO;
import io.choerodon.iam.infra.enums.LdapErrorUserCause;
import io.choerodon.iam.infra.mapper.LdapErrorUserMapper;


/**
 * @author wuguokai
 */
@RefreshScope
@Component
public class LdapSyncUserTask {
    private static final Logger logger = LoggerFactory.getLogger(LdapSyncUserTask.class);

    private static final String OBJECT_CLASS = "objectclass";

    private UserRepository userRepository;

    private OrganizationUserService organizationUserService;

    private LdapHistoryRepository ldapHistoryRepository;

    private LdapErrorUserMapper ldapErrorUserMapper;

    public LdapSyncUserTask(UserRepository userRepository,
                            OrganizationUserService organizationUserService,
                            LdapHistoryRepository ldapHistoryRepository,
                            LdapErrorUserMapper ldapErrorUserMapper) {
        this.userRepository = userRepository;
        this.organizationUserService = organizationUserService;
        this.ldapHistoryRepository = ldapHistoryRepository;
        this.ldapErrorUserMapper = ldapErrorUserMapper;
    }

    @Async("ldap-disable-executor")
    public void syncDisabledLDAPUser(LdapTemplate ldapTemplate, LdapDO ldap, LdapSyncUserTask.FinishFallback fallback) {
        logger.info("@@@ start disable user");

        Long organizationId = ldap.getOrganizationId();

        LdapSyncReport ldapSyncReport = new LdapSyncReport(organizationId);
        ldapSyncReport.setLdapId(ldap.getId());
        ldapSyncReport.setStartTime(new Date(System.currentTimeMillis()));

        LdapHistoryDO ldapHistory = new LdapHistoryDO();
        ldapHistory.setLdapId(ldap.getId());
        ldapHistory.setSyncBeginTime(ldapSyncReport.getStartTime());

        LdapHistoryDO ldapHistoryDO = ldapHistoryRepository.insertSelective(ldapHistory);

        disabledUsersFromLdapServer(ldapTemplate, ldap, ldapSyncReport, ldapHistoryDO.getId());

        logger.info("@@@total user count : {}", ldapSyncReport.getCount());
        ldapSyncReport.setEndTime(new Date(System.currentTimeMillis()));
        logger.info("async finished : {}", ldapSyncReport);
        fallback.callback(ldapSyncReport, ldapHistoryDO);
    }


    @Async("ldap-executor")
    public void syncLDAPUser(LdapTemplate ldapTemplate, LdapDO ldap, FinishFallback fallback) {
        logger.info("@@@ start async user");
        Long organizationId = ldap.getOrganizationId();
        LdapSyncReport ldapSyncReport = new LdapSyncReport(organizationId);
        ldapSyncReport.setLdapId(ldap.getId());
        ldapSyncReport.setStartTime(new Date(System.currentTimeMillis()));

        LdapHistoryDO ldapHistory = new LdapHistoryDO();
        ldapHistory.setLdapId(ldap.getId());
        ldapHistory.setSyncBeginTime(ldapSyncReport.getStartTime());
        LdapHistoryDO ldapHistoryDO = ldapHistoryRepository.insertSelective(ldapHistory);

        Long ldapHistoryId = ldapHistory.getId();
        getUsersFromLdapServer(ldapTemplate, ldap, ldapSyncReport, ldapHistoryId);
        logger.info("@@@total user count : {}", ldapSyncReport.getCount());
        ldapSyncReport.setEndTime(new Date(System.currentTimeMillis()));
        logger.info("async finished : {}", ldapSyncReport);

        fallback.callback(ldapSyncReport, ldapHistoryDO);
    }

    public void disabledUsersFromLdapServer(LdapTemplate ldapTemplate, LdapDO ldap, LdapSyncReport ldapSyncReport, Long ldapHistoryId) {
        //搜索控件
        final SearchControls searchControls = new SearchControls();
        searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE);
        //Filter
        AndFilter andFilter = getAndFilterByObjectClass(ldap);
        HardcodedFilter hardcodedFilter = new HardcodedFilter(ldap.getCustomFilter());
        andFilter.and(hardcodedFilter);

        int batchSize = ldap.getSagaBatchSize();
        //分页PagedResultsDirContextProcessor
        final PagedResultsDirContextProcessor processor =
                new PagedResultsDirContextProcessor(batchSize);
        SingleContextSource.doWithSingleContext(
                ldapTemplate.getContextSource(), new LdapOperationsCallback<List<UserDO>>() {
                    @Override
                    public List<UserDO> doWithLdapOperations(LdapOperations operations) {
                        Integer page = 1;
                        AttributesMapper attributesMapper = new AttributesMapper() {
                            @Override
                            public Object mapFromAttributes(Attributes attributes) {
                                return attributes;
                            }
                        };

                        do {
                            List<Attributes> attributesList =
                                    operations.search("", andFilter.toString(), searchControls,
                                            attributesMapper, processor);
                            //将当前分页的数据做插入处理
                            List<UserDO> users = new ArrayList<>();
                            List<LdapErrorUserDO> errorUsers = new ArrayList<>();
                            if (attributesList.isEmpty()) {
                                logger.warn("can not find any attributes while filter is {}, page is {}", andFilter, page);
                                break;
                            } else {
                                processUserFromAttributes(ldap, attributesList, users, ldapSyncReport, errorUsers);
                            }
                            //当前页做用户停用
                            if (!users.isEmpty()) {
                                Long disabledCount = compareWithDbAndDisabled(users);
                                ldapSyncReport.incrementUpdate(Long.valueOf(disabledCount));
                            }
                            insertErrorUser(errorUsers, ldapHistoryId);
                            int legalUserSize = users.size();
                            attributesList.clear();
                            users.clear();
                            errorUsers.clear();
                            ldapSyncReport.incrementCount(Long.valueOf(legalUserSize));
                        } while (processor.hasMore());
                        return null;
                    }
                });
    }

    private void getUsersFromLdapServer(LdapTemplate ldapTemplate, LdapDO ldap, LdapSyncReport ldapSyncReport,
                                        Long ldapHistoryId) {
        //搜索控件
        final SearchControls searchControls = new SearchControls();
        searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE);
        //Filter
        AndFilter andFilter = getAndFilterByObjectClass(ldap);
        HardcodedFilter hardcodedFilter = new HardcodedFilter(ldap.getCustomFilter());
        andFilter.and(hardcodedFilter);

        int batchSize = ldap.getSagaBatchSize();
        //分页PagedResultsDirContextProcessor
        final PagedResultsDirContextProcessor processor =
                new PagedResultsDirContextProcessor(batchSize);
        SingleContextSource.doWithSingleContext(
                ldapTemplate.getContextSource(), new LdapOperationsCallback<List<UserDO>>() {
                    @Override
                    public List<UserDO> doWithLdapOperations(LdapOperations operations) {
                        Integer page = 1;
                        AttributesMapper attributesMapper = new AttributesMapper() {
                            @Override
                            public Object mapFromAttributes(Attributes attributes) {
                                return attributes;
                            }
                        };

                        do {
                            List<Attributes> attributesList =
                                    operations.search("", andFilter.toString(), searchControls,
                                            attributesMapper, processor);
                            //将当前分页的数据做插入处理
                            List<UserDO> users = new ArrayList<>();
                            List<LdapErrorUserDO> errorUsers = new ArrayList<>();
                            if (attributesList.isEmpty()) {
                                logger.warn("can not find any attributes while filter is {}, page is {}", andFilter, page);
                                break;
                            } else {
                                processUserFromAttributes(ldap, attributesList, users, ldapSyncReport, errorUsers);
                            }
                            //当前页做数据写入
                            if (!users.isEmpty()) {
                                compareWithDbAndInsert(users, ldapSyncReport, errorUsers, ldapHistoryId);
                            }
                            int legalUserSize = users.size();
                            attributesList.clear();
                            users.clear();
                            errorUsers.clear();
                            ldapSyncReport.incrementCount(Long.valueOf(legalUserSize));
                            page++;
                        } while (processor.hasMore());
                        return null;
                    }
                });
    }

    private void processUserFromAttributes(LdapDO ldap, List<Attributes> attributesList,
                                           List<UserDO> users, LdapSyncReport ldapSyncReport,
                                           List<LdapErrorUserDO> errorUsers) {
        Long organizationId = ldap.getOrganizationId();
        String loginNameFiled = ldap.getLoginNameField();
        String emailFiled = ldap.getEmailField();
        String uuidField = ldap.getUuidField();
        attributesList.forEach(attributes -> {
            Attribute uuidAttribute = attributes.get(uuidField);
            Attribute loginNameAttribute = attributes.get(loginNameFiled);
            Attribute emailAttribute = attributes.get(emailFiled);
            Attribute realNameAttribute = null;
            if (ldap.getRealNameField() != null) {
                realNameAttribute = attributes.get(ldap.getRealNameField());
            }
            Attribute phoneAttribute = null;
            if (ldap.getPhoneField() != null) {
                phoneAttribute = attributes.get(ldap.getPhoneField());
            }


            String uuid;
            String loginName;
            String email;
            String realName = null;
            String phone = null;
            if (uuidAttribute == null) {
                ldapSyncReport.incrementError();
                logger.error("the uuid {} of attributes {} can not be null, skip the user", ldap.getUuidField(), attributes);
                return;
            }
            try {
                uuid = uuidAttribute.get().toString();
            } catch (NamingException e) {
                ldapSyncReport.incrementError();
                logger.error("attributes {} get uuid attribute exception {}, skip the user", attributes, e);
                return;
            }

            if (loginNameAttribute == null) {
                ldapSyncReport.incrementError();
                LdapErrorUserDO errorUser =
                        new LdapErrorUserDO().setUuid(uuid)
                                .setCause(LdapErrorUserCause.LOGIN_NAME_FIELD_NULL.value());
                errorUsers.add(errorUser);
                return;
            }
            try {
                loginName = loginNameAttribute.get().toString();
            } catch (NamingException e) {
                ldapSyncReport.incrementError();
                LdapErrorUserDO errorUser =
                        new LdapErrorUserDO().setUuid(uuid)
                                .setCause(LdapErrorUserCause.LOGIN_NAME_GET_EXCEPTION.value());
                errorUsers.add(errorUser);
                return;
            }

            if (emailAttribute == null) {
                ldapSyncReport.incrementError();
                LdapErrorUserDO errorUser =
                        new LdapErrorUserDO().setUuid(uuid)
                                .setCause(LdapErrorUserCause.EMAIL_FIELD_NULL.value());
                errorUsers.add(errorUser);
                return;
            }
            try {
                email = emailAttribute.get().toString();
            } catch (NamingException e) {
                ldapSyncReport.incrementError();
                LdapErrorUserDO errorUser =
                        new LdapErrorUserDO().setUuid(uuid)
                                .setCause(LdapErrorUserCause.EMAIL_GET_EXCEPTION.value()).setLoginName(loginName);
                errorUsers.add(errorUser);
                return;
            }

            try {
                if (realNameAttribute != null) {
                    realName = realNameAttribute.get().toString();
                }
                if (phoneAttribute != null) {
                    phone = phoneAttribute.get().toString();
                }
            } catch (NamingException e) {
                logger.warn("realName or phone field attribute get exception {}", e);
            }

            UserDO user = new UserDO();
            user.setUuid(uuid);
            user.setOrganizationId(organizationId);
            user.setLanguage("zh_CN");
            user.setTimeZone("CTT");
            user.setEnabled(true);
            user.setLocked(false);
            user.setLdap(true);
            user.setAdmin(false);
            user.setPassword("ldap users do not have password");
            user.setLastPasswordUpdatedAt(new Date(System.currentTimeMillis()));
            user.setLoginName(loginName);
            user.setEmail(email);
            user.setRealName(realName);
            user.setPhone(phone);

            users.add(user);
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

    private void compareWithDbAndInsert(List<UserDO> users, LdapSyncReport ldapSyncReport,
                                        List<LdapErrorUserDO> errorUsers, Long ldapHistoryId) {
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
            if (!existedNames.contains(loginName)) {
                if (existedEmails.contains(user.getEmail())) {
                    //邮箱重复，报错
                    ldapSyncReport.incrementError();
                    LdapErrorUserDO errorUser =
                            new LdapErrorUserDO()
                                    .setUuid(user.getUuid())
                                    .setLoginName(loginName)
                                    .setEmail(user.getEmail())
                                    .setRealName(user.getRealName())
                                    .setPhone(user.getPhone())
                                    .setCause(LdapErrorUserCause.EMAIL_ALREADY_EXISTED.value());
                    errorUsers.add(errorUser);
                } else {
                    insertUsers.add(user);
                    ldapSyncReport.incrementNewInsert();
                }
            }else {
                UserE userE = userRepository.selectByLoginName(loginName);
                //lastUpdatedBy=0则是程序同步的，跳过在用户界面上手动禁用的情况
                if (userE.getLastUpdatedBy().equals(0L) && !userE.getEnabled()) {
                    organizationUserService.enableUser(ldapSyncReport.getOrganizationId(), userE.getId());
                    ldapSyncReport.incrementUpdate();
                }
            }

        });
        insertUser(ldapSyncReport, errorUsers, insertUsers);
        insertErrorUser(errorUsers, ldapHistoryId);

        cleanAfterDataPersistence(insertUsers, nameSet, emailSet, subNameSet, subEmailSet, existedNames, existedEmails);
    }


    private Long compareWithDbAndDisabled(List<UserDO> users) {
        //获取同步列表中的loginNameSet
        Set<String> nameSet = users.stream().map(UserDO::getLoginName).collect(Collectors.toSet());
        //oracle In-list上限为1000，这里List size要小于1000
        List<Set<String>> subNameSet = CollectionUtils.subSet(nameSet, 999);
        //获取数据库中已存在登录名的userIdSet
        Set<Long> idsByExistedNames = new HashSet<>();
        subNameSet.forEach(set -> idsByExistedNames.addAll(userRepository.getIdsByMatchLoginName(set)));
        //oracle In-list上限为1000，这里List size要小于1000
        List<Set<Long>> idsByExistedNamesList = CollectionUtils.subSet(idsByExistedNames, 999);

        idsByExistedNamesList.forEach(set -> userRepository.disableByIdList(set));

        nameSet.clear();
        subNameSet.clear();
        return new Long(idsByExistedNames.size());
    }


    private void insertErrorUser(List<LdapErrorUserDO> errorUsers, Long ldapHistoryId) {
        if (!errorUsers.isEmpty()) {
            errorUsers.forEach(errorUser -> {
                errorUser.setLdapHistoryId(ldapHistoryId);
                ldapErrorUserMapper.insert(errorUser);
            });
        }
    }

    private void insertUser(LdapSyncReport ldapSyncReport, List<LdapErrorUserDO> errorUsers, List<UserDO> insertUsers) {
        if (!insertUsers.isEmpty()) {
            List<LdapErrorUserDO> errorUserList = organizationUserService.batchCreateUsers(insertUsers);
            errorUsers.addAll(errorUserList);
            Long errorCount = Long.valueOf(errorUserList.size());
            ldapSyncReport.reduceInsert(errorCount);
            ldapSyncReport.incrementError(errorCount);
        }
    }

    private void cleanAfterDataPersistence(List<UserDO> insertUsers, Set<String> nameSet, Set<String> emailSet,
                                           List<Set<String>> subNameSet, List<Set<String>> subEmailSet,
                                           Set<String> existedNames, Set<String> existedEmails) {
        insertUsers.clear();
        nameSet.clear();
        emailSet.clear();
        subNameSet.clear();
        subEmailSet.clear();
        existedNames.clear();
        existedEmails.clear();
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
