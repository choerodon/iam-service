package io.choerodon.iam.app.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.netflix.appinfo.InstanceInfo;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.core.swagger.PermissionData;
import io.choerodon.core.swagger.SwaggerExtraData;
import io.choerodon.iam.api.dto.CheckPermissionDTO;
import io.choerodon.iam.app.service.PermissionService;
import io.choerodon.iam.infra.asserts.PermissionAssertHelper;
import io.choerodon.iam.infra.dto.MenuPermissionDTO;
import io.choerodon.iam.infra.dto.PermissionDTO;
import io.choerodon.iam.infra.dto.RolePermissionDTO;
import io.choerodon.iam.infra.mapper.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.netflix.eureka.EurekaDiscoveryClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import tk.mybatis.mapper.entity.Example;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author wuguokai
 */
@Service
public class PermissionServiceImpl implements PermissionService {

    private static final Logger logger = LoggerFactory.getLogger(PermissionServiceImpl.class);

    private PermissionMapper permissionMapper;

    private DiscoveryClient discoveryClient;

    private OrganizationMapper organizationMapper;

    private ProjectMapper projectMapper;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private PermissionAssertHelper permissionAssertHelper;

    private RolePermissionMapper rolePermissionMapper;

    private MenuPermissionMapper menuPermissionMapper;

    public PermissionServiceImpl(DiscoveryClient discoveryClient,
                                 OrganizationMapper organizationMapper,
                                 ProjectMapper projectMapper,
                                 PermissionMapper permissionMapper,
                                 PermissionAssertHelper permissionAssertHelper,
                                 RolePermissionMapper rolePermissionMapper,
                                 MenuPermissionMapper menuPermissionMapper) {
        this.discoveryClient = discoveryClient;
        this.organizationMapper = organizationMapper;
        this.projectMapper = projectMapper;
        this.permissionMapper = permissionMapper;
        this.permissionAssertHelper = permissionAssertHelper;
        this.rolePermissionMapper = rolePermissionMapper;
        this.menuPermissionMapper = menuPermissionMapper;
    }


    @Override
    public PageInfo<PermissionDTO> pagingQuery(PageRequest pageRequest, PermissionDTO permissionDTO, String param) {
        return PageHelper
                .startPage(pageRequest.getPage(), pageRequest.getSize())
                .doSelectPageInfo(() -> permissionMapper.fuzzyQuery(permissionDTO, param));
    }


    @Override
    public List<CheckPermissionDTO> checkPermission(List<CheckPermissionDTO> checkPermissionDTOList) {
        CustomUserDetails details = DetailsHelper.getUserDetails();
        if (details == null) {
            checkPermissionDTOList.forEach(i -> i.setApprove(false));
            return checkPermissionDTOList;
        }
        //super admin例外处理
        if (details.getAdmin() != null && details.getAdmin()) {
            checkPermissionDTOList.forEach(dto -> dto.setApprove(permissionAssertHelper.codeExisted(dto.getCode().trim())));
            return checkPermissionDTOList;
        }
        Long userId = details.getUserId();
        Set<String> resultCodes = new HashSet<>();
        resultCodes.addAll(checkSitePermission(checkPermissionDTOList, userId));
        resultCodes.addAll(checkOrgPermission(checkPermissionDTOList, userId));
        resultCodes.addAll(checkProjectPermission(checkPermissionDTOList, userId));
        checkPermissionDTOList.forEach(p -> {
            p.setApprove(false);
            if (resultCodes.contains(p.getCode())) {
                p.setApprove(true);
            }
        });
        return checkPermissionDTOList;
    }

    private Set<String> checkSitePermission(final List<CheckPermissionDTO> checkPermissionDTOList, final Long userId) {
        Set<String> siteCodes = checkPermissionDTOList.stream().filter(i -> ResourceLevel.SITE.value().equals(i.getResourceType()))
                .map(CheckPermissionDTO::getCode).collect(Collectors.toSet());
        //site层校验之后的权限集
        return permissionMapper.checkPermission(userId, ResourceLevel.SITE.value(), 0L, siteCodes);
    }

