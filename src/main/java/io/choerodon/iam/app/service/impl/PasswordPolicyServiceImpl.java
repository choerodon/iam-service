package io.choerodon.iam.app.service.impl;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.PasswordPolicyDTO;
import io.choerodon.iam.app.service.PasswordPolicyService;
import io.choerodon.iam.domain.oauth.entity.PasswordPolicyE;
import io.choerodon.iam.domain.repository.OrganizationRepository;
import io.choerodon.iam.domain.repository.PasswordPolicyRepository;
import io.choerodon.iam.infra.dataobject.OrganizationDO;
import org.springframework.stereotype.Component;

/**
 * @author wuguokai
 */
@Component
public class PasswordPolicyServiceImpl implements PasswordPolicyService {

    private OrganizationRepository organizationRepository;
    private PasswordPolicyRepository passwordPolicyRepository;

    public PasswordPolicyServiceImpl(OrganizationRepository organizationRepository, PasswordPolicyRepository passwordPolicyRepository) {
        this.organizationRepository = organizationRepository;
        this.passwordPolicyRepository = passwordPolicyRepository;
    }

    @Override
    public PasswordPolicyDTO create(Long orgId, PasswordPolicyDTO passwordPolicyDTO) {
        OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(orgId);
        if (organizationDO == null) {
            throw new CommonException("error.organization.not.exist");
        }
        passwordPolicyDTO.setOrganizationId(orgId);
        PasswordPolicyE passwordPolicyE =
                passwordPolicyRepository.create(ConvertHelper.convert(passwordPolicyDTO, PasswordPolicyE.class));
        return ConvertHelper.convert(passwordPolicyE, PasswordPolicyDTO.class);
    }

    @Override
    public PasswordPolicyDTO queryByOrgId(Long orgId) {
        return passwordPolicyRepository.queryByOrgId(orgId);
    }

    @Override
    public PasswordPolicyDTO query(Long id) {
        return passwordPolicyRepository.query(id);
    }

    @Override
    public PasswordPolicyDTO update(Long orgId, Long id, PasswordPolicyDTO passwordPolicyDTO) {
        OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(orgId);
        if (organizationDO == null) {
            throw new CommonException("error.organization.not.exist");
        }
        PasswordPolicyDTO old = query(id);
        if (orgId != old.getOrganizationId()) {
            throw new CommonException("error.passwordPolicy.organizationId.not.same");
        }
        PasswordPolicyE passwordPolicyE =
                passwordPolicyRepository.update(id, ConvertHelper.convert(passwordPolicyDTO, PasswordPolicyE.class));
        return ConvertHelper.convert(passwordPolicyE, PasswordPolicyDTO.class);
    }
}
