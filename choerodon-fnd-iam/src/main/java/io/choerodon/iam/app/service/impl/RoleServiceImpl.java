//package io.choerodon.iam.app.service.impl;
//
//import com.github.pagehelper.Page;
//import com.github.pagehelper.PageHelper;
//import io.choerodon.base.enums.ResourceType;
//import io.choerodon.core.exception.CommonException;
//import io.choerodon.iam.api.controller.query.RoleQuery;
//import io.choerodon.iam.app.service.RoleService;
//import io.choerodon.iam.infra.asserts.PermissionAssertHelper;
//import io.choerodon.iam.infra.dto.PermissionDTO;
//import io.choerodon.iam.infra.dto.RoleDTO;
//import io.choerodon.iam.infra.dto.RolePermissionDTO;
//import io.choerodon.iam.infra.mapper.RoleMapper;
//import io.choerodon.iam.infra.mapper.RolePermissionMapper;
//import io.choerodon.iam.infra.asserts.RoleAssertHelper;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Set;
//import java.util.stream.Collectors;
//
///**
// * @author superlee
// * @since 2019-04-15
// */
//@Service
//public class RoleServiceImpl implements RoleService {
//
//    private RoleMapper roleMapper;
//
//    private RolePermissionMapper rolePermissionMapper;
//
//    private RoleAssertHelper roleAssertHelper;
//
//    private PermissionAssertHelper permissionAssertHelper;
//
//    public RoleServiceImpl(RoleMapper roleMapper, RoleAssertHelper roleAssertHelper,
//                           RolePermissionMapper rolePermissionMapper,
//                           PermissionAssertHelper permissionAssertHelper) {
//        this.roleAssertHelper = roleAssertHelper;
//        this.roleMapper = roleMapper;
//        this.rolePermissionMapper = rolePermissionMapper;
//        this.permissionAssertHelper = permissionAssertHelper;
//    }
//
//    @Override
//    public RoleDTO create(RoleDTO roleDTO) {
//        preCreate(roleDTO);
//        roleMapper.insertSelective(roleDTO);
//        insertRolePermission(roleDTO);
//        //todo insert role_label
//        return roleMapper.selectByPrimaryKey(roleDTO);
//    }
//
//    private void insertRolePermission(RoleDTO roleDTO) {
//        long roleId = roleDTO.getId();
//        String level = roleDTO.getResourceLevel();
//        List<PermissionDTO> permissions = roleDTO.getPermissions();
//        if (permissions != null && !permissions.isEmpty()) {
//            permissions.forEach(p -> {
//                Long permissionId = p.getId();
//                insertRolePermission(roleId, level, permissionId);
//            });
//        } else {
//            throw new CommonException("error.role.create.permissions.empty");
//        }
//    }
//
//    @Override
//    public Page<RoleDTO> pagedSearch(int page, int size, RoleQuery roleQuery) {
//        return PageHelper
//                .startPage(page, size)
//                .doSelectPage(() -> roleMapper.fuzzyQuery(roleQuery));
//    }
//
//    @Override
//    public RoleDTO update(Long id, RoleDTO roleDTO) {
//        RoleDTO role = roleAssertHelper.roleNotExisted(id);
//        roleDTO.setId(id);
//        roleDTO.setResourceLevel(role.getResourceLevel());
//        //todo update role_label
//        if (!role.getBuiltIn()) {
//            role.setName(roleDTO.getName());
//            role.setDescription(roleDTO.getDescription());
//            role.setEnabled(roleDTO.getEnabled());
//            roleMapper.updateByPrimaryKeySelective(role);
//
//            updateRolePermission(roleDTO);
//        }
//        return roleMapper.selectByPrimaryKey(id);
//    }
//
//    @Override
//    public RoleDTO query(Long id) {
//        return roleMapper.selectByPrimaryKey(id);
//    }
//
//    private void updateRolePermission(RoleDTO roleDTO) {
//        long roleId = roleDTO.getId();
//        String level = roleDTO.getResourceLevel();
//        List<PermissionDTO> permissions = roleDTO.getPermissions();
//        if (permissions != null && !permissions.isEmpty()) {
//            RolePermissionDTO rolePermissionDTO = new RolePermissionDTO();
//            rolePermissionDTO.setRoleId(roleId);
//            Set<Long> existedIds =
//                    rolePermissionMapper.select(rolePermissionDTO)
//                            .stream().map(RolePermissionDTO::getPermissionId).collect(Collectors.toSet());
//            Set<Long> newPermissionIds = permissions.stream().map(PermissionDTO::getId).collect(Collectors.toSet());
//            Set<Long> intersection = existedIds.stream().filter(newPermissionIds::contains).collect(Collectors.toSet());
//            Set<Long> deleteSet =
//                    existedIds.stream().filter(item -> !intersection.contains(item)).collect(Collectors.toSet());
//            Set<Long> insertSet =
//                    newPermissionIds.stream().filter(item -> !intersection.contains(item)).collect(Collectors.toSet());
//
//            insertSet.forEach(permissionId -> insertRolePermission(roleId, level, permissionId));
//            deleteSet.forEach(permissionId -> {
//                RolePermissionDTO rolePermission = new RolePermissionDTO();
//                rolePermission.setRoleId(roleId);
//                rolePermission.setPermissionId(permissionId);
//                rolePermissionMapper.delete(rolePermission);
//            });
//        } else {
//            throw new CommonException("error.role.update.permissions.empty");
//        }
//    }
//
//    private void insertRolePermission(long roleId, String level, Long permissionId) {
//        validatePermission(level, permissionId);
//        RolePermissionDTO rolePermission = new RolePermissionDTO();
//        rolePermission.setRoleId(roleId);
//        rolePermission.setPermissionId(permissionId);
//        rolePermissionMapper.insertSelective(rolePermission);
//    }
//
//    private void validatePermission(String level, Long permissionId) {
//        PermissionDTO permission = permissionAssertHelper.permissionNotExisted(permissionId);
//        if (!level.equals(permission.getResourceLevel())) {
//            throw new CommonException("error.role.level.not.match.permission.level");
//        }
//    }
//
//    private void preCreate(RoleDTO roleDTO) {
//        if (!ResourceType.contains(roleDTO.getResourceLevel())) {
//            throw new CommonException("error.role.illegal.level");
//        }
//        roleAssertHelper.codeExisted(roleDTO.getCode());
//        roleDTO.setEnabled(true);
//        roleDTO.setModified(true);
//        roleDTO.setEnableForbidden(true);
//        roleDTO.setBuiltIn(false);
//    }
//}
