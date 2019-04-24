package io.choerodon.iam.api.validator;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.dto.PasswordPolicyDTO;
import io.choerodon.iam.infra.mapper.PasswordPolicyMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author wuguokai
 */
@Component
public class PasswordPolicyValidator {
    @Autowired
    private PasswordPolicyMapper passwordPolicyMapper;

    public void create(Long orgId, PasswordPolicyDTO passwordPolicyDTO) {
        PasswordPolicyDTO dto = new PasswordPolicyDTO();
        dto.setOrganizationId(orgId);
        if (!passwordPolicyMapper.select(dto).isEmpty()) {
            throw new CommonException("error.passwordPolicy.organizationId.exist");
        }
        dto.setOrganizationId(null);
        dto.setCode(passwordPolicyDTO.getCode());
        if (!passwordPolicyMapper.select(dto).isEmpty()) {
            throw new CommonException("error.passwordPolicy.code.exist");
        }
    }

    public void update(Long orgId, Long passwordPolicyId, PasswordPolicyDTO passwordPolicyDTO) {
        PasswordPolicyDTO dto = passwordPolicyMapper.selectByPrimaryKey(passwordPolicyId);
        if (dto == null) {
            throw new CommonException("error.passwordPolicy.not.exist");
        }
        if (!orgId.equals(dto.getOrganizationId())) {
            throw new CommonException("error.passwordPolicy.organizationId.not.same");
        }

        // the sum of all the fields with least length requirement is greater than maxLength
        int allLeastRequiredLength = passwordPolicyDTO.getDigitsCount() +
                passwordPolicyDTO.getSpecialCharCount() +
                passwordPolicyDTO.getLowercaseCount() +
                passwordPolicyDTO.getUppercaseCount();
        if (allLeastRequiredLength > passwordPolicyDTO.getMaxLength()) {
            throw new CommonException("error.allLeastRequiredLength.greaterThan.maxLength");
        }

        if (passwordPolicyDTO.getMinLength() > passwordPolicyDTO.getMaxLength()) {
            throw new CommonException("error.maxLength.lessThan.minLength");
        }

        passwordPolicyDTO.setCode(null);
        passwordPolicyDTO.setOrganizationId(null);
    }

}
