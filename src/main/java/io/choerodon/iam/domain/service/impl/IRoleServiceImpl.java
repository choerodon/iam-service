package io.choerodon.iam.domain.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.choerodon.asgard.saga.dto.StartInstanceDTO;
import io.choerodon.asgard.saga.feign.SagaClient;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.payload.UserMemberEventPayload;
import io.choerodon.iam.domain.iam.entity.LabelE;
import io.choerodon.iam.domain.iam.entity.PermissionE;
import io.choerodon.iam.domain.iam.entity.RoleE;
import io.choerodon.iam.domain.iam.entity.RolePermissionE;
import io.choerodon.iam.domain.repository.*;
import io.choerodon.iam.domain.service.IRoleService;
import io.choerodon.iam.infra.dataobject.LabelDO;
import io.choerodon.iam.infra.dataobject.RoleDO;
import io.choerodon.iam.infra.dataobject.RoleLabelDO;
import io.choerodon.iam.infra.dataobject.UserDO;
import io.choerodon.mybatis.service.BaseServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Service;

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
public class IRoleServiceImpl extends BaseServiceImpl<RoleDO> implements IRoleService {

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

    @Override
    public RoleE create(RoleE roleE) {
        roleE.createInit();
        if (roleRepository.selectByCode(roleE.getCode()) != null) {
            throw new CommonException("error.role.code.exist");
        }
        RoleE role = roleRepository.insertSelective(roleE);
        role.copyPermissionsAndLabels(roleE);
        //维护role_permission表
        insertRolePermission(role);
        //维护role_label表
        insertRoleLabel(role);
        return role;
    }

    private void insertRoleLabel(RoleE role) {
        List<LabelE> labels = role.getLabels();
        if (labels != null) {
            labels.forEach(l -> {
                Long labelId = l.getId();
                if (labelId == null) {
                    throw new CommonException("error.label.id.null");
                }
                if (labelRepository.selectByPrimaryKey(labelId) == null) {
                    throw new CommonException("error.label.not.exist", labelId);
                }
                RoleLabelDO roleLabelDO = new RoleLabelDO();
                roleLabelDO.setLabelId(l.getId());
                roleLabelDO.setRoleId(role.getId());
                roleLabelRepository.insert(roleLabelDO);
            });
        }
    }


    /**
     * skip validate(role, t.getId());
     */
    private void insertRolePermission(RoleE role) {
        role.getPermissions().parallelStream()
                .forEach(t -> rolePermissionRepository.insert(new RolePermissionE(null, role.getId(), t.getId())));
    }

    @Override
    public RoleE update(RoleE roleE) {
        RoleE role1 = roleRepository.selectByPrimaryKey(roleE.getId());
        if (role1 == null) {
            throw new CommonException(ROLE_NOT_EXIST_EXCEPTION, roleE.getId());
        }
        //内置的角色不允许更新字段，只能更新label
        if (role1.getBuiltIn()) {
            updateRoleLabel(roleE);
            return roleE;
        } else {
            RoleE role = roleRepository.updateSelective(roleE);
            role.copyPermissionsAndLabels(roleE);
            //维护role_permission关系
            updateRolePermission(role);
            //维护role_label表
            updateRoleLabel(role);
            return role;
        }
    }

