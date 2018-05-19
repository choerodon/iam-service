package io.choerodon.iam.app.service;

import java.util.List;
import java.util.Set;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.PermissionDTO;
import io.choerodon.iam.api.dto.CheckPermissionDTO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author wuguokai
 */
public interface PermissionService {

    Page<PermissionDTO> pagingQuery(PageRequest pageRequest, PermissionDTO permissionDTO, String[] params);

    List<CheckPermissionDTO> checkPermission(List<CheckPermissionDTO> checkPermissionDTOList);

    Set<PermissionDTO> queryByRoleIds(List<Long> roleIds);
}
