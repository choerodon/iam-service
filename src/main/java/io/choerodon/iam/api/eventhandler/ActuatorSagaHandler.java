package io.choerodon.iam.api.eventhandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.choerodon.actuator.util.MicroServiceInitData;
import io.choerodon.annotation.entity.PermissionDescription;
import io.choerodon.annotation.entity.PermissionEntity;
import io.choerodon.asgard.saga.annotation.SagaTask;
import io.choerodon.core.swagger.PermissionData;
import io.choerodon.iam.domain.service.ParsePermissionService;
import io.choerodon.iam.infra.dto.RoleDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

@Component
public class ActuatorSagaHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(ActuatorSagaHandler.class);
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final String ACTUATOR_REFRESH_SAGA_CODE = "mgmt-actuator-refresh";
    private static final String PERMISSION_REFRESH_TASK_SAGA_CODE = "iam-permission-task-refresh";
    private static final String INIT_DATA_REFRESH_TASK_SAGA_CODE = "iam-init-data-task-refresh";

    @Autowired
    private ParsePermissionService parsePermissionService;
    @Autowired
    private DataSource dataSource;

    @SagaTask(code = PERMISSION_REFRESH_TASK_SAGA_CODE, sagaCode = ACTUATOR_REFRESH_SAGA_CODE, seq = 1, description = "刷新权限表数据")
    public String refreshPermission(String actuatorJson) throws IOException {
        Map actuator = OBJECT_MAPPER.readValue(actuatorJson, Map.class);
        String service = (String) actuator.get("service");
        Map permissionNode = (Map) actuator.get("permission");
        LOGGER.info("start to refresh permission, service: {}", service);
        String permissionJson = OBJECT_MAPPER.writeValueAsString(permissionNode);
        Map <String, PermissionDescription> descriptions = OBJECT_MAPPER.readValue(permissionJson, OBJECT_MAPPER.getTypeFactory().constructMapType(HashMap.class, String.class, PermissionDescription.class));
        Map<String, RoleDTO> initRoleMap = parsePermissionService.queryInitRoleByCode();
        for (Map.Entry<String, PermissionDescription> entry: descriptions.entrySet()){
            processDescription(service, entry.getKey(), entry.getValue(), initRoleMap);
        }
        return actuatorJson;
    }

    @SagaTask(code = INIT_DATA_REFRESH_TASK_SAGA_CODE, sagaCode = ACTUATOR_REFRESH_SAGA_CODE, seq = 1, description = "刷新菜单表数据")
    public String refreshInitData(String actuatorJson) throws IOException, SQLException {
        JsonNode root = OBJECT_MAPPER.readTree(actuatorJson);
        String service = root.get("service").asText();
        LOGGER.info("start to refresh init data, service: {}", service);
        JsonNode data = root.get("init-data");
        if (data == null || data.size() == 0){
            LOGGER.info("actuator init-data is empty skip iam-init-data-task-refresh.");
            return actuatorJson;
        }
        try(Connection connection = dataSource.getConnection()) {
            connection.setAutoCommit(false);
            MicroServiceInitData.processInitData(data, connection, new HashSet<>(Arrays.asList("IAM_PERMISSION", "IAM_MENU_B", "IAM_MENU_PERMISSION")));
            connection.commit();
        }
        return actuatorJson;
    }

    private void processDescription(String service, String key, PermissionDescription description, Map<String, RoleDTO> initRoleMap){
        String[] names = key.split("\\.");
        String controllerClassName = names[names.length - 2];
        String action = names[names.length - 1];
        String resource = camelToHyphenLine(controllerClassName).replace("-controller", "");
        PermissionEntity permissionEntity = description.getPermission();
        if (permissionEntity == null){
            return;
        }
        PermissionData permissionData = new PermissionData();
        permissionData.setAction(action);
        permissionData.setPermissionLevel(permissionEntity.getType());
        permissionData.setPermissionLogin(permissionEntity.isPermissionLogin());
        permissionData.setPermissionPublic(permissionEntity.isPermissionPublic());
        permissionData.setPermissionWithin(permissionEntity.isPermissionWithin());
        permissionData.setRoles(permissionEntity.getRoles());
        parsePermissionService.processPermission(permissionEntity.getRoles(), description.getPath(), description.getMethod(), null, permissionData, service, resource, initRoleMap);
    }

    /**
     * 驼峰格式字符串转换为中划线格式字符串
     *
     * @param param 驼峰形式的字符串 (eg. UserCodeController)
     * @return 中划线形式的字符串 (eg. user-code-controller)
     */
    public static String camelToHyphenLine(String param) {
        if (param == null || "".equals(param.trim())) {
            return "";
        }
        int len = param.length();
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            char c = param.charAt(i);
            if (Character.isUpperCase(c)) {
                if (i > 0){
                    sb.append('-');
                }
                sb.append(Character.toLowerCase(c));
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}
