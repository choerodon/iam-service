package io.choerodon.iam.api.controller.v1

import io.choerodon.core.domain.Page
import io.choerodon.core.exception.ExceptionResponse
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.CheckPermissionDTO
import io.choerodon.iam.infra.dataobject.PermissionDO
import io.choerodon.iam.infra.dataobject.RoleDO
import io.choerodon.iam.infra.dataobject.RolePermissionDO
import io.choerodon.iam.infra.mapper.PermissionMapper
import io.choerodon.iam.infra.mapper.RoleMapper
import io.choerodon.iam.infra.mapper.RolePermissionMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Import
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Stepwise

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
@Stepwise
class PermissionControllerSpec extends Specification {
    private static final String BASE_PATH = "/v1/permissions"
    @Autowired
    private TestRestTemplate restTemplate
    @Autowired
    private PermissionMapper permissionMapper
    @Autowired
    private RoleMapper roleMapper
    @Autowired
    RolePermissionMapper rolePermissionMapper
    @Shared
    def needInit = true
    @Shared
    def needClean = false
    @Shared
    def permissionDOList = new ArrayList<PermissionDO>()
    @Shared
    def rolePermissionDOList = new ArrayList<RolePermissionDO>()
    @Shared
    def roleDO = new RoleDO()

    def setup() {
        if (needInit) {
            given: "构造参数"
            needInit = false
            for (int i = 0; i < 3; i++) {
                PermissionDO permissionDO = new PermissionDO()
                permissionDO.setCode("iam-service.permission.get" + i)
                permissionDO.setPath("/v1/permission/" + i)
                permissionDO.setMethod("get")
                permissionDO.setLevel("site")
                permissionDO.setDescription("Description" + i)
                permissionDO.setAction("get")
                permissionDO.setResource("service" + i)
                permissionDO.setLoginAccess(false)
                permissionDO.setPublicAccess(false)
                permissionDO.setServiceName("iam-service")
                permissionDOList.add(permissionDO)
            }
            roleDO.setCode("role/site/default/permissioner")
            roleDO.setName("权限管理员")
            roleDO.setLevel("site")

            when: "插入记录"
            int count = permissionMapper.insertList(permissionDOList)
            roleDO.setPermissions(permissionDOList)
            count += roleMapper.insert(roleDO)
            for (int i = 0; i < 3; i++) {
                RolePermissionDO rolePermissionDO = new RolePermissionDO()
                rolePermissionDO.setPermissionId(permissionDOList.get(i).getId())
                rolePermissionDO.setRoleId(roleDO.getId())
                rolePermissionDOList.add(rolePermissionDO)
            }
            count += rolePermissionMapper.insertList(rolePermissionDOList)

            then: "校验结果"
            count == 7
        }
    }

    def cleanup() {
        if (needClean) {
            given: ""
            def count = 0
            needClean = false

            when: "删除记录"
            for (PermissionDO permissionDO : permissionDOList) {
                count += permissionMapper.deleteByPrimaryKey(permissionDO)
            }
            for (RolePermissionDO rolePermissionDO : rolePermissionDOList) {
                count += rolePermissionMapper.deleteByPrimaryKey(rolePermissionDO)
            }
            count += roleMapper.deleteByPrimaryKey(roleDO)

            then: "校验结果"
            count == 7
        }
    }

    def "CheckPermission"() {
        given: "构造请求参数"
        def checkPermissions = new ArrayList<CheckPermissionDTO>()
        def checkPermissionDTO = new CheckPermissionDTO()
        checkPermissions << checkPermissionDTO

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/checkPermission", checkPermissions, List)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        !entity.getBody().isEmpty()
    }

    def "PagingQuery"() {
        given: "构造请求参数"
        def level = "error"

        when: "调用方法[异常-level不合法]"
        def entity = restTemplate.getForEntity(BASE_PATH + "?level={level}", ExceptionResponse, level)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.level.illegal")

        when: "调用方法"
        level = "site"
        entity = restTemplate.getForEntity(BASE_PATH + "?level={level}", Page, level)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "QueryByRoleIds"() {
        given: "构造请求参数"
        List<Long> roleIds = new ArrayList<>()
        roleIds.add(roleDO.getId())

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH, roleIds, Set)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() == 3
    }

    def "Query"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()

        when: "调用方法"
        paramsMap.put("level", "site")
        paramsMap.put("service_name", "iam-service")
        def entity = restTemplate.getForEntity(BASE_PATH + "/permissionList?level={level}&service_name={service_name}", List, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() == 3
    }

    def "DeleteByCode"() {
        given: "构造请求参数"
        def httpEntity = new HttpEntity<Object>()
        def code = permissionDOList.get(0).getCode()

        when: "调用方法"
        def entity = restTemplate.exchange(BASE_PATH + "?code={code}", HttpMethod.DELETE, httpEntity, ExceptionResponse, code)
        needClean = true

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.permission.delete.fetch.swaggerJson")
    }
}
