package io.choerodon.iam.app.service;


import io.choerodon.iam.infra.dto.PasswordPolicyDTO;

/**
 * @author wuguokai
 */
public interface PasswordPolicyService {
    PasswordPolicyDTO create(Long orgId, PasswordPolicyDTO passwordPolicyDTO);

    PasswordPolicyDTO queryByOrgId(Long orgId);

    PasswordPolicyDTO query(Long id);

    PasswordPolicyDTO update(Long orgId, Long id, PasswordPolicyDTO passwordPolicyDTO);
}
