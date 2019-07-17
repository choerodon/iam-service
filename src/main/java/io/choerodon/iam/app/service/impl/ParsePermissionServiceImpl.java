package io.choerodon.iam.app.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.InitRoleCode;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.swagger.PermissionData;
import io.choerodon.core.swagger.SwaggerExtraData;
import io.choerodon.eureka.event.EurekaEventPayload;
import io.choerodon.iam.app.service.UploadHistoryService;
import io.choerodon.iam.infra.dto.PermissionDTO;
import io.choerodon.iam.infra.dto.RoleDTO;
import io.choerodon.iam.infra.dto.RolePermissionDTO;
import io.choerodon.iam.infra.mapper.PermissionMapper;
import io.choerodon.iam.infra.mapper.RoleMapper;
import io.choerodon.iam.infra.mapper.RolePermissionMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.*;

/**
 * @author zhipeng.zuo
 * @author superlee
 */
@Service
public class ParsePermissionServiceImpl implements UploadHistoryService.ParsePermissionService {

    private static final Logger logger = LoggerFactory.getLogger(UploadHistoryService.ParsePermissionService.class);

    private final ObjectMapper objectMapper = new ObjectMapper();

    private PermissionMapper permissionMapper;

    private RolePermissionMapper rolePermissionMapper;

    private RestTemplate restTemplate = new RestTemplate();

    private RoleMapper roleMapper;

    @Value("${choerodon.cleanPermission:false}")
    private boolean cleanPermission;

