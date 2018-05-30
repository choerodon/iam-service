package io.choerodon.iam.domain.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.swagger.PermissionData;
import io.choerodon.core.swagger.SwaggerExtraData;
import io.choerodon.iam.domain.iam.entity.InstanceE;
import io.choerodon.iam.domain.iam.entity.PermissionE;
import io.choerodon.iam.domain.iam.entity.RoleE;
import io.choerodon.iam.domain.iam.entity.RolePermissionE;
import io.choerodon.iam.domain.repository.PermissionRepository;
import io.choerodon.iam.domain.repository.RolePermissionRepository;
import io.choerodon.iam.domain.repository.RoleRepository;
import io.choerodon.iam.domain.service.ParsePermissionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * @author zhipeng.zuo
 * @author superlee
 * @date 2018/1/19
 * @date 2018/04/03
 */
@Service
public class ParsePermissionServiceImpl implements ParsePermissionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ParsePermissionService.class);

    private final ObjectMapper objectMapper = new ObjectMapper();

    private PermissionRepository permissionRepository;

    private RolePermissionRepository rolePermissionRepository;

    private RoleRepository roleRepository;

    public ParsePermissionServiceImpl(PermissionRepository permissionRepository,
                                      RolePermissionRepository rolePermissionRepository,
                                      RoleRepository roleRepository) {
        this.permissionRepository = permissionRepository;
        this.rolePermissionRepository = rolePermissionRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public void parser(String message) {
        try {
            InstanceE instanceE = objectMapper.readValue(message, InstanceE.class);
            String serviceName = instanceE.getAppName();
            String json = instanceE.getApiData();
            if (!StringUtils.isEmpty(serviceName) && !StringUtils.isEmpty(json)) {
                JsonNode node = objectMapper.readTree(json);
                Iterator<Map.Entry<String, JsonNode>> pathIterator = node.get("paths").fields();
                //根据role code查询初始化的三个角色
                Map<String, Long> initRoleMap = new HashMap<>(5);
                RoleE siteAdministrator = roleRepository.selectByCode(RoleE.SITE_ADMINISTRATOR_CODE);
                RoleE organizationAdministrator = roleRepository.selectByCode(RoleE.ORGANIZATION_ADMINISTRATOR_CODE);
                RoleE projectAdministrator = roleRepository.selectByCode(RoleE.PROJECT_ADMINISTRATOR_CODE);
                if (siteAdministrator == null || organizationAdministrator == null || projectAdministrator == null) {
                    throw new CommonException("error.init.role.not.exist");
                } else {
                    initRoleMap.put(ResourceLevel.SITE.value(), siteAdministrator.getId());
                    initRoleMap.put(ResourceLevel.ORGANIZATION.value(), organizationAdministrator.getId());
                    initRoleMap.put(ResourceLevel.PROJECT.value(), projectAdministrator.getId());
                }
                while (pathIterator.hasNext()) {
                    Map.Entry<String, JsonNode> pathNode = pathIterator.next();
                    Iterator<Map.Entry<String, JsonNode>> methodIterator = pathNode.getValue().fields();
                    parserMethod(methodIterator, pathNode, serviceName, initRoleMap);
                }
            }
        } catch (IOException e) {
            LOGGER.info("read message failed: {}", e);
            throw new CommonException("error.permission.parse");
        }
    }

    /**
     * 解析文档树某个路径的所有方法
     *
     * @param methodIterator 所有方法
     * @param pathNode       路径
     * @param serviceName    服务名
     */
    private void parserMethod(Iterator<Map.Entry<String, JsonNode>> methodIterator,
                              Map.Entry<String, JsonNode> pathNode, String serviceName, Map<String, Long> initRoleMap) {
        while (methodIterator.hasNext()) {
            Map.Entry<String, JsonNode> methodNode = methodIterator.next();
            JsonNode tags = methodNode.getValue().get("tags");
            SwaggerExtraData extraData = null;
            String resourceCode = null;
            for (int i = 0; i < tags.size(); i++) {
                String tag = tags.get(i).asText();
                if (tag.endsWith("-controller")) {
                    resourceCode = tag.substring(0, tag.length() - "-controller".length());
                }
            }
            try {
                JsonNode extraDataNode = methodNode.getValue().get("description");
                if (extraDataNode == null) {
                    continue;
                }
                extraData = objectMapper.readValue(extraDataNode.asText(), SwaggerExtraData.class);
            } catch (IOException e) {
                LOGGER.info("extraData read failed.", e);
            }
            if (extraData == null || resourceCode == null) {
                continue;
            }
            String description = methodNode.getValue().get("summary").asText();
            processPermission(extraData, pathNode.getKey(),
                    methodNode.getKey(), serviceName, resourceCode, description, initRoleMap);
        }
    }

    private void processPermission(SwaggerExtraData extraData, String path, String method,
                                   String serviceName, String resourceCode, String description, Map<String, Long> initRoleMap) {
        /**
         * 关于permission目前只有插入和更新操作，没有删除废弃的permission。因为目前的从swagger拿到的permission json无法判断是否与数据库中已存在的permission一致
         * 后续如果想通过parse的方式删除废弃的permission，目前的想法是只能在每个接口上加一个不变且各不相同的唯一标识，通过标识判断到底是删除了接口还是更新了接口
         */
        PermissionData permission = extraData.getPermission();
        String action = permission.getAction();
        String code = serviceName + "." + resourceCode + "." + action;
        PermissionE permissionE = permissionRepository.selectByCode(code);
        if (permissionE == null) {
            //插入操作
            PermissionE p =
                    new PermissionE(code, path, method, permission.getPermissionLevel(), description, action,
                            resourceCode, permission.isPermissionPublic(), permission.isPermissionLogin(), serviceName, null);
            PermissionE permissionE1 = permissionRepository.insertSelective(p);
            insertRolePermission(permissionE1, initRoleMap);
            LOGGER.debug("url: {} method: {} permission: {}",
                    path,
                    method,
                    permissionE1.getCode());
        } else {
            //更新操作
            PermissionE p =
                    new PermissionE(code, path, method, permission.getPermissionLevel(), description, action,
                            resourceCode, permission.isPermissionPublic(), permission.isPermissionLogin(), serviceName, permissionE.getObjectVersionNumber());
            p.setId(permissionE.getId());
            permissionRepository.updateSelective(p);
            //处理历史遗留脏数据的问题，是多余操作
            updateRolePermission(p, initRoleMap);
            LOGGER.debug("url: {} method: {} permission: {}",
                    path,
                    method,
                    p.getCode());
        }
    }

    private void updateRolePermission(PermissionE permission, Map<String, Long> initRoleMap) {
        Long permissionId = permission.getId();
        String level = permission.getLevel();
        for (Map.Entry<String, Long> entry : initRoleMap.entrySet()) {
            if (entry.getKey().equals(level)) {
                RolePermissionE rolePermission = new RolePermissionE(null, entry.getValue(), permissionId);
                if (rolePermissionRepository.selectOne(rolePermission) == null) {
                    rolePermissionRepository.insert(rolePermission);
                }
            }
        }
    }

    private void insertRolePermission(PermissionE permission, Map<String, Long> initRoleMap) {
        Long permissionId = permission.getId();
        String level = permission.getLevel();
        for (Map.Entry<String, Long> entry : initRoleMap.entrySet()) {
            if (entry.getKey().equals(level)) {
                rolePermissionRepository.insert(new RolePermissionE(null, entry.getValue(), permissionId));
            }
        }
    }
}
