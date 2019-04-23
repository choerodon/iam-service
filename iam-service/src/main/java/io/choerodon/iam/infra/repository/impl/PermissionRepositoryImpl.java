package io.choerodon.iam.infra.repository.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.repository.PermissionRepository;
import io.choerodon.iam.infra.dto.PermissionDTO;
import io.choerodon.iam.infra.dto.RoleDTO;
import io.choerodon.iam.infra.mapper.PermissionMapper;
import org.springframework.stereotype.Component;
import tk.mybatis.mapper.entity.Example;

import java.util.List;
import java.util.Set;

/**
 * @author wuguokai
 */
@Component
public class PermissionRepositoryImpl implements PermissionRepository {

    private PermissionMapper permissionMapper;

    public PermissionRepositoryImpl(PermissionMapper permissionMapper) {
        this.permissionMapper = permissionMapper;
    }

    @Override
    public List<PermissionDTO> select(PermissionDTO permissionDTO) {
        return permissionMapper.select(permissionDTO);
    }

    @Override
    public boolean existByCode(String code) {
        PermissionDTO example = new PermissionDTO();
        example.setCode(code);
        return permissionMapper.selectOne(example) != null;
    }

    @Override
    public void deleteById(Long id) {
        permissionMapper.deleteByPrimaryKey(id);
    }

    @Override
    public Page<PermissionDTO> pagingQuery(int page, int size, PermissionDTO permissionDTO, String param) {
        return PageHelper.startPage(page, size).doSelectPage(() -> permissionMapper.fuzzyQuery(permissionDTO, param));
    }

    @Override
    public List<PermissionDTO> selectByRoleId(Long roleId) {
        return permissionMapper.selectByRoleId(roleId, null);
    }

    @Override
    public PermissionDTO selectByCode(String code) {
        PermissionDTO example = new PermissionDTO();
        example.setCode(code);
        return permissionMapper.selectOne(example);
    }

    @Override
    public PermissionDTO insertSelective(PermissionDTO permissionDTO) {
        if (permissionMapper.insertSelective(permissionDTO) != 1) {
            throw new CommonException("error.permission.insert");
        }
        return permissionMapper.selectByPrimaryKey(permissionDTO);
    }

    @Override
    public PermissionDTO updateSelective(PermissionDTO permissionDTO) {
        if (permissionMapper.updateByPrimaryKeySelective(permissionDTO) != 1) {
            throw new CommonException("error.permission.update");
        }
        return permissionMapper.selectByPrimaryKey(permissionDTO.getId());
    }

    @Override
    public PermissionDTO selectByPrimaryKey(Object key) {
        return permissionMapper.selectByPrimaryKey(key);
    }

    @Override
    public Set<String> checkPermission(Long memberId, String sourceType, Long sourceId, Set<String> codes) {
        return permissionMapper.checkPermission(memberId, sourceType, sourceId, codes);
    }

    @Override
    public List<PermissionDTO> query(String level, String serviceName, String code) {
        Example example = new Example(PermissionDTO.class);
        example.setOrderByClause("code asc");
        example.createCriteria()
                .andEqualTo("resource_level", level)
                .andEqualTo("service_code", serviceName)
                .andEqualTo("code", code);
        return permissionMapper.selectByExample(example);
    }

    @Override
    public Page<PermissionDTO> pagingQueryByRoleId(int page, int size, Long id, String params) {
        return PageHelper.startPage(page, size).doSelectPage(() -> permissionMapper.selectByRoleId(id, params));
    }

    @Override
    public List<PermissionDTO> selectErrorLevelPermissionByRole(RoleDTO roleDTO) {
        return permissionMapper.selectErrorLevelPermissionByRole(roleDTO);
    }
}
