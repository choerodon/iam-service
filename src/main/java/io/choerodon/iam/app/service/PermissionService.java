package io.choerodon.iam.app.service;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.CheckPermissionDTO;
import io.choerodon.iam.api.dto.PermissionDTO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

import java.util.List;
import java.util.Set;

/**
 * @author wuguokai
 */
public interface PermissionService {

    Page<PermissionDTO> pagingQuery(PageRequest pageRequest, PermissionDTO permissionDTO, String param);

    List<CheckPermissionDTO> checkPermission(List<CheckPermissionDTO> checkPermissionDTOList);

    Set<PermissionDTO> queryByRoleIds(List<Long> roleIds);

    List<PermissionDTO> query(String level, String serviceName, String code);

    void deleteByCode(String code);
}
