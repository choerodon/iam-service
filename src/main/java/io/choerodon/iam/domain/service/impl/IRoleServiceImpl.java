package io.choerodon.iam.domain.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.choerodon.asgard.saga.dto.StartInstanceDTO;
import io.choerodon.asgard.saga.feign.SagaClient;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.payload.UserMemberEventPayload;
import io.choerodon.iam.domain.repository.*;
import io.choerodon.iam.domain.service.IRoleService;
import io.choerodon.iam.infra.dto.*;
import io.choerodon.mybatis.service.BaseServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static io.choerodon.iam.infra.common.utils.SagaTopic.MemberRole.MEMBER_ROLE_UPDATE;

/**
 * @author superlee
 * @data 2018/3/27
 */
@Service
@RefreshScope
public class IRoleServiceImpl extends BaseServiceImpl<RoleDTO> implements IRoleService {

    @Value("${choerodon.devops.message:false}")
    private boolean devopsMessage;

    @Value("${spring.application.name:default}")
    private String serviceName;


    private RoleRepository roleRepository;

    private RolePermissionRepository rolePermissionRepository;

    private PermissionRepository permissionRepository;

    private LabelRepository labelRepository;

    private RoleLabelRepository roleLabelRepository;

    private UserRepository userRepository;

    private SagaClient sagaClient;

    private final ObjectMapper mapper = new ObjectMapper();

    private static final String ROLE_NOT_EXIST_EXCEPTION = "error.role.not.exist";

