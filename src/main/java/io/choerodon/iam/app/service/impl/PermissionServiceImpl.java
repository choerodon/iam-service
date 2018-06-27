package io.choerodon.iam.app.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.netflix.appinfo.InstanceInfo;
import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.core.swagger.PermissionData;
import io.choerodon.core.swagger.SwaggerExtraData;
import io.choerodon.iam.api.dto.CheckPermissionDTO;
import io.choerodon.iam.api.dto.PermissionDTO;
import io.choerodon.iam.api.validator.ResourceLevelValidator;
import io.choerodon.iam.app.service.PermissionService;
import io.choerodon.iam.domain.iam.entity.PermissionE;
import io.choerodon.iam.domain.iam.entity.RolePermissionE;
import io.choerodon.iam.domain.repository.PermissionRepository;
import io.choerodon.iam.domain.repository.RolePermissionRepository;
import io.choerodon.iam.infra.dataobject.PermissionDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.netflix.eureka.EurekaDiscoveryClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.stereotype.Service;

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

    private RolePermissionRepository rolePermissionRepository;

    private DiscoveryClient discoveryClient;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public PermissionServiceImpl(PermissionRepository permissionRepository,
                                 DiscoveryClient discoveryClient,
                                 RolePermissionRepository rolePermissionRepository) {
        this.permissionRepository = permissionRepository;
        this.discoveryClient = discoveryClient;
        this.rolePermissionRepository = rolePermissionRepository;
    }


    @Override
    public Page<PermissionDTO> pagingQuery(PageRequest pageRequest, PermissionDTO permissionDTO, String param) {
        ResourceLevelValidator.validate(permissionDTO.getLevel());
        Page<PermissionDO> permissionDOPage =
                permissionRepository.pagingQuery(
                        pageRequest, ConvertHelper.convert(permissionDTO, PermissionDO.class), param);
        return ConvertPageHelper.convertPage(permissionDOPage, PermissionDTO.class);
    }


    @Override
    public List<CheckPermissionDTO> checkPermission(List<CheckPermissionDTO> checkPermissionDTOList) {
        CustomUserDetails details = DetailsHelper.getUserDetails();
        if (details == null) {
            checkPermissionDTOList.forEach(i -> i.setApprove(false));
            return checkPermissionDTOList;
        }
        //super admin例外处理
        if (details.getAdmin()) {
            checkPermissionDTOList.stream().filter(t -> permissionRepository.existByCode(t.getCode().trim())).forEach(cp -> cp.setApprove(true));
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
            List<PermissionDTO> permissionList =
                    ConvertHelper.convertList(permissionRepository.selectByRoleId(roleId), PermissionDTO.class);
            permissions.addAll(permissionList);
        });
        return permissions;
    }

    @Override
    public List<PermissionDTO> query(String level, String serviceName, String code) {
        return ConvertHelper.convertList(permissionRepository.query(level, serviceName, code), PermissionDTO.class);
    }

    @Override
    @Transactional(rollbackFor = CommonException.class)
    public void deleteByCode(String code) {
        PermissionE permissionE = permissionRepository.selectByCode(code);
        boolean deleted =
                Optional
                        .ofNullable(permissionE)
                        .map(p -> {
                            String serviceName = p.getServiceName();
                            String json = fetchLatestSwaggerJson(serviceName);
                            Set<String> permissionCodes = parseCodeFromJson(json, serviceName);
                            if (permissionCodes.contains(code)) {
                                return false;
                            } else {
                                return true;
                            }
                        })
                        .orElseThrow(() -> new CommonException("error.permission.not.exist"));
        if (deleted) {
            permissionRepository.deleteById(permissionE.getId());
            RolePermissionE rolePermission = new RolePermissionE(null, null, permissionE.getId());
            rolePermissionRepository.delete(rolePermission);
        } else {
            throw new CommonException("error.permission.not.obsoleting");
        }
    }

    private Set<String> parseCodeFromJson(String json, String serviceName) {
        Set<String> codes = new HashSet<>();
        try {
            if (!StringUtils.isEmpty(serviceName) && !StringUtils.isEmpty(json)) {
                JsonNode node = objectMapper.readTree(json);
                Iterator<Map.Entry<String, JsonNode>> pathIterator = node.get("paths").fields();
                while (pathIterator.hasNext()) {
                    Map.Entry<String, JsonNode> pathNode = pathIterator.next();
                    Iterator<Map.Entry<String, JsonNode>> methodIterator = pathNode.getValue().fields();
                    parserMethod(methodIterator, serviceName, codes);
                }
            }
        } catch (IOException e) {
            logger.info("read message failed: {}", e);
            throw new CommonException("error.permission.parse");
        }
        return codes;
    }

    private void parserMethod(Iterator<Map.Entry<String, JsonNode>> methodIterator,
                              String serviceName,
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
            String code = serviceName + "." + resourceCode + "." + action;
            codes.add(code);
        }
    }

    private String fetchLatestSwaggerJson(String serviceName) {
        List<ServiceInstance> serviceInstances = discoveryClient.getInstances(serviceName);
        List<InstanceInfo> instanceInfos = new ArrayList<>();
        serviceInstances.forEach( serviceInstance -> {
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
        String url = "http://" + ip+ ":"+ port + "/v2/choerodon/api-docs";
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
}
