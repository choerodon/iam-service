package io.choerodon.iam.infra.repository.impl;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.repository.RolePermissionRepository;
import io.choerodon.iam.infra.dto.RolePermissionDTO;
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
    public RolePermissionDTO selectOne(RolePermissionDTO rolePermissionDTO) {
        return rolePermissionMapper.selectOne(rolePermissionDTO);
    }

    @Override
    public RolePermissionDTO insert(RolePermissionDTO rolePermissionDTO) {
        if (rolePermissionMapper.insert(rolePermissionDTO) != 1) {
            throw new CommonException("error.rolePermission.insert");
        }
        return rolePermissionMapper.selectByPrimaryKey(rolePermissionDTO);
    }

    @Override
    public void delete(RolePermissionDTO rolePermissionDTO) {
        rolePermissionMapper.delete(rolePermissionDTO);
    }

    @Override
    public List<RolePermissionDTO> select(RolePermissionDTO rolePermissionDTO) {
        return rolePermissionMapper.select(rolePermissionDTO);
//        List<RolePermissionDO> rolePermissionDOList =
//                rolePermissionMapper.select(ConvertHelper.convert(rolePermissionE, RolePermissionDO.class));
//        return ConvertHelper.convertList(rolePermissionDOList, RolePermissionE.class);
    }

    @Override
    public List<Long> queryExistingPermissionIdsByRoleIds(List<Long> roles) {
        return rolePermissionMapper.queryExistingPermissionIdsByRoleIds(roles);
    }

    @Override
    public void insertList(List<RolePermissionDTO> rolePermissionDOList) {
        if (rolePermissionDOList != null) {
            try {
                rolePermissionDOList.forEach(r -> rolePermissionMapper.insertSelective(r));
            }catch (Exception e) {
                throw new CommonException("error.rolePermission.batch.insert");
            }
        }
    }
}
