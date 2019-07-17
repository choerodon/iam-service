package io.choerodon.iam.infra.asserts;

import io.choerodon.iam.infra.dto.LdapDTO;
import io.choerodon.iam.infra.exception.IllegalArgumentException;
import io.choerodon.iam.infra.exception.NotExistedException;
import io.choerodon.iam.infra.mapper.LdapMapper;
import org.springframework.stereotype.Component;

/**
 * ldap断言帮助类
 *
 * @author superlee
 * @since 2019-07-11
 */
@Component
public class LdapAssertHelper extends AssertHelper {

    private LdapMapper ldapMapper;

    public LdapAssertHelper(LdapMapper ldapMapper) {
        this.ldapMapper = ldapMapper;
    }

    public LdapDTO ldapNotExisted(WhichColumn whichColumn, Long id) {
        return ldapNotExisted(whichColumn, id, "error.ldap.not.exist");
    }

    public LdapDTO ldapNotExisted(WhichColumn whichColumn, Long id, String message) {
        switch (whichColumn) {
            case ID:
                return idNotExisted(id, message);
            case ORGANIZATION_ID:
                return organizationIdNotExisted(id, message);
            default:
                throw new IllegalArgumentException("error.illegal.whichColumn", whichColumn.value);
        }
    }

    private LdapDTO organizationIdNotExisted(Long id, String message) {
        LdapDTO dto = new LdapDTO();
        dto.setOrganizationId(id);
        LdapDTO result = ldapMapper.selectOne(dto);
        if (result == null) {
            throw new NotExistedException(message);
        }
        return result;
    }

    private LdapDTO idNotExisted(Long id, String message) {
        LdapDTO dto = ldapMapper.selectByPrimaryKey(id);
        if (dto == null) {
            throw new NotExistedException(message);
        }
        return dto;
    }

    public enum WhichColumn {
        /**
         * id
         */
        ID("id"),

        /**
         * organization_id
         */
        ORGANIZATION_ID("organization_id");

        private String value;

        WhichColumn(String value) {
            this.value = value;
        }
    }
}
