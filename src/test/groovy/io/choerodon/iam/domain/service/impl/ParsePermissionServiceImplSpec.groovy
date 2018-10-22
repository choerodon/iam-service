package io.choerodon.iam.domain.service.impl

import com.fasterxml.jackson.databind.ObjectMapper
import io.choerodon.iam.domain.iam.entity.InstanceE
import io.choerodon.iam.domain.iam.entity.PermissionE
import io.choerodon.iam.domain.repository.PermissionRepository
import io.choerodon.iam.domain.repository.RolePermissionRepository
import io.choerodon.iam.domain.repository.RoleRepository
import io.choerodon.iam.domain.service.ParsePermissionService
import io.choerodon.iam.infra.dataobject.RoleDO
import spock.lang.Specification

/**
 * @author dengyouquan
 * */
class ParsePermissionServiceImplSpec extends Specification {
    private final ObjectMapper mapper = new ObjectMapper()
    private PermissionRepository permissionRepository = Mock(PermissionRepository)
    private RolePermissionRepository rolePermissionRepository = Mock(RolePermissionRepository)
    private RoleRepository roleRepository = Mock(RoleRepository)
    private ParsePermissionService parsePermissionService =
            new ParsePermissionServiceImpl(permissionRepository, rolePermissionRepository, roleRepository)

    def "Parser"() {
        given: "构造请求参数"
        PermissionE permissionE = new PermissionE("code", "path", "method", "site", "description", "action", "resource", true, true, true, "serviceName", 1L)
        def file = new File(this.class.getResource('/templates/swagger.json').toURI())
        String swaggerJson = file.getText("UTF-8")
        InstanceE instanceE = new InstanceE()
        instanceE.setAppName("iam-service")
        instanceE.setInstanceAddress("172.31.176.1")
        instanceE.setStatus("UP")
        instanceE.setVersion("1.0")
        instanceE.setApiData(swaggerJson)
        String message = mapper.writeValueAsString(instanceE)
        List<RoleDO> roleList = new ArrayList<>()
        RoleDO roleDO = new RoleDO()
        roleDO.setLevel("project")
        roleDO.setCode("role/project/default/administrator")
        roleList.add(roleDO)

        when: "调用方法"
        parsePermissionService.parser(message)

        then: "校验结果"
        roleRepository.selectByCode(_) >> { roleDO }
        permissionRepository.selectByCode(_) >> permissionE
        permissionRepository.insertSelective(_) >> permissionE
        roleRepository.selectInitRolesByPermissionId(_) >> roleList
    }
}
