package io.choerodon.iam.infra.common.utils.ldap;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.iam.api.dto.UserDTO;
import io.choerodon.iam.app.service.OrganizationUserService;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.infra.dataobject.LdapDO;
import io.choerodon.iam.infra.dataobject.UserDO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.LdapContext;


/**
 * @author wuguokai
 */
@RefreshScope
@Component
public class LdapSyncUserTask {
    private static final Logger logger = LoggerFactory.getLogger(LdapSyncUserTask.class);

    private static final String DIMISSION_VALUE = "1";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrganizationUserService organizationUserService;

    @Async("ldap-executor")
    public void syncLDAPUser(LdapContext ldapContext, LdapDO ldap, Boolean anonymous, FinishFallback fallback) {
        Long organizationId = ldap.getOrganizationId();
        LdapSyncReport ldapSyncReport = new LdapSyncReport(organizationId);
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
        logger.info("start async user");
        ldapSyncReport.setStartTime(System.currentTimeMillis());
        while (namingEnumeration != null && namingEnumeration.hasMoreElements()) {
            //maybe more than one element
            SearchResult searchResult = (SearchResult) namingEnumeration.nextElement();
            Attributes attributes = searchResult.getAttributes();
            UserDO user = extractUser(attributes, organizationId, ldap, anonymous);
            if (user == null) {
                continue;
            }
            ldapSyncReport.incrementCount();
            UserDTO oldUser =
                    ConvertHelper.convert(userRepository.selectByLoginName(user.getLoginName()), UserDTO.class);
            if (oldUser == null) {
                //插入操作
                try {
                    organizationUserService.create(ConvertHelper.convert(user, UserDTO.class), false);
                    ldapSyncReport.incrementNewInsert();
                    logger.info("{} 同步成功,已经同步用户数：{}", user.getLoginName(), ldapSyncReport.getCount());
                } catch (Exception e) {
                    logger.info("insert error, login_name = {}, exception : {}",user.getLoginName(), e);
                    ldapSyncReport.incrementError();
                }
            } else {
                //更新操作
                //loginName和email不能更新
                boolean doUpdate = false;
                if (oldUser.getPhone() != null && !oldUser.getPhone().equals(user.getPhone())) {
                    oldUser.setPhone(user.getPhone());
                    doUpdate = true;
                }
                if (oldUser.getRealName() != null && !oldUser.getRealName().equals(user.getRealName())) {
                    oldUser.setRealName(user.getRealName());
                    doUpdate = true;
                }
                if (doUpdate) {
                    try {
                        organizationUserService.update(oldUser);
                    } catch (Exception e) {
                        logger.info("update error, login_name = {}, exception : {}", user.getLoginName(), e);
                        ldapSyncReport.incrementError();
                    }
                }

            }
        }
        ldapSyncReport.setEndTime(System.currentTimeMillis());
        logger.info("async finished : {}", ldapSyncReport);
        try {
            ldapContext.close();
        } catch (NamingException e) {
            logger.warn("error.close.ldap.connect");
        }
        if (fallback != null) {
            fallback.callback(ldapSyncReport);
        }
    }

    private UserDO extractUser(Attributes attributes, Long organizationId, LdapDO ldap, Boolean anonymous) {
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
        void callback(LdapSyncReport ldapSyncReport);
    }
}
