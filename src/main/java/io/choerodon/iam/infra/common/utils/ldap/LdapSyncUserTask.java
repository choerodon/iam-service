package io.choerodon.iam.infra.common.utils.ldap;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.iam.api.dto.UserDTO;
import io.choerodon.iam.app.service.OrganizationUserService;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.infra.dataobject.UserDO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.LdapContext;

import static java.lang.Thread.sleep;

/**
 * @author wuguokai
 */
@RefreshScope
@Component
public class LdapSyncUserTask {
    private static final Logger logger = LoggerFactory.getLogger(LdapSyncUserTask.class);

    @Value("${choerodon.ldap.userNameType:1}")
    private int ldapUserNameType;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrganizationUserService organizationUserService;

    @Async("ldap-executor")
    public void syncLDAPUser(LdapContext ldapContext, Long organizationId, FinishFallback fallback) {
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
            UserDO user = extractUser(attributes, organizationId, ldapUserNameType);
            if (user == null) {
                continue;
            }
            ldapSyncReport.incrementCount();
            UserDO old = ConvertHelper.convert(userRepository.selectByLoginName(user.getLoginName()), UserDO.class);
            if (old == null) {
                try {
                    organizationUserService.create(ConvertHelper.convert(user, UserDTO.class), false);
                    sleep(100);
                } catch (Exception e) {
                    logger.info(user.getLoginName(), e);
                    ldapSyncReport.incrementError();
                }
                ldapSyncReport.incrementNewInsert();
                logger.info("{} 同步成功,已经同步用户数：{}", user.getLoginName(), ldapSyncReport.getCount());
            } else if (old.getPhone() == null || !old.getPhone().equals(user.getPhone())) {
                old.setPhone(user.getPhone());
                if (null == organizationUserService.update(ConvertHelper.convert(old, UserDTO.class))) {
                    ldapSyncReport.incrementError();
                    logger.info("update user phone error {} ", user.getLoginName());
                }
                logger.info("update user phone  {} ", user.getLoginName());
                ldapSyncReport.incrementUpdate();
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

    private UserDO extractUser(Attributes attributes, Long organizationId, int usernameType) {
        UserDO user = new UserDO();
        try {
            if (attributes.get("employeeNumber") == null
                    || attributes.get("mail") == null
                    || attributes.get("displayName") == null
                    || attributes.get("mobile") == null
                    || "1".equals(attributes.get("employeeType").get().toString())) {
                return null;
            }
            user.setOrganizationId(organizationId);
            if (usernameType == 0) {
                user.setLoginName(attributes.get("employeeNumber").get().toString());
            } else if (usernameType == 2) {
                user.setLoginName(attributes.get("mobile").get().toString());
            } else {
                user.setLoginName(attributes.get("mail").get().toString());
            }
            user.setRealName(attributes.get("displayName").get().toString());
            user.setEmail(attributes.get("mail").get().toString());
            user.setPhone(attributes.get("mobile").get().toString());
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
