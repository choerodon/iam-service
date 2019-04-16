package io.choerodon.iam.app.service.impl;

import io.choerodon.base.enums.ResourceType;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.app.service.RoleService;
import io.choerodon.iam.infra.dto.RoleDTO;
import io.choerodon.iam.infra.mapper.RoleMapper;
import io.choerodon.iam.infra.utils.RoleAssertHelper;
import io.choerodon.mybatis.service.BaseServiceImpl;
import org.springframework.stereotype.Service;

/**
 * @author superlee
 * @since 2019-04-15
 */
@Service
public class RoleServiceImpl extends BaseServiceImpl<RoleDTO> implements RoleService {

    private RoleMapper roleMapper;

    private RoleAssertHelper roleAssertHelper;

    public RoleServiceImpl(RoleMapper roleMapper, RoleAssertHelper roleAssertHelper) {
        this.roleAssertHelper = roleAssertHelper;
        this.roleMapper = roleMapper;
    }

    @Override
    public RoleDTO create(RoleDTO roleDTO) {
        preCreate(roleDTO);
        insertSelective(roleDTO);

        return selectByPrimaryKey(roleDTO);
    }

    private void preCreate(RoleDTO roleDTO) {
        if (!ResourceType.contains(roleDTO.getResourceLevel())) {
            throw new CommonException("error.role.illegal.level");
        }
        roleAssertHelper.codeExisted(roleDTO.getCode());
        roleDTO.setEnabled(true);
        roleDTO.setModified(true);
        roleDTO.setEnableForbidden(true);
        roleDTO.setBuiltIn(false);
    }
}