    private Set<String> checkOrgPermission(final List<CheckPermissionDTO> checkPermissionDTOList, final Long userId) {
        List<CheckPermissionDTO> organizationPermissions = checkPermissionDTOList.stream().filter(i -> ResourceLevel.ORGANIZATION.value().equals(i.getResourceType()))
                .collect(Collectors.toList());
        Map<Long, List<CheckPermissionDTO>> orgPermissionMaps = new HashMap<>();
        organizationPermissions.forEach(p -> {
            if (orgPermissionMaps.get(p.getOrganizationId()) != null && !orgPermissionMaps.get(p.getOrganizationId()).isEmpty()) {
                orgPermissionMaps.get(p.getOrganizationId()).add(p);
            } else {
                List<CheckPermissionDTO> list = new ArrayList<>();
                list.add(p);
                orgPermissionMaps.put(p.getOrganizationId(), list);
            }
        });
        Set<String> organizationCodes = new HashSet<>();
        for (Map.Entry<Long, List<CheckPermissionDTO>> entry : orgPermissionMaps.entrySet()) {
            Long orgId = entry.getKey();
            if (orgId != null) {
                Boolean orgEnabled = organizationMapper.organizationEnabled(orgId);
                if (orgEnabled != null && !orgEnabled) {
                    continue;
                }
            }
            Set<String> searchOrganizationCodes = entry.getValue().stream().map(CheckPermissionDTO::getCode).collect(Collectors.toSet());
            organizationCodes.addAll(permissionMapper.checkPermission(userId, ResourceLevel.ORGANIZATION.value(), orgId, searchOrganizationCodes));
        }
        return organizationCodes;
    }

    private Set<String> checkProjectPermission(final List<CheckPermissionDTO> checkPermissionDTOList, final Long userId) {
        List<CheckPermissionDTO> projectPermissions = checkPermissionDTOList.stream().filter(i -> ResourceLevel.PROJECT.value().equals(i.getResourceType()))
                .collect(Collectors.toList());
        Map<Long, List<CheckPermissionDTO>> projectMaps = new HashMap<>();
        projectPermissions.forEach(p -> {
            if (projectMaps.get(p.getProjectId()) != null && !projectMaps.get(p.getProjectId()).isEmpty()) {
                projectMaps.get(p.getProjectId()).add(p);
            } else {
                List<CheckPermissionDTO> list = new ArrayList<>();
                list.add(p);
                projectMaps.put(p.getProjectId(), list);
            }
        });
        Set<String> projectCodes = new HashSet<>();
        for (Map.Entry<Long, List<CheckPermissionDTO>> entry : projectMaps.entrySet()) {
            Long projectId = entry.getKey();
            if (projectId != null) {
                Boolean projectEnabled = projectMapper.projectEnabled(projectId);
                if (projectEnabled != null && !projectEnabled) {
                    continue;
                }
            }
            Set<String> searchProjectCodes = entry.getValue().stream().map(CheckPermissionDTO::getCode).collect(Collectors.toSet());
            projectCodes.addAll(permissionMapper.checkPermission(userId, ResourceLevel.PROJECT.value(), projectId, searchProjectCodes));
        }
        return projectCodes;
    }


    @Override
    public Set<PermissionDTO> queryByRoleIds(List<Long> roleIds) {
        Set<PermissionDTO> permissions = new HashSet<>();
        roleIds.forEach(roleId -> {
            List<PermissionDTO> permissionList = permissionMapper.selectByRoleId(roleId, null);
            permissions.addAll(permissionList);
        });
        return permissions;
    }

    @Override
    public List<PermissionDTO> query(String level, String serviceName, String code) {
        Example example = new Example(PermissionDTO.class);
        example.setOrderByClause("code asc");
        example.createCriteria()
                .andEqualTo("resourceLevel", level)
                .andEqualTo("serviceCode", serviceName)
                .andEqualTo("code", code);
        return permissionMapper.selectByExample(example);
    }

