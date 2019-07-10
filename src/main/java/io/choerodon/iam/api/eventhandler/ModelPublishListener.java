package io.choerodon.iam.api.eventhandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.choerodon.asgard.saga.annotation.SagaTask;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.iam.api.dto.payload.ModelPublishPayload;
import io.choerodon.iam.app.service.PermissionService;
import io.choerodon.iam.app.service.RoleService;
import io.choerodon.iam.infra.dto.PermissionDTO;
import io.choerodon.iam.infra.dto.RoleDTO;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
public class ModelPublishListener {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final String MODEL_PUBLISH_SAGA_CODE = "lc-model-publish";
    private static final String MODEL_PUBLISH_ROLE_SAGA_CODE = "iam-model-publish-role";

    private RoleService roleService;
    private PermissionService permissionService;

    public ModelPublishListener(RoleService roleService, PermissionService permissionService) {
        this.roleService = roleService;
        this.permissionService = permissionService;
    }

    @SagaTask(code = MODEL_PUBLISH_ROLE_SAGA_CODE, sagaCode = MODEL_PUBLISH_SAGA_CODE, seq = 1, description = "处理模型发布角色")
    public ModelPublishPayload processModelPublishRole(String message) throws IOException {
        ModelPublishPayload payload = OBJECT_MAPPER.readValue(message, ModelPublishPayload.class);
        List<PermissionDTO> defaultPermissions = permissionService.query(ResourceType.ORGANIZATION.value(), "low-code-service", "low-code-service.route." + payload.getModelCode());
        List<ModelPublishPayload.Role> roles = payload.getRoles();
        if (roles != null && !roles.isEmpty()){
            for (ModelPublishPayload.Role rolePayload : roles){
                if (rolePayload.getName() != null) {
                    RoleDTO role = new RoleDTO();
                    role.setOrganizationId(payload.getOrganizationId());
                    role.setResourceLevel(ResourceType.ORGANIZATION.value());
                    role.setCode(rolePayload.getCode());
                    role.setName(rolePayload.getName());
                    role.setPermissions(defaultPermissions);
                    roleService.create(role);
                } else {
                    RoleDTO role = roleService.queryWithPermissionsAndLabels(rolePayload.getId());
                    role.getPermissions().addAll(defaultPermissions);
                    roleService.orgUpdate(role, payload.getOrganizationId());
                }
            }
        }
        return payload;
    }
}
