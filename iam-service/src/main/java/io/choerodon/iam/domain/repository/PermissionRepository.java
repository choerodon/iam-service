package io.choerodon.iam.domain.repository;

import com.github.pagehelper.Page;
import io.choerodon.iam.infra.dto.PermissionDTO;
import io.choerodon.iam.infra.dto.RoleDTO;

import java.util.List;
import java.util.Set;

/**
 * @author wuguokai
 */
public interface PermissionRepository {

    List<PermissionDTO> select(PermissionDTO permissionDTO);

    boolean existByCode(String code);

    PermissionDTO selectByCode(String code);

    PermissionDTO insertSelective(PermissionDTO permissionDTO);

    PermissionDTO updateSelective(PermissionDTO permissionDTO);

    PermissionDTO selectByPrimaryKey(Object key);

    void deleteById(Long id);

    Page<PermissionDTO> pagingQuery(int page, int size, PermissionDTO permissionDTO, String param);

    List<PermissionDTO> selectByRoleId(Long roleId);

    Set<String> checkPermission(Long memberId, String sourceType,
                                Long sourceId, Set<String> codes);

    List<PermissionDTO> query(String level, String serviceName, String code);

    Page<PermissionDTO> pagingQueryByRoleId(int page, int size, Long id, String params);

    List<PermissionDTO> selectErrorLevelPermissionByRole(RoleDTO roleDTO);
}
