package io.choerodon.iam.domain.service.impl

import io.choerodon.asgard.saga.dto.StartInstanceDTO
import io.choerodon.asgard.saga.feign.SagaClient
import io.choerodon.core.convertor.ConvertHelper
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.LabelDTO
import io.choerodon.iam.domain.iam.entity.LabelE
import io.choerodon.iam.domain.iam.entity.PermissionE
import io.choerodon.iam.domain.iam.entity.RoleE
import io.choerodon.iam.domain.iam.entity.RolePermissionE
import io.choerodon.iam.domain.repository.*
import io.choerodon.iam.domain.service.IRoleService
import io.choerodon.iam.infra.dataobject.LabelDO
import io.choerodon.iam.infra.dataobject.RoleLabelDO
import io.choerodon.iam.infra.dataobject.UserDO
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
    RoleE roleE = new RoleE(1L, "name", "code", "description",
            "site", true, false, false,
            false, false, 1L)

    def setup() {
        iRoleService = new IRoleServiceImpl(roleRepository, rolePermissionRepository,
                permissionRepository, labelRepository, roleLabelRepository,
                userRepository, sagaClient)

        Field field = iRoleService.getClass().getDeclaredField("devopsMessage")
        field.setAccessible(true)
        field.set(iRoleService, true)
    }

    def "Create"() {
        given: "构造请求参数"
        List<PermissionE> permissions = new ArrayList<>()
        PermissionE permissionE = new PermissionE("code", "path", "method", "site", "description", "action", "resource", true, true, true, "serviceName", 1L)
        permissionE.setId(1L)
        permissions.add(permissionE)
        roleE.setPermissions(permissions)
        List<LabelE> labelEList = new ArrayList<>()
        LabelE labelE = new LabelE()
        labelE.setId(1L)
        labelE.setLevel("site")
        labelE.setName("name")
        labelE.setDescription("description")
        labelE.setType("type")
        labelEList << labelE
        roleE.setLabels(labelEList)

        and: "测LabelConverter"
        LabelDO labelDO = ConvertHelper.convert(labelE, LabelDO)
        ConvertHelper.convert(labelDO,LabelDTO)
        ConvertHelper.convert(labelDO,LabelE)
        LabelDTO labelDTO = ConvertHelper.convert(labelE, LabelDTO)
        ConvertHelper.convert(labelDTO,LabelDO)
        ConvertHelper.convert(labelDTO,LabelE)

        when: "调用方法"
        iRoleService.create(roleE)

        then: "校验结果"
        1 * roleRepository.selectByCode(_)
        1 * roleRepository.insertSelective(_) >> { roleE }
        1 * rolePermissionRepository.insertList(_)
        1 * labelRepository.selectByPrimaryKey(_) >> { new LabelDO() }
        1 * roleLabelRepository.insertList(_)
        0 * _
    }

    def "Update"() {
        given: "构造请求参数"
        List<PermissionE> permissions = new ArrayList<>()
        PermissionE permissionE = new PermissionE("code", "path", "method", "site", "description", "action", "resource", true, true, true, "serviceName", 1L)
        permissionE.setId(1L)
        permissions.add(permissionE)
        roleE.setPermissions(permissions)
        List<RolePermissionE> existingRolePermissions = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            RolePermissionE rolePermissionE = new RolePermissionE(i, i, i)
            existingRolePermissions << rolePermissionE
        }
        List<LabelE> labelEList = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            LabelE labelE = new LabelE()
            labelE.setId(i)
            labelEList << labelE
        }
        roleE.setLabels(labelEList)
        List<RoleLabelDO> roleLabels = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            RoleLabelDO roleLabelDO = new RoleLabelDO()
            roleLabelDO.setId(i + 1)
            roleLabelDO.setRoleId(i + 1)
            roleLabelDO.setLabelId(i + 1)
            roleLabels << roleLabelDO
        }
        List<UserDO> users = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            UserDO userDO = new UserDO()
            userDO.setId(i + i)
            users << userDO
        }

        when: "调用方法"
        iRoleService.update(roleE)

        then: "校验结果"
        1 * roleRepository.selectByPrimaryKey(_) >> { roleE }
        1 * roleRepository.updateSelective(_) >> { roleE }
        1 * roleLabelRepository.select(_) >> { roleLabels }
        1 * rolePermissionRepository.select(_) >> { existingRolePermissions }
        2 * permissionRepository.selectByPrimaryKey(_) >> { permissionE }
        1 * userRepository.listUsersByRoleId(_, _, _) >> { users }
        labelRepository.selectByUserId(_) >> { new ArrayList<LabelDO>() }
        labelRepository.selectByPrimaryKey(_) >> { new LabelDO() }
        1 * sagaClient.startSaga(_, _ as StartInstanceDTO)
    }

    def "DeleteByPrimaryKey"() {
        given: "构造请求参数"
        def id = 1L

        when: "调用方法"
        iRoleService.deleteByPrimaryKey(id)

        then: "校验结果"
        1 * roleRepository.selectByPrimaryKey(_) >> { roleE }
        1 * roleRepository.deleteByPrimaryKey(_)
        1 * rolePermissionRepository.delete(_)
        1 * roleLabelRepository.delete(_)
        0 * _
    }
}