    @Override
    @Transactional(rollbackFor = CommonException.class)
    public void deleteByCode(String code) {
        PermissionDTO permission = permissionAssertHelper.permissionNotExisted(code);
        String serviceCode = permission.getServiceCode();
        String json = fetchLatestSwaggerJson(serviceCode);
        Set<String> permissionCodes = parseCodeFromJson(json, serviceCode);
        boolean isDeleted = !permissionCodes.contains(code);
        if (isDeleted) {
            permissionMapper.deleteByPrimaryKey(permission.getId());
            RolePermissionDTO rolePermission = new RolePermissionDTO();
            rolePermission.setPermissionId(permission.getId());
            rolePermissionMapper.delete(rolePermission);
            MenuPermissionDTO menuPermission = new MenuPermissionDTO();
            menuPermission.setPermissionCode(code);
            menuPermissionMapper.delete(menuPermission);
        } else {
            throw new CommonException("error.permission.not.obsoleting");
        }
    }

    private Set<String> parseCodeFromJson(String json, String serviceCode) {
        Set<String> codes = new HashSet<>();
        try {
            if (!StringUtils.isEmpty(serviceCode) && !StringUtils.isEmpty(json)) {
                JsonNode node = objectMapper.readTree(json);
                Iterator<Map.Entry<String, JsonNode>> pathIterator = node.get("paths").fields();
                while (pathIterator.hasNext()) {
                    Map.Entry<String, JsonNode> pathNode = pathIterator.next();
                    Iterator<Map.Entry<String, JsonNode>> methodIterator = pathNode.getValue().fields();
                    parserMethod(methodIterator, serviceCode, codes);
                }
            }
        } catch (IOException e) {
            logger.info("read message failed: {}", e);
            throw new CommonException("error.permission.parse");
        }
        return codes;
    }

    private void parserMethod(Iterator<Map.Entry<String, JsonNode>> methodIterator,
                              String serviceCode,
                              Set<String> codes) {
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
                logger.info("extraData read failed.", e);
            }
            if (extraData == null || resourceCode == null) {
                continue;
            }
            PermissionData permission = extraData.getPermission();
            String action = permission.getAction();
            String code = serviceCode + "." + resourceCode + "." + action;
            codes.add(code);
        }
    }

    private String fetchLatestSwaggerJson(String serviceCode) {
        List<ServiceInstance> serviceInstances = discoveryClient.getInstances(serviceCode);
        List<InstanceInfo> instanceInfos = new ArrayList<>();
        serviceInstances.forEach(serviceInstance -> {
            EurekaDiscoveryClient.EurekaServiceInstance eurekaServiceInstance =
                    (EurekaDiscoveryClient.EurekaServiceInstance) serviceInstance;
            instanceInfos.add(eurekaServiceInstance.getInstanceInfo());
        });
        //倒序排列,拿到最后更新的实例，根据这个实例ip去抓取swagger json
        instanceInfos.sort(Comparator.comparing(InstanceInfo::getLastUpdatedTimestamp).reversed());
        InstanceInfo instanceInfo = instanceInfos.get(0);
        return fetchSwaggerJson(instanceInfo);
    }

    private String fetchSwaggerJson(InstanceInfo instanceInfo) {
        String ip = instanceInfo.getIPAddr();
        int port = instanceInfo.getPort();
        String instanceId = instanceInfo.getInstanceId();
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://" + ip + ":" + port + "/v2/choerodon/api-docs";
        ResponseEntity<String> response;
        try {
            response = restTemplate.getForEntity(url, String.class);
        } catch (RestClientException e) {
            logger.info("fetch swagger json failed, instanceId : {}", instanceId);
            throw new CommonException("error.permission.delete.fetch.swaggerJson");
        }
        if (response.getStatusCode() != HttpStatus.OK) {
            logger.info("fetch swagger json failed, instanceId : {}", instanceId);
            throw new CommonException("error.permission.delete.fetch.swaggerJson");
        }
        return response.getBody();
    }

    @Override
    public PageInfo<PermissionDTO> listPermissionsByRoleId(PageRequest pageRequest, Long id, String params) {
        return PageHelper.startPage(pageRequest.getPage(), pageRequest.getSize()).doSelectPageInfo(() -> permissionMapper.selectByRoleId(id, params));
    }
}
