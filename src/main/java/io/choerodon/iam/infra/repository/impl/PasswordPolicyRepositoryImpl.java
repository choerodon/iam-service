package io.choerodon.iam.infra.repository.impl;

import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.PasswordPolicyDTO;
import io.choerodon.iam.domain.oauth.entity.PasswordPolicyE;
import io.choerodon.iam.domain.repository.PasswordPolicyRepository;
import io.choerodon.iam.infra.dataobject.PasswordPolicyDO;
import io.choerodon.iam.infra.mapper.PasswordPolicyMapper;

/**
 * @author wuguokai
 */
@Component
public class PasswordPolicyRepositoryImpl implements PasswordPolicyRepository {

    private PasswordPolicyMapper passwordPolicyMapper;

    public PasswordPolicyRepositoryImpl(PasswordPolicyMapper passwordPolicyMapper) {
        this.passwordPolicyMapper = passwordPolicyMapper;
    }

    @Override
    public PasswordPolicyDTO query(Long id) {
        PasswordPolicyDO passwordPolicyDO = passwordPolicyMapper.selectByPrimaryKey(id);
        return ConvertHelper.convert(passwordPolicyDO, PasswordPolicyDTO.class);
    }

    @Override
    public PasswordPolicyDTO queryByOrgId(Long orgId) {
        PasswordPolicyDO passwordPolicyDO = passwordPolicyMapper.queryByOrgId(orgId);
        return ConvertHelper.convert(passwordPolicyDO, PasswordPolicyDTO.class);
    }

    @Override
    public PasswordPolicyE create(PasswordPolicyE passwordPolicyE) {
        PasswordPolicyDO passwordPolicyDO = ConvertHelper.convert(passwordPolicyE, PasswordPolicyDO.class);
        int isInsert = passwordPolicyMapper.insertSelective(passwordPolicyDO);
        if (isInsert != 1) {
            throw new CommonException("error.passwordPolicy.create");
        }
        passwordPolicyDO = passwordPolicyMapper.selectByPrimaryKey(passwordPolicyDO.getId());
        return ConvertHelper.convert(passwordPolicyDO, PasswordPolicyE.class);
    }

    @Override
    public PasswordPolicyE update(Long id, PasswordPolicyE passwordPolicyE) {
        PasswordPolicyDO passwordPolicyDO = ConvertHelper.convert(passwordPolicyE, PasswordPolicyDO.class);
        passwordPolicyDO.setId(id);
        int isUpdate = passwordPolicyMapper.updateByPrimaryKeySelective(passwordPolicyDO);
        if (isUpdate != 1) {
            throw new CommonException("error.passwordPolicy.update");
        }
        passwordPolicyDO = passwordPolicyMapper.selectByPrimaryKey(passwordPolicyDO.getId());
        return ConvertHelper.convert(passwordPolicyDO, PasswordPolicyE.class);
    }
}
