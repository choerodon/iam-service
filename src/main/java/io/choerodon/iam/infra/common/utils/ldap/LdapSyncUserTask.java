package io.choerodon.iam.infra.common.utils.ldap;

import java.lang.reflect.Field;
import java.util.*;
import java.util.stream.Collectors;
import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchControls;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.app.service.OrganizationUserService;
import io.choerodon.iam.domain.repository.LdapHistoryRepository;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.infra.common.utils.CollectionUtils;
import io.choerodon.iam.infra.dto.LdapDTO;
import io.choerodon.iam.infra.dto.LdapErrorUserDTO;
import io.choerodon.iam.infra.dto.LdapHistoryDTO;
import io.choerodon.iam.infra.dto.UserDTO;
import io.choerodon.iam.infra.enums.LdapErrorUserCause;
import io.choerodon.iam.infra.mapper.LdapErrorUserMapper;
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

    @Async("ldap-executor")
    public void syncLDAPUser(LdapTemplate ldapTemplate, LdapDTO ldap, String syncType, FinishFallback fallback) {
        logger.info("@@@ start to sync users from ldap server, sync type: {}", syncType);
        LdapSyncReport ldapSyncReport = initLdapSyncReport(ldap);
        LdapHistoryDTO ldapHistory = initLdapHistory(ldap.getId());
        syncUsersFromLdapServer(ldapTemplate, ldap, ldapSyncReport, ldapHistory.getId(), syncType);
        logger.info("@@@ syncing users has been finished, sync type: {}, ldapSyncReport: {}", syncType, ldapSyncReport);
        fallback.callback(ldapSyncReport, ldapHistory);
    }

    private void syncUsersFromLdapServer(LdapTemplate ldapTemplate, LdapDTO ldap,
                                         LdapSyncReport ldapSyncReport, Long ldapHistoryId,
                                         String syncType) {
        //搜索控件
        final SearchControls searchControls = new SearchControls();
        searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE);
        //Filter
        AndFilter andFilter = getFilter(ldap);

        //分页PagedResultsDirContextProcessor
        final PagedResultsDirContextProcessor processor =
                new PagedResultsDirContextProcessor(ldap.getSagaBatchSize());
        AttributesMapper attributesMapper = getDefaultAttributesMapper();
        //反射获取ldapTemplate的ignorePartialResultException和ignoreNameNotFoundException值
        boolean ignorePartialResultException = false;
        boolean ignoreNameNotFoundException = false;
        try {
            Field ignorePartialResultExceptionField = ldapTemplate.getClass().getDeclaredField("ignorePartialResultException");
            Field ignoreNameNotFoundExceptionField = ldapTemplate.getClass().getDeclaredField("ignoreNameNotFoundException");
            ignorePartialResultExceptionField.setAccessible(true);
            ignoreNameNotFoundExceptionField.setAccessible(true);
            ignorePartialResultException = (boolean) ignorePartialResultExceptionField.get(ldapTemplate);
            ignoreNameNotFoundException = (boolean) ignoreNameNotFoundExceptionField.get(ldapTemplate);
        } catch (NoSuchFieldException e) {
            logger.warn("reflect to get field failed, exception: {}", e);
        } catch (IllegalAccessException e) {
            logger.warn("reflect to get field value failed, exception: {}", e);
        }
        SingleContextSource.doWithSingleContext(
                ldapTemplate.getContextSource(), new LdapOperationsCallback<List<UserDTO>>() {
                    @Override
                    public List<UserDTO> doWithLdapOperations(LdapOperations operations) {
                        Integer page = 1;
                        do {
                            List<UserDTO> users = new ArrayList<>();
                            List<LdapErrorUserDTO> errorUsers = new ArrayList<>();
                            List<Attributes> attributesList =
                                    operations.search("", andFilter.toString(), searchControls,
                                            attributesMapper, processor);
                            //将当前分页的数据做插入处理
                            if (attributesList.isEmpty()) {
                                logger.warn("can not find any attributes while filter is {}, page is {}", andFilter, page);
                                break;
                            } else {
                                processUserFromAttributes(ldap, attributesList, users, ldapSyncReport, errorUsers);
                                attributesList.clear();
                            }
                            //当前页做数据写入
                            if (!users.isEmpty()) {
                                switch (syncType) {
                                    case "sync":
                                        compareWithDbAndInsert(users, ldapSyncReport, errorUsers, ldapHistoryId);
                                        break;
                                    case "disable":
                                        disable(users, ldapSyncReport, errorUsers, ldapHistoryId);
                                        break;
                                    default:
                                        break;
                                }
                            }
                            users.clear();
                            errorUsers.clear();
                            page++;
                        } while (processor.hasMore());
//                        } while (processor.getCookie().getCookie() != null);
                        return null;
                    }
                }, false, ignorePartialResultException, ignoreNameNotFoundException);
    }

    private AndFilter getFilter(LdapDTO ldap) {
        AndFilter andFilter = getAndFilterByObjectClass(ldap);
        HardcodedFilter hardcodedFilter = new HardcodedFilter(ldap.getCustomFilter());
        andFilter.and(hardcodedFilter);
        return andFilter;
    }

    private AttributesMapper getDefaultAttributesMapper() {
        return new AttributesMapper() {
            @Override
            public Object mapFromAttributes(Attributes attributes) {
                return attributes;
            }
        };
    }

    private void processUserFromAttributes(LdapDTO ldap, List<Attributes> attributesList,
                                           List<UserDTO> users, LdapSyncReport ldapSyncReport,
                                           List<LdapErrorUserDTO> errorUsers) {
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
                LdapErrorUserDTO errorUser = new LdapErrorUserDTO();
                errorUser.setUuid(uuid);
                errorUser.setCause(LdapErrorUserCause.LOGIN_NAME_FIELD_NULL.value());
                errorUsers.add(errorUser);
                return;
            }
            try {
                loginName = loginNameAttribute.get().toString();
            } catch (NamingException e) {
                ldapSyncReport.incrementError();
                LdapErrorUserDTO errorUser = new LdapErrorUserDTO();
                errorUser.setUuid(uuid);
                errorUser.setCause(LdapErrorUserCause.LOGIN_NAME_GET_EXCEPTION.value());
                errorUsers.add(errorUser);
                return;
            }

            if (emailAttribute == null) {
                ldapSyncReport.incrementError();
                LdapErrorUserDTO errorUser = new LdapErrorUserDTO();
                errorUser.setUuid(uuid);
                errorUser.setCause(LdapErrorUserCause.EMAIL_FIELD_NULL.value());
                errorUsers.add(errorUser);
                return;
            }
            try {
                email = emailAttribute.get().toString();
            } catch (NamingException e) {
                ldapSyncReport.incrementError();
                LdapErrorUserDTO errorUser = new LdapErrorUserDTO();
                errorUser.setUuid(uuid);
                errorUser.setCause(LdapErrorUserCause.EMAIL_GET_EXCEPTION.value());
                errorUser.setLoginName(loginName);
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

            UserDTO user = new UserDTO();
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

    private AndFilter getAndFilterByObjectClass(LdapDTO ldapDTO) {
        String objectClass = ldapDTO.getObjectClass();
        String[] arr = objectClass.split(",");
        AndFilter andFilter = new AndFilter();
        for (String str : arr) {
            andFilter.and(new EqualsFilter(OBJECT_CLASS, str));
        }
        return andFilter;
    }

    private LdapSyncReport initLdapSyncReport(LdapDTO ldap) {
        Long organizationId = ldap.getOrganizationId();
        LdapSyncReport ldapSyncReport = new LdapSyncReport(organizationId);
        ldapSyncReport.setLdapId(ldap.getId());
        ldapSyncReport.setStartTime(new Date(System.currentTimeMillis()));
        return ldapSyncReport;
    }

    private void compareWithDbAndInsert(List<UserDTO> users, LdapSyncReport ldapSyncReport,
                                        List<LdapErrorUserDTO> errorUsers, Long ldapHistoryId) {
        ldapSyncReport.incrementCount(Long.valueOf(users.size()));
        List<UserDTO> insertUsers = new ArrayList<>();
        Set<String> nameSet = users.stream().map(UserDTO::getLoginName).collect(Collectors.toSet());
        Set<String> emailSet = users.stream().map(UserDTO::getEmail).collect(Collectors.toSet());
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
                    LdapErrorUserDTO errorUser = new LdapErrorUserDTO();
                    errorUser.setUuid(user.getUuid());
                    errorUser.setLoginName(loginName);
                    errorUser.setEmail(user.getEmail());
                    errorUser.setRealName(user.getRealName());
                    errorUser.setPhone(user.getPhone());
                    errorUser.setCause(LdapErrorUserCause.EMAIL_ALREADY_EXISTED.value());
                    errorUsers.add(errorUser);
                } else {
                    insertUsers.add(user);
                    ldapSyncReport.incrementNewInsert();
                }
            } else {
                UserDTO userDTO = userRepository.selectByLoginName(loginName);
                //lastUpdatedBy=0则是程序同步的，跳过在用户界面上手动禁用的情况
                if (userDTO.getLastUpdatedBy().equals(0L) && !userDTO.getEnabled()) {
                    organizationUserService.enableUser(ldapSyncReport.getOrganizationId(), userDTO.getId());
                    ldapSyncReport.incrementUpdate();
                }
            }

        });
        insertUser(ldapSyncReport, errorUsers, insertUsers);
        insertErrorUser(errorUsers, ldapHistoryId);

        cleanAfterDataPersistence(insertUsers, nameSet, emailSet, subNameSet, subEmailSet, existedNames, existedEmails);
    }


    private void disable(List<UserDTO> users, LdapSyncReport ldapSyncReport,
                         List<LdapErrorUserDTO> errorUsers, Long ldapHistoryId) {
        users.forEach(user -> {
            UserDTO userDTO = userRepository.selectByLoginName(user.getLoginName());
            if (userDTO == null) {
                return;
            }
            if (userDTO.getEnabled()) {
                try {
                    organizationUserService.disableUser(userDTO.getOrganizationId(), userDTO.getId());
                    ldapSyncReport.incrementUpdate();
                } catch (CommonException e) {
                    LdapErrorUserDTO errorUser = new LdapErrorUserDTO();
                    errorUser.setUuid(user.getUuid());
                    errorUser.setLoginName(user.getLoginName());
                    errorUser.setEmail(user.getEmail());
                    errorUser.setRealName(user.getRealName());
                    errorUser.setPhone(user.getPhone());
                    errorUser.setCause(LdapErrorUserCause.SEND_MESSAGE_FAILED.value());
                    errorUsers.add(errorUser);
                }
            }
        });
        insertErrorUser(errorUsers, ldapHistoryId);
    }


    private void insertErrorUser(List<LdapErrorUserDTO> errorUsers, Long ldapHistoryId) {
        if (!errorUsers.isEmpty()) {
            errorUsers.forEach(errorUser -> {
                errorUser.setLdapHistoryId(ldapHistoryId);
                ldapErrorUserMapper.insert(errorUser);
            });
        }
    }

    private void insertUser(LdapSyncReport ldapSyncReport, List<LdapErrorUserDTO> errorUsers, List<UserDTO> insertUsers) {
        if (!insertUsers.isEmpty()) {
            List<LdapErrorUserDTO> errorUserList = organizationUserService.batchCreateUsers(insertUsers);
            errorUsers.addAll(errorUserList);
            Long errorCount = Long.valueOf(errorUserList.size());
            ldapSyncReport.reduceInsert(errorCount);
            ldapSyncReport.incrementError(errorCount);
        }
    }

    private LdapHistoryDTO initLdapHistory(Long ldapId) {
        LdapHistoryDTO ldapHistory = new LdapHistoryDTO();
        ldapHistory.setLdapId(ldapId);
        ldapHistory.setSyncBeginTime(new Date(System.currentTimeMillis()));
        return ldapHistoryRepository.insertSelective(ldapHistory);
    }

    private void cleanAfterDataPersistence(List<UserDTO> insertUsers, Set<String> nameSet, Set<String> emailSet,
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
        LdapHistoryDTO callback(LdapSyncReport ldapSyncReport, LdapHistoryDTO ldapHistoryDTO);
    }


    @Component
    public class FinishFallbackImpl implements FinishFallback {

        private LdapHistoryRepository ldapHistoryRepository;

        public FinishFallbackImpl(LdapHistoryRepository ldapHistoryRepository) {
            this.ldapHistoryRepository = ldapHistoryRepository;
        }

        @Override
        public LdapHistoryDTO callback(LdapSyncReport ldapSyncReport, LdapHistoryDTO ldapHistoryDTO) {
            ldapHistoryDTO.setSyncEndTime(new Date(System.currentTimeMillis()));
            ldapHistoryDTO.setNewUserCount(ldapSyncReport.getInsert());
            ldapHistoryDTO.setUpdateUserCount(ldapSyncReport.getUpdate());
            ldapHistoryDTO.setErrorUserCount(ldapSyncReport.getError());
            return ldapHistoryRepository.updateByPrimaryKeySelective(ldapHistoryDTO);
        }
    }
}