    public void setRestTemplate(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ParsePermissionServiceImpl(PermissionMapper permissionMapper,
                                      RolePermissionMapper rolePermissionMapper,
                                      RoleMapper roleMapper) {
        this.permissionMapper = permissionMapper;
        this.rolePermissionMapper = rolePermissionMapper;
        this.roleMapper = roleMapper;
    }

    private void fetchSwaggerJsonByIp(final EurekaEventPayload payload) {
        ResponseEntity<String> response = restTemplate.getForEntity("http://" + payload.getInstanceAddress() + "/v2/choerodon/api-docs",
                String.class);
        if (response.getStatusCode() == HttpStatus.OK) {
            payload.setApiData(response.getBody());
        } else {
            throw new CommonException("fetch swagger error, statusCode is not 2XX, serviceId: " + payload.getId());
        }
    }

    @Override
    public void parser(EurekaEventPayload payload) {
        try {
            fetchSwaggerJsonByIp(payload);
            String serviceCode = payload.getAppName();
            String json = payload.getApiData();
            logger.info("receive service: {} message, version: {}, ip: {}", serviceCode, payload.getVersion(), payload.getInstanceAddress());
            if (!StringUtils.isEmpty(serviceCode) && !StringUtils.isEmpty(json)) {
                JsonNode node = objectMapper.readTree(json);
                Iterator<Map.Entry<String, JsonNode>> pathIterator = node.get("paths").fields();
                Map<String, RoleDTO> initRoleMap = queryInitRoleByCode();
                List<String> permissionCodes = new ArrayList<>();
                while (pathIterator.hasNext()) {
                    Map.Entry<String, JsonNode> pathNode = pathIterator.next();
                    Iterator<Map.Entry<String, JsonNode>> methodIterator = pathNode.getValue().fields();
                    parserMethod(methodIterator, pathNode, serviceCode, initRoleMap, permissionCodes);
                }
                logger.info("cleanPermission : {}", cleanPermission);
                if (cleanPermission) {
                    deleteDeprecatedPermission(permissionCodes, serviceCode);
                    //清理role_permission表层级不符的脏数据，会导致基于角色创建失败
                    cleanRolePermission();
                }
            }
        } catch (IOException e) {
            throw new CommonException("error.parsePermissionService.parse.IOException", e);
        }
    }

    private void deleteDeprecatedPermission(List<String> permissionCodes, String serviceName) {
        PermissionDTO dto = new PermissionDTO();
        dto.setServiceCode(serviceName);
        List<PermissionDTO> permissions = permissionMapper.select(dto);
        int count = 0;
        for (PermissionDTO permission : permissions) {
            if (!permissionCodes.contains(permission.getCode())) {
                permissionMapper.deleteByPrimaryKey(permission.getId());
                RolePermissionDTO rolePermissionDTO = new RolePermissionDTO();
                rolePermissionDTO.setPermissionId(permission.getId());
                rolePermissionMapper.delete(rolePermissionDTO);
                logger.info("@@@ service {} delete deprecated permission {}", serviceName, permission.getCode());
                count++;
            }
        }
        logger.info("service {} delete deprecated permission, total {}", serviceName, count);
    }

    private void cleanRolePermission() {
        List<RoleDTO> roles = roleMapper.selectAll();
        int count = 0;
        for (RoleDTO role : roles) {
            List<PermissionDTO> permissions = permissionMapper.selectErrorLevelPermissionByRole(role);
            for (PermissionDTO permission : permissions) {
                RolePermissionDTO rp = new RolePermissionDTO();
                rp.setRoleId(role.getId());
                rp.setPermissionId(permission.getId());
                rolePermissionMapper.delete(rp);
                logger.info("delete error role_permission, role id: {}, code: {}, level: {} ## permission id: {}, code:{}, level: {}",
                        role.getId(), role.getCode(), role.getResourceLevel(), permission.getId(), permission.getCode(), permission.getResourceLevel());
                count++;
            }
        }
        logger.info("clean error role_permission finished, total: {}", count);
    }

    /**
     * 解析文档树某个路径的所有方法
     *
     * @param methodIterator 所有方法
     * @param pathNode       路径
     * @param serviceCode    服务名
     */
    private void parserMethod(Iterator<Map.Entry<String, JsonNode>> methodIterator,
                              Map.Entry<String, JsonNode> pathNode, String serviceCode,
                              Map<String, RoleDTO> initRoleMap, List<String> permissionCode) {
        while (methodIterator.hasNext()) {
            Map.Entry<String, JsonNode> methodNode = methodIterator.next();
            JsonNode tags = methodNode.getValue().get("tags");
            String resourceCode = processResourceCode(tags);
            try {
                JsonNode extraDataNode = methodNode.getValue().get("description");
                if (resourceCode == null || extraDataNode == null) {
                    continue;
                }
                SwaggerExtraData extraData = objectMapper.readValue(extraDataNode.asText(), SwaggerExtraData.class);
                permissionCode.add(processPermission(extraData, pathNode.getKey(), methodNode, serviceCode, resourceCode, initRoleMap));
            } catch (IOException e) {
                logger.info("extraData read failed.", e);
            }
        }
    }

    private PermissionDTO selectByCode(String code) {
        PermissionDTO dto = new PermissionDTO();
        dto.setCode(code);
        return permissionMapper.selectOne(dto);
    }

    private PermissionDTO insertSelective(PermissionDTO permissionDTO) {
        if (permissionMapper.insertSelective(permissionDTO) != 1) {
            throw new CommonException("error.permission.insert");
        }
        return permissionMapper.selectByPrimaryKey(permissionDTO);
    }

    @Override
    public String processPermission(String[] roles, String path, String method, String description, PermissionData permission, String serviceName, String resourceCode, Map<String, RoleDTO> initRoleMap) {
        String action = permission.getAction();
        String code = serviceName + "." + resourceCode + "." + action;
        PermissionDTO permissionDTO = selectByCode(code);

        PermissionDTO newPermission = new PermissionDTO();
        newPermission.setCode(code);
        newPermission.setPath(path);
        newPermission.setMethod(method);
        newPermission.setResourceLevel(permission.getPermissionLevel());
        newPermission.setDescription(description);
        newPermission.setAction(action);
        newPermission.setController(resourceCode);
        newPermission.setPublicAccess(permission.isPermissionPublic());
        newPermission.setLoginAccess(permission.isPermissionLogin());
        newPermission.setWithin(permission.isPermissionWithin());
        newPermission.setServiceCode(serviceName);
        if (permissionDTO == null) {
            //插入操作
            PermissionDTO returnPermission = insertSelective(newPermission);
            if (returnPermission != null) {
                insertRolePermission(returnPermission, initRoleMap, roles);
                logger.debug("###insert permission, {}", newPermission);
            }
        } else {
            //更新操作
            newPermission.setObjectVersionNumber(permissionDTO.getObjectVersionNumber());
            newPermission.setId(permissionDTO.getId());
            if (!permissionDTO.equals(newPermission)) {
                if (permissionMapper.updateByPrimaryKeySelective(newPermission) != 1) {
                    throw new CommonException("error.permission.update");
                }
            }
            updateRolePermission(newPermission, initRoleMap, roles);
            logger.debug("###update permission, {}", newPermission);
        }
        return code;
    }

    private String processPermission(SwaggerExtraData extraData, String path, Map.Entry<String, JsonNode> methodNode,
                                     String serviceCode, String resourceCode, Map<String, RoleDTO> initRoleMap) {
        String[] roles = null;
        if (extraData.getPermission() != null) {
            roles = extraData.getPermission().getRoles();
        }
        String method = methodNode.getKey();
        String description = methodNode.getValue().get("summary").asText();
        PermissionData permission = extraData.getPermission();
        String action = permission.getAction();
        String code = serviceCode + "." + resourceCode + "." + action;


        PermissionDTO newPermission = new PermissionDTO();
        newPermission.setCode(code);
        newPermission.setPath(path);
        newPermission.setMethod(method);
        newPermission.setResourceLevel(permission.getPermissionLevel());
        newPermission.setDescription(description);
        newPermission.setAction(action);
        newPermission.setController(resourceCode);
        newPermission.setPublicAccess(permission.isPermissionPublic());
        newPermission.setLoginAccess(permission.isPermissionLogin());
        newPermission.setWithin(permission.isPermissionWithin());
        newPermission.setServiceCode(serviceCode);

        PermissionDTO permissionDTO = selectByCode(code);
        if (permissionDTO == null) {
            //插入操作
            PermissionDTO returnPermission = insertSelective(newPermission);
            if (returnPermission != null) {
                insertRolePermission(returnPermission, initRoleMap, roles);
                logger.debug("###insert permission, {}", newPermission);
            }
        } else {
            //更新操作
            newPermission.setId(permissionDTO.getId());
            newPermission.setObjectVersionNumber(permissionDTO.getObjectVersionNumber());
            if (!permissionDTO.equals(newPermission)) {
                if (permissionMapper.updateByPrimaryKeySelective(newPermission) != 1) {
                    throw new CommonException("error.permission.update");
                }
            }
            updateRolePermission(newPermission, initRoleMap, roles);
            logger.debug("###update permission, {}", newPermission);
        }
        return code;
    }

    private String processResourceCode(JsonNode tags) {
        String resourceCode = null;
        boolean illegal = true;
        List<String> illegalTags = new ArrayList<>();
        for (int i = 0; i < tags.size(); i++) {
            String tag = tags.get(i).asText();
            //添加choerodon-eureka例外的以-endpoint结尾的tag，
            if (tag.endsWith("-controller")) {
                illegal = false;
                resourceCode = tag.substring(0, tag.length() - "-controller".length());
            } else if (tag.endsWith("-endpoint")) {
                illegal = false;
                resourceCode = tag.substring(0, tag.length() - "-endpoint".length());
            } else {
                illegalTags.add(tag);
            }
        }
        if (illegal) {
            logger.warn("skip the controller/endpoint because of the illegal tags {}, please ensure the controller is end with ##Controller## or ##EndPoint##", illegalTags);
        }
        return resourceCode;
    }


    private void updateRolePermission(PermissionDTO permission, Map<String, RoleDTO> initRoleMap, String[] roles) {
        Long permissionId = permission.getId();
        String level = permission.getResourceLevel();
        RoleDTO role = getRoleByLevel(initRoleMap, level);
        if (role != null) {
            RolePermissionDTO rp = new RolePermissionDTO();
            rp.setRoleId(role.getId());
            rp.setPermissionId(permissionId);
            if (rolePermissionMapper.selectOne(rp) == null) {
                if (rolePermissionMapper.insert(rp) != 1) {
                    throw new CommonException("error.rolePermission.insert");
                }
            }
        }
        List<RoleDTO> roleList = roleMapper.selectInitRolesByPermissionId(permissionId);
        //删掉除去SITE_ADMINISTRATOR，ORGANIZATION_ADMINISTRATOR，PROJECT_ADMINISTRATOR的所有role_permission关系
        for (RoleDTO roleDTO : roleList) {
            String code = roleDTO.getCode();
            if (!InitRoleCode.SITE_ADMINISTRATOR.equals(code)
                    && !InitRoleCode.PROJECT_ADMINISTRATOR.equals(code)
                    && !InitRoleCode.ORGANIZATION_ADMINISTRATOR.equals(code)) {
                RolePermissionDTO rolePermission = new RolePermissionDTO();
                rolePermission.setRoleId(roleDTO.getId());
                rolePermission.setPermissionId(permissionId);
                rolePermissionMapper.delete(rolePermission);
            }
        }
        if (roles != null) {
            processRolePermission(initRoleMap, roles, permissionId, level);
        }
    }

    /**
     * 先根据permission level关联相应层级的管理员角色
     * level=site -> SITE_ADMINISTRATOR
     * level=organization -> ORGANIZATION_ADMINISTRATOR
     * level=project -> PROJECT_ADMINISTRATOR
     */
    private void insertRolePermission(PermissionDTO permission, Map<String, RoleDTO> initRoleMap, String[] roles) {
        Long permissionId = permission.getId();
        String level = permission.getResourceLevel();
        RoleDTO role = getRoleByLevel(initRoleMap, level);
        if (role != null) {
            RolePermissionDTO dto = new RolePermissionDTO();
            dto.setRoleId(role.getId());
            dto.setPermissionId(permissionId);
            if (rolePermissionMapper.insert(dto) != 1) {
                throw new CommonException("error.rolePermission.insert");
            }
        }
        //roles不为空，关联自定义角色
        if (roles != null) {
            processRolePermission(initRoleMap, roles, permissionId, level);
        }
    }

    private void processRolePermission(Map<String, RoleDTO> initRoleMap, String[] roles, Long permissionId, String level) {
        Set<String> roleSet = new HashSet<>(Arrays.asList(roles));
        for (String roleCode : roleSet) {
            RoleDTO role = initRoleMap.get(roleCode);
            if (role == null) {
                //找不到code，说明没有初始化进去角色或者角色code拼错了
                logger.info("can not find the role, role code is : {}", roleCode);
            } else {
                if (level.equals(role.getResourceLevel())) {
                    RolePermissionDTO rp = new RolePermissionDTO();
                    rp.setRoleId(role.getId());
                    rp.setPermissionId(permissionId);
                    if (rolePermissionMapper.selectOne(rp) == null) {
                        if (rolePermissionMapper.insert(rp) != 1) {
                            throw new CommonException("error.rolePermission.insert");
                        }
                    }
                } else {
                    logger.info("init role level does not match the permission level, permission id: {}, level: {}, @@ role code: {}, level: {}",
                            permissionId, level, role.getCode(), role.getResourceLevel());
                }
            }
        }
    }

    private RoleDTO getRoleByLevel(Map<String, RoleDTO> initRoleMap, String level) {
        if (ResourceLevel.SITE.value().equals(level)) {
            return initRoleMap.get(InitRoleCode.SITE_ADMINISTRATOR);
        }
        if (ResourceLevel.ORGANIZATION.value().equals(level)) {
            return initRoleMap.get(InitRoleCode.ORGANIZATION_ADMINISTRATOR);
        }
        if (ResourceLevel.PROJECT.value().equals(level)) {
            return initRoleMap.get(InitRoleCode.PROJECT_ADMINISTRATOR);
        }
        return null;
    }

    @Override
    public Map<String, RoleDTO> queryInitRoleByCode() {
        Map<String, RoleDTO> map = new HashMap<>(10);
        String[] codes = InitRoleCode.values();
        for (String code : codes) {
            RoleDTO dto = new RoleDTO();
            dto.setCode(code);
            RoleDTO role = roleMapper.selectOne(dto);
            if (role == null) {
                logger.info("init roles do not exist, code: {}", code);
            }
            map.put(code, role);
        }
        return map;
    }

}
