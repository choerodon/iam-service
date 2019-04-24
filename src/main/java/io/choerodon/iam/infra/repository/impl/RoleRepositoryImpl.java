package io.choerodon.iam.infra.repository.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.query.RoleQuery;
import io.choerodon.iam.domain.repository.RoleRepository;
import io.choerodon.iam.infra.dto.RoleDTO;
import io.choerodon.iam.infra.mapper.RoleMapper;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author superlee
 */
@Component
public class RoleRepositoryImpl implements RoleRepository {

    private RoleMapper mapper;

    public RoleRepositoryImpl(RoleMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public Page<RoleDTO> pagingQuery(int page, int size, RoleQuery roleQuery) {
        return PageHelper.startPage(page, size).doSelectPage(() -> mapper.fulltextSearch(roleQuery));
    }

    @Override
    public RoleDTO selectByCode(String code) {
        RoleDTO roleDTO = new RoleDTO();
        roleDTO.setCode(code);
        return mapper.selectOne(roleDTO);
    }

    @Override
    public RoleDTO insertSelective(RoleDTO roleDTO) {
        if (mapper.insertSelective(roleDTO) != 1) {
            throw new CommonException("error.role.insert");
        }
        return mapper.selectByPrimaryKey(roleDTO);
    }

    @Override
    public RoleDTO selectByPrimaryKey(Long id) {
        return mapper.selectByPrimaryKey(id);
    }

    @Override
    public RoleDTO updateSelective(RoleDTO roleDTO) {
        if (mapper.updateByPrimaryKeySelective(roleDTO) != 1) {
            throw new CommonException("error.role.update");
        }
        return mapper.selectByPrimaryKey(roleDTO);
    }

    @Override
    public void deleteByPrimaryKey(Long id) {
        mapper.deleteByPrimaryKey(id);
    }

    @Override
    public RoleDTO selectRoleWithPermissionsAndLabels(Long id) {
        return mapper.selectRoleWithPermissionsAndLabels(id);
    }

    @Override
    public List<RoleDTO> select(RoleDTO roleDTO) {
        return mapper.select(roleDTO);
    }

    @Override
    public List<Long> queryRoleByUser(Long userId, String sourceType, Long sourceId) {
        return mapper.queryRoleByUser(userId, sourceType, sourceId);
    }

    @Override
    public RoleDTO selectOne(RoleDTO roleDTO) {
        return mapper.selectOne(roleDTO);
    }

    @Override
    public boolean judgeRolesSameLevel(List<Long> roleIds) {
        if (roleIds.isEmpty()) {
            throw new CommonException("error.roleIds.null");
        }
        int levelCount = mapper.rolesLevelCount(roleIds);
        return levelCount == 1;
    }

    @Override
    public List<RoleDTO> selectRolesByLabelNameAndType(String name, String type) {
        return mapper.selectRolesByLabelNameAndType(name, type);
    }

    @Override
    public List<RoleDTO> selectInitRolesByPermissionId(Long permissionId) {
        return mapper.selectInitRolesByPermissionId(permissionId);
    }

//    @Override
//    public Set<String> matchCode(Set<String> codeSet) {
//        return mapper.matchCode(codeSet);
//    }
//
//    @Override
//    public List<RoleDO> queryRoleByOrgId(Long orgId) {
//        return mapper.queryRoleByOrgId(orgId);
//    }

    @Override
    public List<RoleDTO> selectAll() {
        return mapper.selectAll();
    }

    @Override
    public List<RoleDTO> selectUsersRolesBySourceIdAndType(String sourceType, Long sourceId, Long userId) {
        return mapper.queryRolesInfoByUser(sourceType, sourceId, userId);
    }

    @Override
    public List<RoleDTO> fuzzySearchRolesByName(String roleName, String sourceType) {
        return mapper.fuzzySearchRolesByName(roleName, sourceType);
    }
}
