package io.choerodon.iam.app.service.impl;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.*;
import io.choerodon.iam.app.service.RoleService;
import io.choerodon.iam.domain.iam.entity.PermissionE;
import io.choerodon.iam.domain.iam.entity.RoleE;
import io.choerodon.iam.domain.repository.*;
import io.choerodon.iam.domain.service.IRoleService;
import io.choerodon.iam.infra.common.utils.ParamUtils;
import io.choerodon.iam.infra.dataobject.RoleDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author superlee
 * @data 2018/3/27
 */
@Component
public class RoleServiceImpl implements RoleService {

    private ClientRepository clientRepository;

    private RoleRepository roleRepository;

    private IRoleService iRoleService;

    private UserRepository userRepository;

    private PermissionRepository permissionRepository;

    private RolePermissionRepository rolePermissionRepository;

    public RoleServiceImpl(RoleRepository roleRepository, IRoleService iRoleService,
                           UserRepository userRepository, RolePermissionRepository rolePermissionRepository,
                           PermissionRepository permissionRepository, ClientRepository clientRepository) {
        this.roleRepository = roleRepository;
        this.iRoleService = iRoleService;
        this.userRepository = userRepository;
        this.rolePermissionRepository = rolePermissionRepository;
        this.permissionRepository = permissionRepository;
        this.clientRepository = clientRepository;
    }