    public IRoleServiceImpl(RoleRepository roleRepository,
                            RolePermissionRepository rolePermissionRepository,
                            PermissionRepository permissionRepository,
                            LabelRepository labelRepository,
                            RoleLabelRepository roleLabelRepository,
                            UserRepository userRepository,
                            SagaClient sagaClient) {
        this.roleRepository = roleRepository;
        this.rolePermissionRepository = rolePermissionRepository;
        this.permissionRepository = permissionRepository;
        this.labelRepository = labelRepository;
        this.roleLabelRepository = roleLabelRepository;
        this.userRepository = userRepository;
        this.sagaClient = sagaClient;

    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    public RoleDTO create(RoleDTO roleDTO) {
        roleDTO.setBuiltIn(false);
        roleDTO.setEnabled(true);
        roleDTO.setEnableForbidden(true);
        roleDTO.setModified(true);
        if (roleRepository.selectByCode(roleDTO.getCode()) != null) {
            throw new CommonException("error.role.code.exist");
        }
        RoleDTO role = roleRepository.insertSelective(roleDTO);
        role.setPermissions(roleDTO.getPermissions());
        role.setLabels(roleDTO.getLabels());
        //维护role_permission表
        insertRolePermission(role);
        //维护role_label表
        insertRoleLabel(role);
        return role;
    }

    private void insertRoleLabel(RoleDTO role) {
        List<LabelDTO> labels = role.getLabels();
        if (labels != null) {
            List<RoleLabelDTO> roleLabelDOList = labels.stream().map(l -> {
                Long labelId = l.getId();
                if (labelId == null) {
                    throw new CommonException("error.label.id.null");
                }
                if (labelRepository.selectByPrimaryKey(labelId) == null) {
                    throw new CommonException("error.label.not.exist", labelId);
                }
                RoleLabelDTO roleLabelDTO = new RoleLabelDTO();
                roleLabelDTO.setLabelId(l.getId());
                roleLabelDTO.setRoleId(role.getId());
                return roleLabelDTO;
            }).collect(Collectors.toList());
            roleLabelRepository.insertList(roleLabelDOList);
        }
    }


    /**
     * skip validate(role, t.getId());
     */
    private void insertRolePermission(RoleDTO role) {
        List<RolePermissionDTO> rolePermissionDOList = role.getPermissions().parallelStream().map(permission -> {
            RolePermissionDTO rolePermissionDTO = new RolePermissionDTO();
            rolePermissionDTO.setPermissionId(permission.getId());
            rolePermissionDTO.setRoleId(role.getId());
            return rolePermissionDTO;
        }).collect(Collectors.toList());

        rolePermissionRepository.insertList(rolePermissionDOList);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public RoleDTO update(RoleDTO roleDTO) {
        Long id = roleDTO.getId();
        RoleDTO role1 = roleRepository.selectByPrimaryKey(id);
        if (role1 == null) {
            throw new CommonException(ROLE_NOT_EXIST_EXCEPTION, id);
        }
        //内置的角色不允许更新字段，只能更新label
        if (role1.getBuiltIn()) {
            updateRoleLabel(roleDTO);
            return roleDTO;
        } else {
            RoleDTO role = roleRepository.updateSelective(roleDTO);
            role.setPermissions(roleDTO.getPermissions());
            role.setLabels(roleDTO.getLabels());
            //维护role_permission关系
            updateRolePermission(role);
            //维护role_label表
            updateRoleLabel(role);
            return role;
        }
    }

    private void updateRoleLabel(RoleDTO roleDTO) {
        RoleLabelDTO roleLabelDTO = new RoleLabelDTO();
        roleLabelDTO.setRoleId(roleDTO.getId());
        List<RoleLabelDTO> roleLabels = roleLabelRepository.select(roleLabelDTO);
        List<Long> existingLabelIds = roleLabels.stream()
                .map(RoleLabelDTO::getLabelId).collect(Collectors.toList());
        List<LabelDTO> labels = roleDTO.getLabels();
        final List<Long> newLabelIds = new ArrayList<>();
        if (!ObjectUtils.isEmpty(labels)) {
            newLabelIds.addAll(labels.stream().map(LabelDTO::getId).collect(Collectors.toList()));
        }
        //labelId交集
        List<Long> intersection = existingLabelIds.stream().filter(newLabelIds::contains).collect(Collectors.toList());
        //删除的labelId集合
        List<Long> deleteList = existingLabelIds.stream().filter(item ->
                !intersection.contains(item)).collect(Collectors.toList());
        //新增的labelId集合
        List<Long> insertList = newLabelIds.stream().filter(item ->
                !intersection.contains(item)).collect(Collectors.toList());
        List<UserMemberEventPayload> userMemberEventPayloads = new ArrayList<>();
        List<UserDTO> users = userRepository.listUsersByRoleId(roleDTO.getId(), "user", ResourceLevel.PROJECT.value());

        boolean sendSagaEvent = !ObjectUtils.isEmpty(users) && devopsMessage;
        doUpdateAndDelete(roleDTO, insertList, deleteList);
        if (sendSagaEvent) {
            users.forEach(user -> {
                List<LabelDTO> labelList = labelRepository.selectByUserId(user.getId());
                UserMemberEventPayload payload = new UserMemberEventPayload();
                payload.setResourceId(user.getSourceId());
                payload.setUserId(user.getId());
                payload.setResourceType(ResourceLevel.PROJECT.value());
                payload.setUsername(user.getLoginName());
                Set<String> nameSet = new HashSet<>(labelList.stream().map(LabelDTO::getName).collect(Collectors.toSet()));
                payload.setRoleLabels(nameSet);
                userMemberEventPayloads.add(payload);
            });
            try {
                String input = mapper.writeValueAsString(userMemberEventPayloads);
                String refIds = userMemberEventPayloads.stream().map(t -> String.valueOf(t.getUserId())).collect(Collectors.joining(","));
                sagaClient.startSaga(MEMBER_ROLE_UPDATE, new StartInstanceDTO(input, "users", refIds));
            } catch (Exception e) {
                throw new CommonException("error.IRoleServiceImpl.update.event", e);
            }
        }
    }

    private void doUpdateAndDelete(RoleDTO roleDTO, List<Long> insertList, List<Long> deleteList) {
        insertList.forEach(labelId -> {
            checkLabelId(labelId);
            RoleLabelDTO rl = new RoleLabelDTO();
            rl.setRoleId(roleDTO.getId());
            rl.setLabelId(labelId);
            roleLabelRepository.insert(rl);
        });
        deleteList.forEach(labelId -> {
            checkLabelId(labelId);
            RoleLabelDTO rl = new RoleLabelDTO();
            rl.setRoleId(roleDTO.getId());
            rl.setLabelId(labelId);
            roleLabelRepository.delete(rl);
        });
    }

    private void checkLabelId(Long labelId) {
        if (labelId == null) {
            throw new CommonException("error.labelId.empty");
        }
        if (labelRepository.selectByPrimaryKey(labelId) == null) {
            throw new CommonException("error.label.not.exist");
        }
    }

    private void updateRolePermission(RoleDTO role) {
        Long roleId = role.getId();
        List<PermissionDTO> permissions = role.getPermissions();
        RolePermissionDTO rolePermissionDTO = new RolePermissionDTO();
        rolePermissionDTO.setRoleId(roleId);
        List<RolePermissionDTO> existingRolePermissions = rolePermissionRepository.select(rolePermissionDTO);
        List<Long> existingPermissionId =
                existingRolePermissions.stream().map(RolePermissionDTO::getPermissionId).collect(Collectors.toList());
        List<Long> newPermissionId =
                permissions.stream().map(PermissionDTO::getId).collect(Collectors.toList());
        //permissionId交集
        List<Long> intersection = existingPermissionId.stream().filter(newPermissionId::contains).collect(Collectors.toList());
        //删除的permissionId集合
        List<Long> deleteList = existingPermissionId.stream().filter(item ->
                !intersection.contains(item)).collect(Collectors.toList());
        //新增的permissionId集合
        List<Long> insertList = newPermissionId.stream().filter(item ->
                !intersection.contains(item)).collect(Collectors.toList());
        insertList.forEach(permissionId -> {
            validate(role, permissionId);
            RolePermissionDTO rp = new RolePermissionDTO();
            rp.setRoleId(roleId);
            rp.setPermissionId(permissionId);
            rolePermissionRepository.insert(rp);
        });
        deleteList.forEach(permissionId -> {
            validate(role, permissionId);
            RolePermissionDTO rp = new RolePermissionDTO();
            rp.setRoleId(roleId);
            rp.setPermissionId(permissionId);
            rolePermissionRepository.delete(rp);
        });
    }

    private void validate(RoleDTO role, Long permissionId) {
        checkIdNotNull(permissionId);
        PermissionDTO permission = permissionRepository.selectByPrimaryKey(permissionId);
        if (permission == null) {
            throw new CommonException("error.permission.not.exist", permissionId);
        }
        if (!permission.getResourceLevel().equals(role.getResourceLevel())) {
            throw new CommonException("error.role.level.not.equals.to.permission.level");
        }
    }

    private void checkIdNotNull(Long permissionId) {
        if (permissionId == null) {
            throw new CommonException("error.permission.id.null");
        }
    }

    @Override
    public void deleteByPrimaryKey(Long id) {
        RoleDTO roleDTO = roleRepository.selectByPrimaryKey(id);
        if (roleDTO == null) {
            throw new CommonException(ROLE_NOT_EXIST_EXCEPTION);
        }
        if (!roleDTO.getBuiltIn()) {
            roleRepository.deleteByPrimaryKey(id);
        } else {
            throw new CommonException("error.role.not.allow.to.be.delete");
        }
        RolePermissionDTO rolePermission = new RolePermissionDTO();
        rolePermission.setRoleId(id);
        rolePermissionRepository.delete(rolePermission);
        RoleLabelDTO roleLabelDTO = new RoleLabelDTO();
        roleLabelDTO.setRoleId(id);
        roleLabelRepository.delete(roleLabelDTO);
    }

    @Override
    public RoleDTO updateRoleEnabled(Long id) {
        RoleDTO roleDTO = roleRepository.selectByPrimaryKey(id);
        if (roleDTO == null) {
            throw new CommonException(ROLE_NOT_EXIST_EXCEPTION);
        }
        roleDTO.setEnabled(true);
        return roleRepository.updateSelective(roleDTO);
    }

    @Override
    public RoleDTO updateRoleDisabled(Long id) {
        RoleDTO roleDTO = roleRepository.selectByPrimaryKey(id);
        if (roleDTO == null) {
            throw new CommonException(ROLE_NOT_EXIST_EXCEPTION);
        }
        roleDTO.setEnabled(false);
        return roleRepository.updateSelective(roleDTO);
    }
}
