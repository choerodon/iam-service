package io.choerodon.iam.infra.common.utils.ldap;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.iam.api.dto.UserDTO;
import io.choerodon.iam.app.service.OrganizationUserService;
import io.choerodon.iam.domain.repository.LdapHistoryRepository;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.infra.dataobject.LdapDO;
import io.choerodon.iam.infra.dataobject.LdapHistoryDO;
import io.choerodon.iam.infra.dataobject.UserDO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.LdapContext;
import java.util.Date;


/**
 * @author wuguokai
 */
@RefreshScope
@Component
public class LdapSyncUserTask {
    private static final Logger logger = LoggerFactory.getLogger(LdapSyncUserTask.class);

    private static final String DIMISSION_VALUE = "1";

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
    public void syncLDAPUser(LdapContext ldapContext, LdapDO ldap, FinishFallback fallback) {
        Long organizationId = ldap.getOrganizationId();
        LdapSyncReport ldapSyncReport = new LdapSyncReport(organizationId);
        ldapSyncReport.setLdapId(ldap.getId());
        SearchControls constraints = new SearchControls();
        // 设置搜索范围
        constraints.setSearchScope(SearchControls.SUBTREE_SCOPE);
        NamingEnumeration namingEnumeration = null;
        try {
            namingEnumeration = ldapContext.search("",
                    "objectClass=*", constraints);
        } catch (NamingException e) {
            logger.info("ldap search fail: {}", e);
        }
        logger.info("@@@ start async user");
        ldapSyncReport.setStartTime(new Date(System.currentTimeMillis()));
        LdapHistoryDO ldapHistory = new LdapHistoryDO();
        ldapHistory.setLdapId(ldap.getId());
        ldapHistory.setSyncBeginTime(ldapSyncReport.getStartTime());
        LdapHistoryDO ldapHistoryDO = ldapHistoryRepository.insertSelective(ldapHistory);
        while (namingEnumeration != null && namingEnumeration.hasMoreElements()) {
            //maybe more than one element
            SearchResult searchResult = (SearchResult) namingEnumeration.nextElement();
            Attributes attributes = searchResult.getAttributes();
            UserDO user = extractUser(attributes, organizationId, ldap);
            if (user == null) {
                continue;
            }
            ldapSyncReport.incrementCount();
            UserDTO oldUser =
                    ConvertHelper.convert(userRepository.selectByLoginName(user.getLoginName()), UserDTO.class);
            insertOrUpdateUser(ldapSyncReport, user, oldUser);
        }
        ldapSyncReport.setEndTime(new Date(System.currentTimeMillis()));
        logger.info("async finished : {}", ldapSyncReport);
        try {
            ldapContext.close();
        } catch (NamingException e) {
            logger.warn("error.close.ldap.connect");
        }
        fallback.callback(ldapSyncReport, ldapHistoryDO);
    }

    private void insertOrUpdateUser(LdapSyncReport ldapSyncReport, UserDO user, UserDTO oldUser) {
        if (oldUser == null) {
            //插入操作
            try {
                organizationUserService.create(ConvertHelper.convert(user, UserDTO.class), false);
                ldapSyncReport.incrementNewInsert();
            } catch (Exception e) {
                logger.info("insert error, login_name = {}, exception : {}", user.getLoginName(), e);
                ldapSyncReport.incrementError();
            }
        } else {
            //更新操作，只更新realName和phone字段
            //更新策略：数据库存在的用户和ldap拿到的用户，根据loginName判断是不是同一个用户，
            //同一个用户的话，以phone为例：
            //新用户phone和旧用户phone都为空，不更新
            //新用户phone为空，旧用户phone不为空，不更新
            //新用户phone不为空，旧用户phone为空，更新
            //新用户和旧用户phone字段都不为空，且新用户phone与旧用户phone不相等，更新，否则不更新
            boolean doUpdate = false;
            if (user.getPhone() != null && !user.getPhone().equals(oldUser.getPhone())) {
                oldUser.setPhone(user.getPhone());
                doUpdate = true;
            }
            if (user.getRealName() != null && !user.getRealName().equals(oldUser.getRealName())) {
                oldUser.setRealName(user.getRealName());
                doUpdate = true;
            }
            if (doUpdate) {
                try {
                    organizationUserService.update(oldUser);
                    ldapSyncReport.incrementUpdate();
                } catch (Exception e) {
                    logger.info("update error, login_name = {}, exception : {}", user.getLoginName(), e);
                    ldapSyncReport.incrementError();
                }
            }

        }
    }

    private UserDO extractUser(Attributes attributes, Long organizationId, LdapDO ldap) {
        UserDO user = new UserDO();
        user.setOrganizationId(organizationId);
        try {
            //离职的用户不同步
            if (attributes.get("employeeType") == null
                    || DIMISSION_VALUE.equals(attributes.get("employeeType").get().toString())) {
                return null;
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
        user.setEnabled(true);
        user.setLanguage("zh_CN");
        user.setTimeZone("CTT");
        user.setPassword("unknown password");
        user.setLocked(false);
        user.setLdap(true);
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