    @Override
    public Page<RoleDTO> pagingQuery(PageRequest pageRequest, Boolean needUsers, Long sourceId, String sourceType, RoleSearchDTO role) {
        if (sourceType != null) {
            role.setLevel(sourceType);
        }
        Page<RoleDO> roleDOPage = roleRepository.pagingQuery(
                pageRequest, ConvertHelper.convert(role, RoleDO.class), ParamUtils.arrToStr(role.getParams()));
        Page<RoleDTO> roleDTOPage = ConvertPageHelper.convertPage(roleDOPage, RoleDTO.class);
        if (needUsers != null && needUsers) {
            roleDTOPage.getContent().forEach(roleDTO -> {
                if (sourceType == null || ResourceLevel.SITE.value().equals(sourceType)) {
                    roleDTO.setUsers(ConvertHelper.convertList(
                            userRepository.listUsersByRoleIdOnSiteLevel(roleDTO.getId()), UserDTO.class));
                } else if (ResourceLevel.ORGANIZATION.value().equals(sourceType) && sourceId != null) {
                    roleDTO.setUsers(ConvertHelper.convertList(
                            userRepository.listUsersByRoleIdOnOrganizationLevel(
                                    sourceId, roleDTO.getId()), UserDTO.class));
                } else if (ResourceLevel.PROJECT.value().equals(sourceType) && sourceId != null) {
                    roleDTO.setUsers(ConvertHelper.convertList(
                            userRepository.listUsersByRoleIdOnProjectLevel(
                                    sourceId, roleDTO.getId()), UserDTO.class));
                }
            });
        }
        return roleDTOPage;
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    public RoleDTO create(RoleDTO roleDTO) {
        return ConvertHelper.convert(
                iRoleService.create(ConvertHelper.convert(roleDTO, RoleE.class)), RoleDTO.class);
    }

    @Override
    public RoleDTO createBaseOnRoles(RoleDTO roleDTO) {
        List<Long> roleIds = roleDTO.getRoleIds();
        if (!roleRepository.judgeRolesSameLevel(roleIds)) {
            throw new CommonException("error.roles.in.same.level");
        }
        List<PermissionDTO> permissionDTOS = new ArrayList<>();
        if (!roleIds.isEmpty()) {
            List<Long> permissionIds = rolePermissionRepository.queryPermissionIdsByRoles(roleIds);
            for (Long id : permissionIds) {
                PermissionE permissionE = permissionRepository.selectByPrimaryKey(id);
                PermissionDTO permissionDTO = ConvertHelper.convert(permissionE, PermissionDTO.class);
                if (permissionDTO != null) {
                    permissionDTOS.add(permissionDTO);
                }
            }
        }
        roleDTO.setPermissions(permissionDTOS);
        return create(roleDTO);
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    public RoleDTO update(RoleDTO roleDTO) {
        return ConvertHelper.convert(
                iRoleService.update(ConvertHelper.convert(roleDTO, RoleE.class)), RoleDTO.class);
    }

    @Override
    public void delete(Long id) {
        iRoleService.deleteByPrimaryKey(id);
    }

    @Override
    public RoleDTO queryById(Long id) {
        RoleE roleE = roleRepository.selectByPrimaryKey(id);
        if (roleE == null) {
            throw new CommonException("error.role.not.exist");
        }
        return ConvertHelper.convert(roleE, RoleDTO.class);
    }

    @Override
    public RoleDTO enableRole(Long id) {
        return ConvertHelper.convert(iRoleService.updateRoleEnabled(id), RoleDTO.class);
    }

    @Override
    public RoleDTO disableRole(Long id) {
        return ConvertHelper.convert(iRoleService.updateRoleDisabled(id), RoleDTO.class);
    }

    @Override
    public RoleDTO queryWithPermissionsAndLabels(Long id) {
        return ConvertHelper.convert(
                roleRepository.selectRoleWithPermissionsAndLabels(id), RoleDTO.class);
    }

    @Override
    public List<RoleDTO> listRolesWithUserCountOnSiteLevel(RoleAssignmentSearchDTO roleAssignmentSearchDTO) {
        List<RoleDTO> roles = ConvertHelper.convertList(roleRepository.fuzzySearchRolesByName(roleAssignmentSearchDTO.getRoleName(), ResourceLevel.SITE.value()), RoleDTO.class);
        String param = ParamUtils.arrToStr(roleAssignmentSearchDTO.getParam());
        roles.forEach(r -> {
            Integer count = userRepository.selectUserCountFromMemberRoleByOptions(
                    r.getId(), "user", 0L, ResourceLevel.SITE.value(), roleAssignmentSearchDTO, param);
            r.setUserCount(count);
        });
        return roles;
    }

    @Override
    public List<RoleDTO> listRolesWithClientCountOnSiteLevel(ClientRoleSearchDTO clientRoleSearchDTO) {
        List<RoleDTO> roles = ConvertHelper.convertList(roleRepository.fuzzySearchRolesByName(clientRoleSearchDTO.getRoleName(), ResourceLevel.SITE.value()), RoleDTO.class);
        String param = ParamUtils.arrToStr(clientRoleSearchDTO.getParam());
        roles.forEach(r -> {
            Integer count = clientRepository.selectClientCountFromMemberRoleByOptions(
                    r.getId(), 0L, ResourceLevel.SITE.value(), clientRoleSearchDTO, param);
            r.setUserCount(count);
        });
        return roles;
    }

    @Override
    public List<RoleDTO> listRolesWithUserCountOnOrganizationLevel(RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long sourceId) {
        List<RoleDTO> roles = ConvertHelper.convertList(roleRepository.fuzzySearchRolesByName(roleAssignmentSearchDTO.getRoleName(), ResourceLevel.ORGANIZATION.value()), RoleDTO.class);
        String param = ParamUtils.arrToStr(roleAssignmentSearchDTO.getParam());
        roles.forEach(r -> {
            Integer count = userRepository.selectUserCountFromMemberRoleByOptions(
                    r.getId(), "user", sourceId, ResourceLevel.ORGANIZATION.value(), roleAssignmentSearchDTO, param);
            r.setUserCount(count);
        });
        return roles;
    }

    @Override
    public List<RoleDTO> listRolesWithClientCountOnOrganizationLevel(ClientRoleSearchDTO clientRoleSearchDTO, Long sourceId) {
        List<RoleDTO> roles = ConvertHelper.convertList(roleRepository.fuzzySearchRolesByName(clientRoleSearchDTO.getRoleName(), ResourceLevel.ORGANIZATION.value()), RoleDTO.class);
        String param = ParamUtils.arrToStr(clientRoleSearchDTO.getParam());
        roles.forEach(r -> {
            Integer count = clientRepository.selectClientCountFromMemberRoleByOptions(
                    r.getId(), sourceId, ResourceLevel.ORGANIZATION.value(), clientRoleSearchDTO, param);
            r.setUserCount(count);
        });
        return roles;
    }

    @Override
    public List<RoleDTO> listRolesWithUserCountOnProjectLevel(RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long sourceId) {
        List<RoleDTO> roles = ConvertHelper.convertList(roleRepository.fuzzySearchRolesByName(roleAssignmentSearchDTO.getRoleName(), ResourceLevel.PROJECT.value()), RoleDTO.class);
        String param = ParamUtils.arrToStr(roleAssignmentSearchDTO.getParam());
        roles.forEach(r -> {
            Integer count = userRepository.selectUserCountFromMemberRoleByOptions(
                    r.getId(), "user", sourceId, ResourceLevel.PROJECT.value(), roleAssignmentSearchDTO, param);
            r.setUserCount(count);
        });
        return roles;
    }

    @Override
    public List<RoleDTO> listRolesWithClientCountOnProjectLevel(ClientRoleSearchDTO clientRoleSearchDTO, Long sourceId) {
        List<RoleDTO> roles = ConvertHelper.convertList(roleRepository.fuzzySearchRolesByName(clientRoleSearchDTO.getRoleName(), ResourceLevel.PROJECT.value()), RoleDTO.class);
        String param = ParamUtils.arrToStr(clientRoleSearchDTO.getParam());
        roles.forEach(r -> {
            Integer count = clientRepository.selectClientCountFromMemberRoleByOptions(
                    r.getId(), sourceId, ResourceLevel.PROJECT.value(), clientRoleSearchDTO, param);
            r.setUserCount(count);
        });
        return roles;
    }

    @Override
    public void check(RoleDTO role) {
        Boolean checkCode = !StringUtils.isEmpty(role.getCode());
        if (!checkCode) {
            throw new CommonException("error.role.code.empty");
        }
        checkCode(role);
    }

    private void checkCode(RoleDTO role) {
        Boolean createCheck = StringUtils.isEmpty(role.getId());
        RoleDO roleDO = new RoleDO();
        roleDO.setCode(role.getCode());
        if (createCheck) {
            Boolean existed = roleRepository.selectOne(roleDO) != null;
            if (existed) {
                throw new CommonException("error.role.code.exist");
            }
        } else {
            Long id = role.getId();
            RoleDO roleDO1 = roleRepository.selectOne(roleDO);
            Boolean existed = roleDO1 != null && !id.equals(roleDO1.getId());
            if (existed) {
                throw new CommonException("error.role.code.exist");
            }
        }

    }

    @Override
    public List<Long> queryIdsByLabelNameAndLabelType(String labelName, String labelType) {
        List<RoleDO> roles = roleRepository.selectRolesByLabelNameAndType(labelName, labelType);
        return roles.stream().map(RoleDO::getId).collect(Collectors.toList());
    }

    @Override
    public List<RoleDTO> listRolesBySourceIdAndTypeAndUserId(String sourceType, Long sourceId, Long userId) {
        return ConvertHelper.convertList(
                roleRepository.selectUsersRolesBySourceIdAndType(sourceType, sourceId, userId), RoleDTO.class);
    }
}
