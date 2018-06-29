package io.choerodon.iam.domain.repository;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.domain.iam.entity.RoleE;
import io.choerodon.iam.infra.dataobject.RoleDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

import java.util.List;

/**
 * @author superlee
 * @data 2018/3/27
 */
public interface RoleRepository {

    Page<RoleDO> pagingQuery(PageRequest pageRequest, RoleDO roleDO, String param);

    RoleE selectByName(String name);

    RoleE selectByCode(String code);

    RoleE insertSelective(RoleE roleE);

    RoleE selectByPrimaryKey(Long id);

    RoleE updateSelective(RoleE roleE);

    void deleteByPrimaryKey(Long id);

    RoleDO selectRoleWithPermissionsAndLabels(Long id);

    List<RoleDO> select(RoleDO roleDO);

    List<Long> queryRoleByUser(Long userId, String sourceType, Long sourceId);

    RoleDO selectOne(RoleDO roleDO);

    boolean judgeRolesSameLevel(List<Long> roleIds);

    List<RoleDO> selectRolesByLabelNameAndType(String name, String type);

    List<RoleDO> selectInitRolesByPermissionId(Long permissionId);
}
