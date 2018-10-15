package io.choerodon.iam.api.controller.v1

import io.choerodon.core.convertor.ConvertHelper
import io.choerodon.core.domain.Page
import io.choerodon.core.exception.ExceptionResponse
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.PermissionDTO
import io.choerodon.iam.api.dto.RoleDTO
import io.choerodon.iam.api.dto.RoleSearchDTO
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
class RoleControllerSpec extends Specification {
    private static final String BASE_PATH = "/v1/roles"
    @Autowired
    private TestRestTemplate restTemplate
    @Shared
    def roleId = 1L
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

    def "List"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        def roleSearchDTO = new RoleSearchDTO()

        when: "调用方法[全查询]"
        def entity = restTemplate.postForEntity(BASE_PATH + "/search", roleSearchDTO, Page, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().totalPages == 1
        entity.getBody().totalElements == 9

        when: "调用方法"
        paramsMap.put("source_id", 0)
        paramsMap.put("source_type", "site")
        paramsMap.put("need_users", true)
        roleSearchDTO.setLevel("site")
        entity = restTemplate.postForEntity(BASE_PATH + "/search", roleSearchDTO, Page, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().totalPages == 1
        entity.getBody().totalElements == 3
    }

    def "QueryIdsByLabelNameAndLabelType"() {
        given: "构造请求参数"
        def roleDTO = roleMapper.selectByPrimaryKey(roleId)
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("label_name", "organization.owner")
        paramsMap.put("label_type", "role")

        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/id?label_name={label_name}&label_type={label_type}", List, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() != 0
    }

    def "QueryWithPermissionsAndLabels"() {
        given: "构造请求参数"
        def roleDTO = roleMapper.selectByPrimaryKey(roleId)

        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/{id}", RoleDTO, roleId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getId().equals(roleDTO.getId())
        entity.getBody().getCode().equals(roleDTO.getCode())
        entity.getBody().getName().equals(roleDTO.getName())
        entity.getBody().getBuiltIn().equals(roleDTO.getBuiltIn())
        entity.getBody().getModified().equals(roleDTO.getModified())
        entity.getBody().getAssignable().equals(roleDTO.getAssignable())
        entity.getBody().getEnableForbidden().equals(roleDTO.getEnableForbidden())
        entity.getBody().getEnabled().equals(roleDTO.getEnabled())
        entity.getBody().getLevel().equals(roleDTO.getLevel())
    }

    def "Create"() {
        given: "构造请求参数"
        def roleDTO = new RoleDTO()
        roleDTO.setCode("role/site/default/tester")
        roleDTO.setName("测试管理员")
        roleDTO.setLevel("site")
        roleDTO.setBuiltIn(false)
        roleDTO.setModified(false)
        roleDTO.setEnabled(true)
        roleDTO.setAssignable(false)
        roleDTO.setEnableForbidden(true)

        when: "调用方法[异常-层级不合法]"
        roleDTO.setLevel("error")
        def entity = restTemplate.postForEntity(BASE_PATH, roleDTO, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.level.illegal")

        when: "调用方法[异常-没有权限]"
        roleDTO.setLevel("site")
        entity = restTemplate.postForEntity(BASE_PATH, roleDTO, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.role_permission.empty")

        when: "调用方法"
        def permissionDTOList = ConvertHelper.convertList(permissionDOList, PermissionDTO)
        roleDTO.setPermissions(permissionDTOList)
        entity = restTemplate.postForEntity(BASE_PATH, roleDTO, RoleDTO)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals(roleDTO.getCode())
        entity.getBody().getName().equals(roleDTO.getName())
        entity.getBody().getBuiltIn().equals(roleDTO.getBuiltIn())
        entity.getBody().getEnableForbidden().equals(roleDTO.getEnableForbidden())
        entity.getBody().getEnabled().equals(roleDTO.getEnabled())
        entity.getBody().getLevel().equals(roleDTO.getLevel())
        roleMapper.deleteByPrimaryKey(entity.getBody().getId())
    }

    def "CreateBaseOnRoles"() {
        given: "构造请求参数"
        def roleDTO = new RoleDTO()
        roleDTO.setCode("role/site/default/tester1")
        roleDTO.setName("测试管理员")
        roleDTO.setLevel("site")
        roleDTO.setBuiltIn(false)
        roleDTO.setModified(false)
        roleDTO.setEnabled(true)
        roleDTO.setAssignable(false)
        roleDTO.setEnableForbidden(true)
        roleDTO.setRoleIds(new ArrayList<Long>())
        def permissionDTOList = ConvertHelper.convertList(permissionDOList, PermissionDTO)
        roleDTO.setPermissions(permissionDTOList)

        when: "调用方法[角色id为空]"
        def entity = restTemplate.postForEntity(BASE_PATH + "/base_on_roles", roleDTO, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.roleIds.null")

        when: "调用方法[异常-角色层级不相同]"
        def roleIds = new ArrayList<Long>()
        roleIds.add(1L)
        roleIds.add(2L)
        roleIds.add(3L)
        roleDTO.setRoleIds(roleIds)
        entity = restTemplate.postForEntity(BASE_PATH + "/base_on_roles", roleDTO, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.roles.in.same.level")

        when: "调用方法"
        roleIds = new ArrayList<Long>()
        roleIds.add(1L)
        roleDTO.setRoleIds(roleIds)
        entity = restTemplate.postForEntity(BASE_PATH + "/base_on_roles", roleDTO, RoleDTO)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals(roleDTO.getCode())
        entity.getBody().getName().equals(roleDTO.getName())
        entity.getBody().getBuiltIn().equals(roleDTO.getBuiltIn())
        entity.getBody().getEnableForbidden().equals(roleDTO.getEnableForbidden())
        entity.getBody().getEnabled().equals(roleDTO.getEnabled())
        entity.getBody().getLevel().equals(roleDTO.getLevel())
        roleMapper.deleteByPrimaryKey(entity.getBody().getId())
    }

    def "Update"() {
        given: "构造请求参数"
        def roleDTO = ConvertHelper.convert(roleDO, RoleDTO)
        roleDTO.setDescription("update")
        roleDTO.setObjectVersionNumber(1)
        def httpEntity = new HttpEntity<Object>(roleDTO)

        when: "调用方法"
        def entity = restTemplate.exchange(BASE_PATH + "/{id}", HttpMethod.PUT, httpEntity, RoleDTO, roleDTO.getId())

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals(roleDTO.getCode())
        entity.getBody().getName().equals(roleDTO.getName())
        entity.getBody().getLevel().equals(roleDTO.getLevel())
    }

    def "EnableRole"() {
        given: "构造请求参数"
        def httpEntity = new HttpEntity<Object>()
        def roleDTO = ConvertHelper.convert(roleDO, RoleDTO)

        when: "调用方法[角色id为空]"
        def entity = restTemplate.exchange(BASE_PATH + "/{id}/enable", HttpMethod.PUT, httpEntity, ExceptionResponse, 1000L)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.role.not.exist")

        when: "调用方法"
        entity = restTemplate.exchange(BASE_PATH + "/{id}/enable", HttpMethod.PUT, httpEntity, RoleDTO, roleDTO.getId())

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getEnabled()
    }


    def "DisableRole"() {
        given: "构造请求参数"
        def roleDTO = ConvertHelper.convert(roleDO, RoleDTO)
        def httpEntity = new HttpEntity<Object>()

        when: "调用方法[角色id为空]"
        def entity = restTemplate.exchange(BASE_PATH + "/{id}/disable", HttpMethod.PUT, httpEntity, ExceptionResponse, 1000L)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.role.not.exist")

        when: "调用方法"
        entity = restTemplate.exchange(BASE_PATH + "/{id}/disable", HttpMethod.PUT, httpEntity, RoleDTO, roleDTO.getId())

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        !entity.getBody().getEnabled()
    }

    def "Check"() {
        given: "构造请求参数"
        def roleDTO = new RoleDTO()
        roleDTO.setCode("")
        roleDTO.setName("测试管理员")
        roleDTO.setLevel("site")

        when: "调用方法[角色code为空]"
        def entity = restTemplate.postForEntity(BASE_PATH + "/check", roleDTO, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.role.code.empty")

        when: "调用方法[角色code存在]"
        roleDTO.setCode("role/site/default/administrator")
        entity = restTemplate.postForEntity(BASE_PATH + "/check", roleDTO, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.role.code.exist")

        when: "调用方法"
        roleDTO.setCode("role/site/default/checker")
        entity = restTemplate.postForEntity(BASE_PATH + "/check", roleDTO, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "ListPermissionById"() {
        when: "调用方法[角色code为空]"
        def entity = restTemplate.getForEntity(BASE_PATH + "/{id}/permissions", Page, roleDO.getId())
        needClean = true

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() == 3
    }
}
