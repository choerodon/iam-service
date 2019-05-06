package io.choerodon.iam.domain.service.impl

import io.choerodon.asgard.saga.dto.StartInstanceDTO
import io.choerodon.asgard.saga.feign.SagaClient
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.domain.repository.*
import io.choerodon.iam.domain.service.IRoleService
import io.choerodon.iam.infra.dto.LabelDTO
import io.choerodon.iam.infra.dto.PermissionDTO
import io.choerodon.iam.infra.dto.RoleDTO
import io.choerodon.iam.infra.dto.RoleLabelDTO
import io.choerodon.iam.infra.dto.RolePermissionDTO
import io.choerodon.iam.infra.dto.UserDTO
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import java.lang.reflect.Field

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT
/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class IRoleServiceImplSpec extends Specification {
    private RoleRepository roleRepository = Mock(RoleRepository)
    private RolePermissionRepository rolePermissionRepository = Mock(RolePermissionRepository)
    private PermissionRepository permissionRepository = Mock(PermissionRepository)
    private LabelRepository labelRepository = Mock(LabelRepository)
    private RoleLabelRepository roleLabelRepository = Mock(RoleLabelRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private SagaClient sagaClient = Mock(SagaClient)
    private IRoleService iRoleService
    private int count = 3
    RoleDTO role = new RoleDTO()

    def setup() {
        role.setId(1L)
        role.setName("name")
        role.setCode("code")
        role.setDescription("description")
        role.setResourceLevel("site")
        role.setEnabled(true)
        role.setModified(false)
        role.setBuiltIn(false)
        role.setEnableForbidden(false)
        
        
        iRoleService = new IRoleServiceImpl(roleRepository, rolePermissionRepository,
                permissionRepository, labelRepository, roleLabelRepository,
                userRepository, sagaClient)

        Field field = iRoleService.getClass().getDeclaredField("devopsMessage")
        field.setAccessible(true)
        field.set(iRoleService, true)
    }

    def "Create"() {
        given: "构造请求参数"
        List<PermissionDTO> permissions = new ArrayList<>()
        PermissionDTO permission = new PermissionDTO()
        permission.setCode("code")
        permission.setPath("path")
        permission.setMethod("method")
        permission.setResourceLevel("site")
        permission.setDescription("description")
        permission.setAction("action")
        permission.setController("resource")
        permission.setPublicAccess(true)
        permission.setLoginAccess(true)
        permission.setWithin(true)
        permission.setServiceCode("serviceName")
        permission.setId(1L)
        permissions.add(permission)
        role.setPermissions(permissions)
        List<LabelDTO> labels = new ArrayList<>()
        LabelDTO label = new LabelDTO()
        label.setId(1L)
        label.setLevel("site")
        label.setName("name")
        label.setDescription("description")
        label.setType("type")
        labels << label
        role.setLabels(labels)
//
//        and: "测LabelConverter"
//        LabelDTO labelDTO = ConvertHelper.convert(label, LabelDO)
//        ConvertHelper.convert(labelDTO,LabelDTO)
//        ConvertHelper.convert(labelDTO,LabelE)
//        LabelDTO labelDTO = ConvertHelper.convert(label, LabelDTO)
//        ConvertHelper.convert(labelDTO,LabelDO)
//        ConvertHelper.convert(labelDTO,LabelE)

        when: "调用方法"
        iRoleService.create(role)

        then: "校验结果"
        1 * roleRepository.selectByCode(_)
        1 * roleRepository.insertSelective(_) >> { role }
        1 * rolePermissionRepository.insertList(_)
        1 * labelRepository.selectByPrimaryKey(_) >> { new LabelDTO() }
        1 * roleLabelRepository.insertList(_)
        0 * _
    }

    def "Update"() {
        given: "构造请求参数"
        List<PermissionDTO> permissions = new ArrayList<>()
//        PermissionDTO permissionE = new PermissionE("code", "path", "method", "site", "description", "action", "resource", true, true, true, "serviceName", 1L)
        PermissionDTO permission = new PermissionDTO()
        permission.setCode("code")
        permission.setPath("path")
        permission.setMethod("method")
        permission.setResourceLevel("site")
        permission.setDescription("description")
        permission.setAction("action")
        permission.setController("resource")
        permission.setPublicAccess(true)
        permission.setLoginAccess(true)
        permission.setWithin(true)
        permission.setServiceCode("serviceName")

        permission.setId(1L)
        permissions.add(permission)
        role.setPermissions(permissions)
        List<RolePermissionDTO> existingRolePermissions = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            RolePermissionDTO rolePermission = new RolePermissionDTO()
            rolePermission.setId(i)
            rolePermission.setPermissionId(i)
            rolePermission.setRoleId(i)
            existingRolePermissions << rolePermission
        }
        List<LabelDTO> labels = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            LabelDTO labelDTO = new LabelDTO()
            labelDTO.setId(i)
            labels << labelDTO
        }
        role.setLabels(labels)
        List<RoleLabelDTO> roleLabels = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            RoleLabelDTO roleLabelDTO = new RoleLabelDTO()
            roleLabelDTO.setId(i + 1)
            roleLabelDTO.setRoleId(i + 1)
            roleLabelDTO.setLabelId(i + 1)
            roleLabels << roleLabelDTO
        }
        List<UserDTO> users = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            UserDTO user = new UserDTO()
            user.setId(i + i)
            users << user
        }

        when: "调用方法"
        iRoleService.update(role)

        then: "校验结果"
        1 * roleRepository.selectByPrimaryKey(_) >> { role }
        1 * roleRepository.updateSelective(_) >> { role }
        1 * roleLabelRepository.select(_) >> { roleLabels }
        1 * rolePermissionRepository.select(_) >> { existingRolePermissions }
        2 * permissionRepository.selectByPrimaryKey(_) >> { permissionE }
        1 * userRepository.listUsersByRoleId(_, _, _) >> { users }
        labelRepository.selectByUserId(_) >> { new ArrayList<LabelDTO>() }
        labelRepository.selectByPrimaryKey(_) >> { new LabelDTO() }
        1 * sagaClient.startSaga(_, _ as StartInstanceDTO)
    }

    def "DeleteByPrimaryKey"() {
        given: "构造请求参数"
        def id = 1L

        when: "调用方法"
        iRoleService.deleteByPrimaryKey(id)

        then: "校验结果"
        1 * roleRepository.selectByPrimaryKey(_) >> { role }
        1 * roleRepository.deleteByPrimaryKey(_)
        1 * rolePermissionRepository.delete(_)
        1 * roleLabelRepository.delete(_)
        0 * _
    }
}
