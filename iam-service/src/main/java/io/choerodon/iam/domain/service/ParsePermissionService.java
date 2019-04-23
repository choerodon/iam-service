package io.choerodon.iam.domain.service;

import io.choerodon.core.swagger.PermissionData;
import io.choerodon.eureka.event.EurekaEventPayload;
import io.choerodon.iam.infra.dto.RoleDTO;

import java.util.Map;

/**
 * @author superlee
 */
public interface ParsePermissionService {

    /**
     * 解析swagger的文档树
     *
     * @param payload 接受的消息
     */
    void parser(EurekaEventPayload payload);

    String processPermission(String[] roles, String path, String method, String description, PermissionData permission, String serviceName, String resourceCode, Map<String, RoleDTO> initRoleMap);

    Map<String, RoleDTO> queryInitRoleByCode();
}
