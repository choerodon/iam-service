package io.choerodon.iam.app.service.impl;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.api.dto.CheckPermissionDTO;
import io.choerodon.iam.api.dto.PermissionDTO;
import io.choerodon.iam.api.validator.ResourceLevelValidator;
import io.choerodon.iam.app.service.PermissionService;
import io.choerodon.iam.domain.repository.PermissionRepository;
import io.choerodon.iam.domain.repository.RoleRepository;
import io.choerodon.iam.infra.dataobject.PermissionDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

/**
 * @author wuguokai
 */
@Component
public class PermissionServiceImpl implements PermissionService {

    private PermissionRepository permissionRepository;
    private RoleRepository roleRepository;

    public PermissionServiceImpl(PermissionRepository permissionRepository, RoleRepository roleRepository) {
        this.permissionRepository = permissionRepository;
        this.roleRepository = roleRepository;
    }


    @Override
    public Page<PermissionDTO> pagingQuery(PageRequest pageRequest, PermissionDTO permissionDTO, String[] params) {
        ResourceLevelValidator.validate(permissionDTO.getLevel());
        Page<PermissionDO> permissionDOPage =
                permissionRepository.pagingQuery(
                        pageRequest, ConvertHelper.convert(permissionDTO, PermissionDO.class), params);
        return ConvertPageHelper.convertPage(permissionDOPage, PermissionDTO.class);
    }

    @Override
    public List<CheckPermissionDTO> checkPermission(List<CheckPermissionDTO> checkPermissionDTOList) {
        CustomUserDetails details = DetailsHelper.getUserDetails();
        if (details == null) {
            checkPermissionDTOList.forEach(i -> i.setApprove(false));
            return checkPermissionDTOList;
        }
        Long userId = details.getUserId();
        Set<String> siteCodes = checkPermissionDTOList.stream().filter(i -> ResourceLevel.SITE.value().equals(i.getResourceType()))
                .map(CheckPermissionDTO::getCode).collect(Collectors.toSet());
        //site层校验之后的权限集
        siteCodes = permissionRepository.checkPermission(userId, ResourceLevel.SITE.value(), 0L, siteCodes);
        //组织层分组再校验
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
        //项目层分组再校验
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
        Set<String> resultCodes = siteCodes;
        resultCodes.addAll(organizationCodes);
        resultCodes.addAll(projectCodes);
        checkPermissionDTOList.forEach(p -> {
            p.setApprove(false);
            if (resultCodes.contains(p.getCode())) {
                p.setApprove(true);
            }
        });
        return checkPermissionDTOList;
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
}