    private void updateRoleLabel(RoleE roleE) {
        RoleLabelDO roleLabelDO = new RoleLabelDO();
        roleLabelDO.setRoleId(roleE.getId());
        List<RoleLabelDO> roleLabels = roleLabelRepository.select(roleLabelDO);
        List<Long> existingLabelIds = roleLabels.stream()
                .map(RoleLabelDO::getLabelId).collect(Collectors.toList());
        List<LabelE> labels = roleE.getLabels();
        final List<Long> newLabelIds = new ArrayList<>();
        if (labels != null) {
            newLabelIds.addAll(labels.stream().map(LabelE::getId).collect(Collectors.toList()));
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
        List<UserDO> users = userRepository.listUsersByRoleId(roleE.getId(), "user", ResourceLevel.PROJECT.value());
        if (devopsMessage) {
            doUpdateAndDelete(roleE, insertList, deleteList);
            users.forEach(user -> {
                List<LabelDO> labels1 = labelRepository.selectByUserId(user.getId());
                UserMemberEventPayload payload = new UserMemberEventPayload();
                payload.setResourceId(user.getSourceId());
                payload.setResourceType(ResourceLevel.PROJECT.value());
                payload.setUsername(user.getLoginName());
                Set<String> nameSet = new HashSet<>(labels1.stream().map(LabelDO::getName).collect(Collectors.toSet()));
                payload.setRoleLabels(nameSet);
                userMemberEventPayloads.add(payload);
            });
            try {
                String input = mapper.writeValueAsString(userMemberEventPayloads);
                String refIds = userMemberEventPayloads.stream().map(t -> t.getUserId() + "").collect(Collectors.joining(","));
                sagaClient.startSaga(MEMBER_ROLE_UPDATE, new StartInstanceDTO(input, "members", refIds));
            } catch (Exception e) {
                throw new CommonException("error.IRoleServiceImpl.update.event", e);
            }
        } else {
            doUpdateAndDelete(roleE, insertList, deleteList);
        }
    }

    private void doUpdateAndDelete(RoleE roleE, List<Long> insertList, List<Long> deleteList) {
        insertList.forEach(labelId -> {
            checkLabelId(labelId);
            RoleLabelDO rl = new RoleLabelDO();
            rl.setRoleId(roleE.getId());
            rl.setLabelId(labelId);
            roleLabelRepository.insert(rl);
        });
        deleteList.forEach(labelId -> {
            checkLabelId(labelId);
            RoleLabelDO rl = new RoleLabelDO();
            rl.setRoleId(roleE.getId());
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

    private void updateRolePermission(RoleE role) {
        Long roleId = role.getId();
        List<PermissionE> permissions = role.getPermissions();
        RolePermissionE rolePermissionE = new RolePermissionE(null, role.getId(), null);
        List<RolePermissionE> existingRolePermissions = rolePermissionRepository.select(rolePermissionE);
        List<Long> existingPermissionId =
                existingRolePermissions.stream().map(RolePermissionE::getPermissionId).collect(Collectors.toList());
        List<Long> newPermissionId =
                permissions.stream().map(PermissionE::getId).collect(Collectors.toList());
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
            RolePermissionE rp = new RolePermissionE(null, roleId, permissionId);
            rolePermissionRepository.insert(rp);
        });
        deleteList.forEach(permissionId -> {
            validate(role, permissionId);
            RolePermissionE rp = new RolePermissionE(null, roleId, permissionId);
            rolePermissionRepository.delete(rp);
        });
    }

    private void validate(RoleE role, Long permissionId) {
        checkIdNotNull(permissionId);
        PermissionE permission = permissionRepository.selectByPrimaryKey(permissionId);
        checkPermission(permissionId, permission);
        checkLevel(permission, role.getLevel());
    }

    private void checkLevel(PermissionE permission, String roleLevel) {
        if (!permission.getLevel().equals(roleLevel)) {
            throw new CommonException("error.role.level.not.equals.to.permission.level");
        }
    }

    private void checkPermission(Long permissionId, PermissionE permission) {
        if (permission == null) {
            throw new CommonException("error.permission.not.exist", permissionId);
        }
    }

    private void checkIdNotNull(Long permissionId) {
        if (permissionId == null) {
            throw new CommonException("error.permission.id.null");
        }
    }

    @Override
    public void deleteByPrimaryKey(Long id) {
        RoleE roleE = roleRepository.selectByPrimaryKey(id);
        if (roleE == null) {
            throw new CommonException(ROLE_NOT_EXIST_EXCEPTION);
        }
        if (roleE.removable()) {
            roleRepository.deleteByPrimaryKey(id);
        } else {
            throw new CommonException("error.role.not.allow.to.be.delete");
        }
        RolePermissionE rolePermission = new RolePermissionE(null, id, null);
        rolePermissionRepository.delete(rolePermission);
        RoleLabelDO roleLabelDO = new RoleLabelDO();
        roleLabelDO.setRoleId(id);
        roleLabelRepository.delete(roleLabelDO);
    }

    @Override
    public RoleE updateRoleEnabled(Long id) {
        RoleE roleE = roleRepository.selectByPrimaryKey(id);
        if (roleE == null) {
            throw new CommonException(ROLE_NOT_EXIST_EXCEPTION);
        }
        roleE.enable();
        return roleRepository.updateSelective(roleE);
    }

    @Override
    public RoleE updateRoleDisabled(Long id) {
        RoleE roleE = roleRepository.selectByPrimaryKey(id);
        if (roleE == null) {
            throw new CommonException(ROLE_NOT_EXIST_EXCEPTION);
        }
        roleE.disable();
        return roleRepository.updateSelective(roleE);
    }
}
