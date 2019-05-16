package io.choerodon.iam.app.service.impl;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.app.service.PasswordPolicyService;
import io.choerodon.iam.domain.repository.OrganizationRepository;
import io.choerodon.iam.domain.repository.PasswordPolicyRepository;
import io.choerodon.iam.infra.dto.OrganizationDTO;
import io.choerodon.iam.infra.dto.PasswordPolicyDTO;
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
        OrganizationDTO organizationDTO = organizationRepository.selectByPrimaryKey(orgId);
        if (organizationDTO == null) {
            throw new CommonException("error.organization.not.exist");
        }
        passwordPolicyDTO.setOrganizationId(orgId);
        return passwordPolicyRepository.create(passwordPolicyDTO);
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
        OrganizationDTO organizationDTO = organizationRepository.selectByPrimaryKey(orgId);
        if (organizationDTO == null) {
            throw new CommonException("error.organization.not.exist");
        }
        PasswordPolicyDTO old = query(id);
        if (!orgId.equals(old.getOrganizationId())) {
            throw new CommonException("error.passwordPolicy.organizationId.not.same");
        }
        return
                passwordPolicyRepository.update(id, passwordPolicyDTO);
    }
}
