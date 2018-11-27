package io.choerodon.iam.infra.repository.impl;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.iam.entity.RolePermissionE;
import io.choerodon.iam.domain.repository.RolePermissionRepository;
import io.choerodon.iam.infra.dataobject.RolePermissionDO;
import io.choerodon.iam.infra.mapper.RolePermissionMapper;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author wuguokai
 */
@Component
public class RolePermissionRepositoryImpl implements RolePermissionRepository {

    private RolePermissionMapper rolePermissionMapper;

    public RolePermissionRepositoryImpl(RolePermissionMapper rolePermissionMapper) {
        this.rolePermissionMapper = rolePermissionMapper;
    }

    @Override
    public RolePermissionE selectOne(RolePermissionE rolePermissionE) {
        RolePermissionDO rolePermissionDO = ConvertHelper.convert(rolePermissionE, RolePermissionDO.class);
        return ConvertHelper.convert(rolePermissionMapper.selectOne(rolePermissionDO), RolePermissionE.class);
    }

    @Override
    public RolePermissionE insert(RolePermissionE rolePermissionE) {
        RolePermissionDO rolePermissionDO = ConvertHelper.convert(rolePermissionE, RolePermissionDO.class);
        if (rolePermissionMapper.insert(rolePermissionDO) != 1) {
            throw new CommonException("error.rolePermission.insert");
        }
        return ConvertHelper.convert(rolePermissionDO, RolePermissionE.class);
    }

    @Override
    public void delete(RolePermissionE rolePermissionE) {
        RolePermissionDO rolePermissionDO = ConvertHelper.convert(rolePermissionE, RolePermissionDO.class);
        rolePermissionMapper.delete(rolePermissionDO);
    }

    @Override
    public List<RolePermissionE> select(RolePermissionE rolePermissionE) {
        List<RolePermissionDO> rolePermissionDOList =
                rolePermissionMapper.select(ConvertHelper.convert(rolePermissionE, RolePermissionDO.class));
        return ConvertHelper.convertList(rolePermissionDOList, RolePermissionE.class);
    }

    @Override
    public List<Long> queryExistingPermissionIdsByRoleIds(List<Long> roles) {
        return rolePermissionMapper.queryExistingPermissionIdsByRoleIds(roles);
    }

    @Override
    public void insertList(List<RolePermissionDO> rolePermissionDOList) {
        if (rolePermissionDOList == null || rolePermissionDOList.isEmpty()) {
            return;
        }
        if (rolePermissionMapper.insertList(rolePermissionDOList) != rolePermissionDOList.size()) {
            throw new CommonException("error.rolePermission.insert");
        }
    }
}
