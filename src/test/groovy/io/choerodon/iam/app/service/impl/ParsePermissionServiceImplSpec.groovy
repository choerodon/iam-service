package io.choerodon.iam.app.service.impl

import io.choerodon.eureka.event.EurekaEventPayload
import io.choerodon.iam.infra.dto.PermissionDTO
import io.choerodon.iam.infra.dto.RoleDTO
import io.choerodon.iam.infra.mapper.PermissionMapper
import io.choerodon.iam.infra.mapper.RoleMapper
import io.choerodon.iam.infra.mapper.RolePermissionMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestTemplate
import spock.lang.Specification

/**
 * @author dengyouquan
 * */
class ParsePermissionServiceImplSpec extends Specification {

    @Autowired
    PermissionMapper permissionMapper

    @Autowired
    RolePermissionMapper rolePermissionMapper

    @Autowired
    RoleMapper roleMapper
    
    private ParsePermissionServiceImpl parsePermissionService =
            new ParsePermissionServiceImpl(permissionMapper, rolePermissionMapper, roleMapper)

    @Transactional
    def "Parser"() {
        given: "构造请求参数"
        PermissionDTO permissionE = new PermissionDTO()
        permissionE.setCode("code")
        permissionE.setPath("path")
        permissionE.setMethod("method")
        permissionE.setResourceLevel("site")
        permissionE.setDescription("description")
        permissionE.setAction("action")
        permissionE.setController("resource")
        permissionE.setPublicAccess(true)
        permissionE.setLoginAccess(true)
        permissionE.setWithin(true)
        permissionE.setServiceCode("serviceName")
        
        
        def file = new File(this.class.getResource('/templates/swagger.json').toURI())
        String swaggerJson = file.getText("UTF-8")
        EurekaEventPayload instanceE = new EurekaEventPayload()
        instanceE.setAppName("iam-service")
        instanceE.setInstanceAddress("172.31.176.1")
        instanceE.setStatus("UP")
        instanceE.setVersion("1.0")
        instanceE.setApiData(swaggerJson)
        List<RoleDTO> roleList = new ArrayList<>()
        RoleDTO roleDO = new RoleDTO()
        roleDO.setResourceLevel("project")
        roleDO.setCode("role/project/default/administrator")
        roleList.add(roleDO)

        and: 'mock restTemplate'
        def restTemplate = Mock(RestTemplate) {
            getForEntity(_,_) >> new ResponseEntity<String>('', HttpStatus.OK)
        }
        parsePermissionService.setRestTemplate(restTemplate)

        when: "调用方法"
        parsePermissionService.parser(instanceE)

        then: "校验结果"
        true
    }
}
