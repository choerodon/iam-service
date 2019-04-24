package io.choerodon.iam.infra.repository.impl;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.repository.PasswordPolicyRepository;
import io.choerodon.iam.infra.dto.PasswordPolicyDTO;
import io.choerodon.iam.infra.mapper.PasswordPolicyMapper;
import org.springframework.stereotype.Component;

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
        return passwordPolicyMapper.selectByPrimaryKey(id);
//        return ConvertHelper.convert(passwordPolicyDO, PasswordPolicyDTO.class);
    }

    @Override
    public PasswordPolicyDTO queryByOrgId(Long orgId) {
        PasswordPolicyDTO dto = new PasswordPolicyDTO();
        dto.setOrganizationId(orgId);
        return passwordPolicyMapper.selectOne(dto);
//        return ConvertHelper.convert(passwordPolicyDO, PasswordPolicyDTO.class);
    }

    @Override
    public PasswordPolicyDTO create(PasswordPolicyDTO passwordPolicyDTO) {
//        PasswordPolicyDO passwordPolicyDO = ConvertHelper.convert(passwordPolicyDTO, PasswordPolicyDO.class);
        int isInsert = passwordPolicyMapper.insertSelective(passwordPolicyDTO);
        if (isInsert != 1) {
            throw new CommonException("error.passwordPolicy.create");
        }
        return  passwordPolicyMapper.selectByPrimaryKey(passwordPolicyDTO.getId());
//        return ConvertHelper.convert(passwordPolicyDO, PasswordPolicyE.class);
    }

    @Override
    public PasswordPolicyDTO update(Long id, PasswordPolicyDTO passwordPolicyDTO) {
//        PasswordPolicyDO passwordPolicyDO = ConvertHelper.convert(passwordPolicyDTO, PasswordPolicyDO.class);
        passwordPolicyDTO.setId(id);
        int isUpdate = passwordPolicyMapper.updateByPrimaryKeySelective(passwordPolicyDTO);
        if (isUpdate != 1) {
            throw new CommonException("error.passwordPolicy.update");
        }
        return passwordPolicyMapper.selectByPrimaryKey(passwordPolicyDTO.getId());
//        return ConvertHelper.convert(passwordPolicyDO, PasswordPolicyE.class);
    }
}
