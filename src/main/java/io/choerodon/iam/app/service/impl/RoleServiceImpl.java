package io.choerodon.iam.app.service.impl;

import com.github.pagehelper.PageInfo;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.ClientRoleSearchDTO;
import io.choerodon.iam.api.dto.RoleAssignmentSearchDTO;
import io.choerodon.iam.api.query.RoleQuery;
import io.choerodon.iam.api.validator.ResourceLevelValidator;
import io.choerodon.iam.app.service.RoleService;
import io.choerodon.iam.domain.repository.ClientRepository;
import io.choerodon.iam.domain.repository.RolePermissionRepository;
import io.choerodon.iam.domain.repository.RoleRepository;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.domain.service.IRoleService;
import io.choerodon.iam.infra.common.utils.ParamUtils;
import io.choerodon.iam.infra.dto.PermissionDTO;
import io.choerodon.iam.infra.dto.RoleDTO;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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

    private RolePermissionRepository rolePermissionRepository;

    public RoleServiceImpl(RoleRepository roleRepository, IRoleService iRoleService,
                           UserRepository userRepository, RolePermissionRepository rolePermissionRepository,
                           ClientRepository clientRepository) {
        this.roleRepository = roleRepository;
        this.iRoleService = iRoleService;
        this.userRepository = userRepository;
        this.rolePermissionRepository = rolePermissionRepository;
        this.clientRepository = clientRepository;
    }

    @Override
    public PageInfo<RoleDTO> pagingSearch(int page, int size, RoleQuery roleQuery) {
        boolean isWithUser = (roleQuery.getWithUser() != null && roleQuery.getWithUser() == true);
        final String level = roleQuery.getLevel();
        final Long sourceId = roleQuery.getSourceId();
        PageInfo<RoleDTO> roles = roleRepository.pagingQuery(page, size, roleQuery);
        if (isWithUser) {
            roles.getList().forEach(role -> {
                Long roleId = role.getId();
                if (level == null || ResourceType.isSite(level)) {
                    role.setUsers(userRepository.listUsersByRoleIdOnSiteLevel(roleId));
                }
                if (ResourceType.isOrganization(level)) {
                    role.setUsers(userRepository.listUsersByRoleIdOnOrganizationLevel(sourceId, roleId));
                }
                if (ResourceType.isProject(level)) {
                    role.setUsers(userRepository.listUsersByRoleIdOnProjectLevel(sourceId, roleId));
                }
            });
        }
        return roles;
    }

    @Override
    public PageInfo<RoleDTO> pagingQueryOrgRoles(Long orgId, PageRequest pageRequest, RoleQuery roleQuery) {
        return roleRepository.pagingQueryOrgRoles(orgId, pageRequest, roleQuery);
    }

    @Override
    public RoleDTO create(RoleDTO roleDTO) {
        insertCheck(roleDTO);
        return iRoleService.create(roleDTO);
    }

    private void insertCheck(RoleDTO roleDTO) {
        ResourceLevelValidator.validate(roleDTO.getResourceLevel());
        validateCode(roleDTO.getCode());
        validatePermissions(roleDTO.getPermissions());
    }

    private void validatePermissions(List<PermissionDTO> permissions) {
        if (permissions == null || permissions.isEmpty()) {
            throw new CommonException("error.role_permission.empty");
        }
    }

    private void validateCode(String code) {
        if (StringUtils.isEmpty(code)) {
            throw new CommonException("error.role.code.empty");
        }
        if (code.length() > 128) {
            throw new CommonException("error.role.code.length");
        }
        String[] codes = code.split("/");
        String lastCode = codes[codes.length - 1];
        Pattern p = Pattern.compile("^[a-z]([-a-z0-9]*[a-z0-9])$");
        Matcher m = p.matcher(lastCode);
        boolean isCheck = m.matches();
        if (!isCheck) {
            throw new CommonException("error.role.code.regular.illegal");
        }
    }

    @Override
    public RoleDTO createBaseOnRoles(RoleDTO roleDTO) {
        insertCheck(roleDTO);
        List<Long> roleIds = roleDTO.getRoleIds();
        if (!roleRepository.judgeRolesSameLevel(roleIds)) {
            throw new CommonException("error.roles.in.same.level");
        }
        List<PermissionDTO> permissionDTOS = new ArrayList<>();
        if (!roleIds.isEmpty()) {
            List<Long> permissionIds = rolePermissionRepository.queryExistingPermissionIdsByRoleIds(roleIds);
            permissionDTOS = permissionIds.parallelStream().map(id -> {
                PermissionDTO permissionDTO = new PermissionDTO();
                permissionDTO.setId(id);
                return permissionDTO;
            }).collect(Collectors.toList());
        }
        roleDTO.setPermissions(permissionDTOS);
        return create(roleDTO);
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    public RoleDTO update(RoleDTO roleDTO) {
        updateCheck(roleDTO);
        //更新操作不能改level
        roleDTO.setResourceLevel(null);
        return iRoleService.update(roleDTO);
    }

    @Override
    public RoleDTO orgUpdate(RoleDTO roleDTO, Long orgId) {
        checkRoleCanBeModified(roleDTO.getId(), orgId);
        return update(roleDTO);
    }

    private void updateCheck(RoleDTO roleDTO) {
        if (StringUtils.isEmpty(roleDTO.getName())) {
            throw new CommonException("error.role.name.empty");
        }
        if (roleDTO.getName().length() > 64) {
            throw new CommonException("error.role.name.size");
        }
        ResourceLevelValidator.validate(roleDTO.getResourceLevel());
        validateCode(roleDTO.getCode());
        if (roleDTO.getObjectVersionNumber() == null) {
            throw new CommonException("error.role.objectVersionNumber.empty");
        }
        validatePermissions(roleDTO.getPermissions());
    }

    @Override
    public void delete(Long id) {
        iRoleService.deleteByPrimaryKey(id);
    }

    @Override
    public RoleDTO queryById(Long id) {
        RoleDTO roleDTO = roleRepository.selectByPrimaryKey(id);
        if (roleDTO == null) {
            throw new CommonException("error.role.not.exist");
        }
        return roleDTO;
    }

    @Override
    public RoleDTO enableRole(Long id) {
        return iRoleService.updateRoleEnabled(id);
    }

    @Override
    public RoleDTO disableRole(Long id) {
        return iRoleService.updateRoleDisabled(id);
    }

    @Override
    public RoleDTO orgEnableRole(Long roleId, Long orgId) {
        checkRoleCanBeModified(roleId, orgId);
        return enableRole(roleId);
    }

    @Override
    public RoleDTO orgDisableRole(Long roleId, Long orgId) {
        checkRoleCanBeModified(roleId, orgId);
        return disableRole(roleId);
    }

    @Override
    public RoleDTO queryWithPermissionsAndLabels(Long id) {
        return roleRepository.selectRoleWithPermissionsAndLabels(id);
    }

    @Override
    public List<RoleDTO> listRolesWithUserCountOnSiteLevel(RoleAssignmentSearchDTO roleAssignmentSearchDTO) {
        List<RoleDTO> roles = roleRepository.fuzzySearchRolesByName(roleAssignmentSearchDTO.getRoleName(), ResourceLevel.SITE.value());
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
        List<RoleDTO> roles = roleRepository.fuzzySearchRolesByName(clientRoleSearchDTO.getRoleName(), ResourceLevel.SITE.value());
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
        List<RoleDTO> roles = roleRepository.fuzzySearchRolesByName(roleAssignmentSearchDTO.getRoleName(), ResourceLevel.ORGANIZATION.value());
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
        List<RoleDTO> roles = roleRepository.fuzzySearchRolesByName(clientRoleSearchDTO.getRoleName(), ResourceLevel.ORGANIZATION.value());
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
        List<RoleDTO> roles = roleRepository.fuzzySearchRolesByName(roleAssignmentSearchDTO.getRoleName(), ResourceLevel.PROJECT.value());
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
        List<RoleDTO> roles = roleRepository.fuzzySearchRolesByName(clientRoleSearchDTO.getRoleName(), ResourceLevel.PROJECT.value());
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
        RoleDTO roleDTO = new RoleDTO();
        roleDTO.setCode(role.getCode());
        if (createCheck) {
            Boolean existed = roleRepository.selectOne(roleDTO) != null;
            if (existed) {
                throw new CommonException("error.role.code.exist");
            }
        } else {
            Long id = role.getId();
            RoleDTO roleDTO1 = roleRepository.selectOne(roleDTO);
            Boolean existed = roleDTO1 != null && !id.equals(roleDTO1.getId());
            if (existed) {
                throw new CommonException("error.role.code.exist");
            }
        }

    }

    @Override
    public List<Long> queryIdsByLabelNameAndLabelType(String labelName, String labelType) {
        List<RoleDTO> roles = roleRepository.selectRolesByLabelNameAndType(labelName, labelType, null);
        return roles.stream().map(RoleDTO::getId).collect(Collectors.toList());
    }

    @Override
    public List<RoleDTO> selectByLabel(String label, Long organizationId) {
        return roleRepository.selectRolesByLabelNameAndType(label, "role", organizationId);
    }

    @Override
    public List<RoleDTO> listRolesBySourceIdAndTypeAndUserId(String sourceType, Long sourceId, Long userId) {
        return roleRepository.selectUsersRolesBySourceIdAndType(sourceType, sourceId, userId);
    }

    @Override
    public RoleDTO queryByCode(String code) {
        RoleDTO roleDTO = new RoleDTO();
        roleDTO.setCode(code);
        return roleRepository.selectOne(roleDTO);
    }


    /**
     * 校验是否可修改该角色
     * 时机：组织层修改/启停用角色时校验
     * 内容：1.角色必须存在，2.不可修改平台层创建的组织层角色，3.不可修改其他组织创建的角色
     *
     * @param roleId
     * @param orgId
     */
    private void checkRoleCanBeModified(Long roleId, Long orgId) {
        RoleDTO roleDTO = roleRepository.selectByPrimaryKey(roleId);
        if (roleDTO == null) {
            throw new CommonException("error.role.not.exist");
        }
        if (roleDTO.getOrganizationId() == null || roleDTO.getOrganizationId() != orgId) {
            throw new CommonException("error.role.modify.check");
        }
    }
}
