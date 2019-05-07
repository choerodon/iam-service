package io.choerodon.iam.app.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import com.netflix.appinfo.InstanceInfo;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.core.swagger.PermissionData;
import io.choerodon.core.swagger.SwaggerExtraData;
import io.choerodon.iam.api.dto.CheckPermissionDTO;
import io.choerodon.iam.app.service.PermissionService;
import io.choerodon.iam.domain.repository.MenuPermissionRepository;
import io.choerodon.iam.domain.repository.PermissionRepository;
import io.choerodon.iam.domain.repository.RolePermissionRepository;
import io.choerodon.iam.infra.dto.MenuPermissionDTO;
import io.choerodon.iam.infra.dto.PermissionDTO;
import io.choerodon.iam.infra.dto.RolePermissionDTO;
import io.choerodon.iam.infra.mapper.OrganizationMapper;
import io.choerodon.iam.infra.mapper.PermissionMapper;
import io.choerodon.iam.infra.mapper.ProjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author wuguokai
 */
@Service
public class PermissionServiceImpl implements PermissionService {

    private static final Logger logger = LoggerFactory.getLogger(PermissionServiceImpl.class);

    private PermissionRepository permissionRepository;

    @Autowired
    private PermissionMapper permissionMapper;

    private RolePermissionRepository rolePermissionRepository;

    private DiscoveryClient discoveryClient;

    private MenuPermissionRepository menuPermissionRepository;

    private OrganizationMapper organizationMapper;

    private ProjectMapper projectMapper;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public PermissionServiceImpl(PermissionRepository permissionRepository,
                                 DiscoveryClient discoveryClient,
                                 RolePermissionRepository rolePermissionRepository,
                                 MenuPermissionRepository menuPermissionRepository,
                                 OrganizationMapper organizationMapper,
                                 ProjectMapper projectMapper) {
        this.permissionRepository = permissionRepository;
        this.discoveryClient = discoveryClient;
        this.rolePermissionRepository = rolePermissionRepository;
        this.menuPermissionRepository = menuPermissionRepository;
        this.organizationMapper = organizationMapper;
        this.projectMapper = projectMapper;
    }


    @Override
    public PageInfo<PermissionDTO> pagingQuery(int page, int size, PermissionDTO permissionDTO, String param) {
        return permissionRepository.pagingQuery(page, size, permissionDTO, param);
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
            checkPermissionDTOList.forEach(dto -> dto.setApprove(permissionRepository.existByCode(dto.getCode().trim())));
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
        siteCodes = permissionRepository.checkPermission(userId, ResourceLevel.SITE.value(), 0L, siteCodes);
        return siteCodes;
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
            searchOrganizationCodes = permissionRepository.checkPermission(userId, ResourceLevel.ORGANIZATION.value(), orgId, searchOrganizationCodes);
            organizationCodes.addAll(searchOrganizationCodes);
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
            searchProjectCodes = permissionRepository.checkPermission(userId, ResourceLevel.PROJECT.value(), projectId, searchProjectCodes);
            projectCodes.addAll(searchProjectCodes);
        }
        return projectCodes;
    }


    @Override
    public Set<PermissionDTO> queryByRoleIds(List<Long> roleIds) {
        Set<PermissionDTO> permissions = new HashSet<>();
        roleIds.forEach(roleId -> {
            List<PermissionDTO> permissionList = permissionRepository.selectByRoleId(roleId);
            permissions.addAll(permissionList);
        });
        return permissions;
    }

    @Override
    public List<PermissionDTO> query(String level, String serviceName, String code) {
        return permissionRepository.query(level, serviceName, code);
    }

    @Override
    @Transactional(rollbackFor = CommonException.class)
    public void deleteByCode(String code) {
        PermissionDTO permissionDTO = permissionRepository.selectByCode(code);
        boolean deleted =
                Optional
                        .ofNullable(permissionDTO)
                        .map(p -> {
                            String serviceCode = p.getServiceCode();
                            String json = fetchLatestSwaggerJson(serviceCode);
                            Set<String> permissionCodes = parseCodeFromJson(json, serviceCode);
                            return !permissionCodes.contains(code);
                        })
                        .orElseThrow(() -> new CommonException("error.permission.does.not.exist"));
        if (deleted) {
            permissionRepository.deleteById(permissionDTO.getId());
            RolePermissionDTO rolePermission = new RolePermissionDTO();
            rolePermission.setPermissionId(permissionDTO.getId());
            rolePermissionRepository.delete(rolePermission);
            MenuPermissionDTO menuPermission = new MenuPermissionDTO();
            menuPermission.setPermissionCode(code);
            menuPermissionRepository.delete(menuPermission);
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
    public PageInfo<PermissionDTO> listPermissionsByRoleId(int page, int size, Long id, String params) {
        return permissionRepository.pagingQueryByRoleId(page, size, id, params);
    }
}
