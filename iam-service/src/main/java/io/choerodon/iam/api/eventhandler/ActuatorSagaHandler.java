package io.choerodon.iam.api.eventhandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.choerodon.annotation.entity.PermissionDescription;
import io.choerodon.annotation.entity.PermissionEntity;
import io.choerodon.asgard.saga.annotation.SagaTask;
import io.choerodon.iam.infra.dataobject.PermissionDO;
import io.choerodon.iam.infra.mapper.PermissionMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class ActuatorSagaHandler {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final String ACTUATOR_REFRESH_SAGA_CODE = "mgmt-actuator-refresh";
    private static final String PERMISSION_REFRESH_TASK_SAGA_CODE = "iam-permission-task-refresh";

    @Autowired
    private PermissionMapper permissionMapper;

    @SagaTask(code = PERMISSION_REFRESH_TASK_SAGA_CODE, sagaCode = ACTUATOR_REFRESH_SAGA_CODE,
            seq = 1, description = "刷新权限表数据")
    public void refreshPermission(String actuatorJson) throws IOException {
        Map actuator = OBJECT_MAPPER.readValue(actuatorJson, Map.class);
        String service = (String) actuator.get("service");
        Map permissionNode = (Map) actuator.get("permission");
        String permissionJson = OBJECT_MAPPER.writeValueAsString(permissionNode);
        Map <String, PermissionDescription> descriptions = OBJECT_MAPPER.readValue(permissionJson, OBJECT_MAPPER.getTypeFactory().constructMapType(HashMap.class, String.class, PermissionDescription.class));
        for (Map.Entry<String, PermissionDescription> entry: descriptions.entrySet()){
            processDescription(service, entry.getKey(), entry.getValue());
        }
    }

    private void processDescription(String service, String key, PermissionDescription description){
        String[] names = key.split("\\.");
        String controllerClassName = names[names.length - 2];
        String action = names[names.length - 1];
        String resource = camelToHyphenLine(controllerClassName).replace("-controller", "");
        String code = makeCode(service, resource, action);
        PermissionDO example = new PermissionDO();
        example.setCode(code);
        PermissionDO permission = new PermissionDO();
        permission.setCode(code);
        permission.setAction(action);
        permission.setResource(resource);
        permission.setServiceName(service);
        permission.setPath(description.getPath());
        permission.setMethod(description.getMethod().name());
        PermissionEntity permissionEntity = description.getPermission();
        if (permissionEntity == null){
            return;
        }
        permission.setLevel(permissionEntity.getType());
        permission.setLoginAccess(permissionEntity.isPermissionLogin());
        permission.setPublicAccess(permissionEntity.isPermissionPublic());
        permission.setWithin(permissionEntity.isPermissionWithin());
        example = permissionMapper.selectOne(example);
        if(example != null) {
            permission.setId(example.getId());
            permissionMapper.updateByPrimaryKey(permission);
        } else {
            permissionMapper.insert(permission);
        }
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

    private static String makeCode(String service, String resource, String action){
        String code = resource + "." + action;
        if (service != null){
            code = service + "." + code;
        }
        return code;
    }
}
