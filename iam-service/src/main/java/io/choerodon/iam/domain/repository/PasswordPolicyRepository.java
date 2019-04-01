package io.choerodon.iam.domain.repository;

import io.choerodon.iam.api.dto.PasswordPolicyDTO;
import io.choerodon.iam.domain.oauth.entity.PasswordPolicyE;

/**
 * @author wuguokai
 */
public interface PasswordPolicyRepository {
    PasswordPolicyDTO query(Long id);

    PasswordPolicyDTO queryByOrgId(Long orgId);

    PasswordPolicyE create(PasswordPolicyE passwordPolicyE);

    PasswordPolicyE update(Long id, PasswordPolicyE passwordPolicyE);

}
