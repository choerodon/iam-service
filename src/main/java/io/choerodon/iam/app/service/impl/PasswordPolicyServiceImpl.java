package io.choerodon.iam.app.service.impl;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.app.service.PasswordPolicyService;
import io.choerodon.iam.infra.asserts.OrganizationAssertHelper;
import io.choerodon.iam.infra.dto.PasswordPolicyDTO;
import io.choerodon.iam.infra.exception.InsertException;
import io.choerodon.iam.infra.exception.UpdateExcetion;
import io.choerodon.iam.infra.mapper.PasswordPolicyMapper;
import org.springframework.stereotype.Component;

/**
 * @author wuguokai
 */
@Component
public class PasswordPolicyServiceImpl implements PasswordPolicyService {

    private OrganizationAssertHelper organizationAssertHelper;
    private PasswordPolicyMapper passwordPolicyMapper;

    public PasswordPolicyServiceImpl(OrganizationAssertHelper organizationAssertHelper,
                                     PasswordPolicyMapper passwordPolicyMapper) {
        this.organizationAssertHelper = organizationAssertHelper;
        this.passwordPolicyMapper = passwordPolicyMapper;
    }

    @Override
    public PasswordPolicyDTO create(Long orgId, PasswordPolicyDTO passwordPolicyDTO) {
        organizationAssertHelper.organizationNotExisted(orgId);
        passwordPolicyDTO.setOrganizationId(orgId);
        if (passwordPolicyMapper.insertSelective(passwordPolicyDTO) != 1) {
            throw new InsertException("error.passwordPolicy.create");
        }
        return passwordPolicyMapper.selectByPrimaryKey(passwordPolicyDTO.getId());
    }

    @Override
    public PasswordPolicyDTO queryByOrgId(Long orgId) {
        PasswordPolicyDTO dto = new PasswordPolicyDTO();
        dto.setOrganizationId(orgId);
        return passwordPolicyMapper.selectOne(dto);
    }

    @Override
    public PasswordPolicyDTO query(Long id) {
        return passwordPolicyMapper.selectByPrimaryKey(id);
    }

    @Override
    public PasswordPolicyDTO update(Long orgId, Long id, PasswordPolicyDTO passwordPolicyDTO) {
        organizationAssertHelper.organizationNotExisted(orgId);
        PasswordPolicyDTO old = passwordPolicyMapper.selectByPrimaryKey(id);
        if (!orgId.equals(old.getOrganizationId())) {
            throw new CommonException("error.passwordPolicy.organizationId.not.same");
        }
        passwordPolicyDTO.setId(id);
        if (passwordPolicyMapper.updateByPrimaryKeySelective(passwordPolicyDTO) != 1) {
            throw new UpdateExcetion("error.passwordPolicy.update");
        }
        return passwordPolicyMapper.selectByPrimaryKey(passwordPolicyDTO.getId());
    }
}
