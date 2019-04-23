package io.choerodon.iam.api.validator;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.dto.LdapDTO;
import org.springframework.util.StringUtils;

/**
 * @author superlee
 */
public class LdapValidator {

    private LdapValidator() {
    }

    public static void validate(LdapDTO ldap) {
        if (StringUtils.isEmpty(ldap.getServerAddress())) {
            throw new CommonException("error.ldap.serverAddress.empty");
        }
        if (StringUtils.isEmpty(ldap.getLoginNameField())) {
            throw new CommonException("error.ldap.loginNameField.empty");
        }
        if (StringUtils.isEmpty(ldap.getEmailField())) {
            throw new CommonException("error.ldap.emailField.empty");
        }
        if (StringUtils.isEmpty(ldap.getObjectClass())) {
            throw new CommonException("error.ldap.objectClass.empty");
        }
    }
}
