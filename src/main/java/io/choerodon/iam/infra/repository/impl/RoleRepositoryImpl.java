package io.choerodon.iam.infra.repository.impl;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.iam.entity.RoleE;
import io.choerodon.iam.domain.repository.RoleRepository;
import io.choerodon.iam.infra.dataobject.RoleDO;
import io.choerodon.iam.infra.mapper.RoleMapper;
import io.choerodon.mybatis.pagehelper.PageHelper;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

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
    public Page<RoleDO> pagingQuery(PageRequest pageRequest, RoleDO roleDO, String param) {
        return PageHelper.doPageAndSort(pageRequest, () -> mapper.fulltextSearch(roleDO, param));
    }

    @Override
    public RoleE selectByName(String name) {
        RoleDO roleDO = new RoleDO();
        roleDO.setName(name);
        mapper.selectOne(roleDO);
        return ConvertHelper.convert(mapper.selectOne(roleDO), RoleE.class);
    }

    @Override
    public RoleE selectByCode(String code) {
        RoleDO roleDO = new RoleDO();
        roleDO.setCode(code);
        return ConvertHelper.convert(mapper.selectOne(roleDO), RoleE.class);
    }

    @Override
    public RoleE insertSelective(RoleE roleE) {
        RoleDO roleDO = ConvertHelper.convert(roleE, RoleDO.class);
        if (mapper.insertSelective(roleDO) != 1) {
            throw new CommonException("error.role.insert");
        }
        return ConvertHelper.convert(mapper.selectByPrimaryKey(roleDO.getId()), RoleE.class);
    }

    @Override
    public RoleE selectByPrimaryKey(Long id) {
        return ConvertHelper.convert(mapper.selectByPrimaryKey(id), RoleE.class);
    }

    @Override
    public RoleE updateSelective(RoleE roleE) {
        RoleDO roleDO = ConvertHelper.convert(roleE, RoleDO.class);
        if (mapper.updateByPrimaryKeySelective(roleDO) != 1) {
            throw new CommonException("error.role.update");
        }
        return ConvertHelper.convert(mapper.selectByPrimaryKey(roleDO.getId()), RoleE.class);
    }

    @Override
    public void deleteByPrimaryKey(Long id) {
        mapper.deleteByPrimaryKey(id);
    }

    @Override
    public RoleDO selectRoleWithPermissionsAndLabels(Long id) {
        return mapper.selectRoleWithPermissionsAndLabels(id);
    }

    @Override
    public List<RoleDO> select(RoleDO roleDO) {
        return mapper.select(roleDO);
    }

    @Override
    public List<Long> queryRoleByUser(Long userId, String sourceType, Long sourceId) {
        return mapper.queryRoleByUser(userId, sourceType, sourceId);
    }

    @Override
    public RoleDO selectOne(RoleDO roleDO) {
        return mapper.selectOne(roleDO);
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
    public List<RoleDO> selectRolesByLabelNameAndType(String name, String type) {
        return mapper.selectRolesByLabelNameAndType(name, type);
    }

    @Override
    public List<RoleDO> selectInitRolesByPermissionId(Long permissionId) {
        return mapper.selectInitRolesByPermissionId(permissionId);
    }

    @Override
    public Set<String> matchCode(Set<String> codeSet) {
        return mapper.matchCode(codeSet);
    }

    @Override
    public List<RoleDO> selectUsersRolesBySourceIdAndType(String sourceType, Long sourceId, Long userId) {
        return mapper.queryRolesInfoByUser(sourceType, sourceId, userId);
    }
}
