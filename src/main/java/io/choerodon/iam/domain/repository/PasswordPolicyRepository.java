package io.choerodon.iam.domain.repository;


import io.choerodon.iam.infra.dto.PasswordPolicyDTO;

/**
 * @author wuguokai
 */
public interface PasswordPolicyRepository {
    PasswordPolicyDTO query(Long id);

    PasswordPolicyDTO queryByOrgId(Long orgId);

    PasswordPolicyDTO create(PasswordPolicyDTO passwordPolicyDTO);

    PasswordPolicyDTO update(Long id, PasswordPolicyDTO passwordPolicyDTO);

}
