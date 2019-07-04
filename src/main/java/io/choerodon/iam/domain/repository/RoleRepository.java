package io.choerodon.iam.domain.repository;

import com.github.pagehelper.PageInfo;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.iam.api.query.RoleQuery;
import io.choerodon.iam.infra.dto.RoleDTO;

import java.util.List;

/**
 * @author superlee
 * @data 2018/3/27
 */
public interface RoleRepository {

    PageInfo<RoleDTO> pagingQuery(int page, int size, RoleQuery roleQuery);

    PageInfo<RoleDTO> pagingQueryOrgRoles(Long orgId, PageRequest pageRequest, RoleQuery roleQuery);

    RoleDTO selectByCode(String code);

    RoleDTO insertSelective(RoleDTO roleDTO);

    RoleDTO selectByPrimaryKey(Long id);

    RoleDTO updateSelective(RoleDTO roleDTO);

    void deleteByPrimaryKey(Long id);

    RoleDTO selectRoleWithPermissionsAndLabels(Long id);

    List<RoleDTO> select(RoleDTO roleDTO);

    List<Long> queryRoleByUser(Long userId, String sourceType, Long sourceId);

    RoleDTO selectOne(RoleDTO roleDTO);

    boolean judgeRolesSameLevel(List<Long> roleIds);

    List<RoleDTO> selectRolesByLabelNameAndType(String name, String type, Long organizationId);

    List<RoleDTO> selectInitRolesByPermissionId(Long permissionId);

    List<RoleDTO> selectUsersRolesBySourceIdAndType(String sourceType, Long sourceId, Long userId);

    List<RoleDTO> selectAll();

    List<RoleDTO> fuzzySearchRolesByName(String roleName, String sourceType);
}
