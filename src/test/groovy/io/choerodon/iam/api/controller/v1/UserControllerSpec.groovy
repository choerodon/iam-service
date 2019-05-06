package io.choerodon.iam.api.controller.v1

import io.choerodon.core.domain.Page
import io.choerodon.core.exception.ExceptionResponse
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.CreateUserWithRolesDTO
import io.choerodon.iam.api.dto.UserPasswordDTO
import io.choerodon.iam.infra.dto.UserDTO
import io.choerodon.iam.infra.mapper.UserMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Import
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import org.springframework.web.multipart.MultipartFile
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
class UserControllerSpec extends Specification {
    private static final String BASE_PATH = "/v1/users"
    @Autowired
    private TestRestTemplate restTemplate
    @Autowired
    private UserMapper userMapper
    @Shared
    def needInit = true
    @Shared
    def needClean = false

    def setup() {

    }

    def cleanup() {

    }

    def "QuerySelf"() {
        when: "调用方法"
        //default用户
        def entity = restTemplate.getForEntity(BASE_PATH + "/self", UserDTO)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody() == null
    }

    def "QueryInfo"() {
        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/{id}/info", ExceptionResponse, 1L)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.user.id.not.equals")

//        when: "调用方法"
//        entity = restTemplate.getForEntity(BASE_PATH + "/{id}/info", ExceptionResponse, 0L)
//
//        then: "校验结果"
//        entity.statusCode.is2xxSuccessful()
    }

    def "UpdateInfo"() {
        given: "构造请求参数"
        def userDTO = userMapper.selectAll().get(0)
        def userId = userDTO.getId()

        when: "调用方法[异常-用户版本号为null]"
        userDTO.setObjectVersionNumber(null)
        def httpEntity = new HttpEntity<Object>(userDTO)
        def entity = restTemplate.exchange(BASE_PATH + "/{id}/info", HttpMethod.PUT, httpEntity, ExceptionResponse, userId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.user.objectVersionNumber.null")

        when: "调用方法"
        userDTO.setObjectVersionNumber(1)
        httpEntity = new HttpEntity<Object>(userDTO)
        entity = restTemplate.exchange(BASE_PATH + "/{id}/info", HttpMethod.PUT, httpEntity, UserDTO, userId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "UploadPhoto"() {
        when: "调用方法"
        MultipartFile file = null;
        def entity = restTemplate.postForEntity(BASE_PATH + "/{id}/upload_photo", null, ExceptionResponse, 0L)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.upload.multipartSize")
    }

    def "SavePhoto"() {
        when: "调用方法"
        MultipartFile file = null;
        def entity = restTemplate.postForEntity(BASE_PATH + "/{id}/save_photo", null, ExceptionResponse, 0L)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.upload.multipartSize")
    }

    def "QueryOrganizations"() {
        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/{id}/organizations", List, 0L)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() == 0
    }

    def "QueryProjects"() {
        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/{id}/projects", List, 0L)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() == 0
    }

    def "PagingQueryProjectsSelf"() {
        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/self/projects/paging_query", Page)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "PagingQueryOrganizationsSelf"() {
        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/self/organizations/paging_query", Page)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "QueryProjectsByOrganizationId"() {
        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/{id}/organizations/{organization_id}/projects", List, 0L, 1L)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "QueryOrganizationWithProjects"() {
        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/self/organizations_projects", List)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "Query"() {
        given: "构造请求参数"
        def userDTO = userMapper.selectAll().get(0)
        def userId = userDTO.getId()

        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "?login_name={login_name}", UserDTO, userDTO.getLoginName())

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getId().equals(userDTO.getId())
        entity.getBody().getRealName().equals(userDTO.getRealName())
        entity.getBody().getLoginName().equals(userDTO.getLoginName())
    }

    def "SelfUpdatePassword"() {
        given: "构造请求参数"
        def userDTO = userMapper.selectAll().get(0)
        def userId = userDTO.getId()
        def userPasswordDTO = new UserPasswordDTO()
        userPasswordDTO.setOriginalPassword("1111")
        userPasswordDTO.setPassword("111111")

        when: "调用方法[异常-原始密码错误]"
        def httpEntity = new HttpEntity<Object>(userPasswordDTO)
        def entity = restTemplate.exchange(BASE_PATH + "/{id}/password", HttpMethod.PUT, httpEntity, ExceptionResponse, userId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.user.id.not.equals")
    }

    def "Check"() {
        given: "构造请求参数"
        def userDTO = userMapper.selectAll().get(0)

        when: "调用方法[异常-校验属性为空]"
        def userDTO1 = new UserDTO()
        userDTO1.setLoginName(null)
        userDTO1.setEmail(null)
        def entity = restTemplate.postForEntity(BASE_PATH + "/check", userDTO1, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.user.validation.fields.empty")

        when: "调用方法[异常-用户存在,id不同，字段相同]"
        //id不能相同
        userDTO.setId(null)
        entity = restTemplate.postForEntity(BASE_PATH + "/check", userDTO, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.user.loginName.exist")

        when: "调用方法"
        userDTO1.setEmail("email")
        userDTO1.setLoginName("login")
        userDTO1.setId(1L)
        entity = restTemplate.postForEntity(BASE_PATH + "/check", userDTO1, Void)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "PagingQueryAdminUsers"() {
        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/admin", Page)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().totalPages == 1
        entity.getBody().totalElements == 1
    }

    def "DeleteDefaultUser"() {
        given: "构造请求参数"
        def userDTO = userMapper.selectAll().get(0)
        def userId = userDTO.getId()

        when: "调用方法[异常-用户不存在]"
        def httpEntity = new HttpEntity<Object>()
        def entity = restTemplate.exchange(BASE_PATH + "/admin/{id}", HttpMethod.DELETE, httpEntity, ExceptionResponse, 1000L)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.user.not.exist")

        when: "调用方法[异常-用户大小不对]"
        httpEntity = new HttpEntity<Object>()
        entity = restTemplate.exchange(BASE_PATH + "/admin/{id}", HttpMethod.DELETE, httpEntity, ExceptionResponse, userId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.user.admin.size")
    }

    def "AddDefaultUsers"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        long[] ids = new long[2]
        ids[0] = 1
        ids[1] = 2
        paramsMap.put("id", ids)

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/admin?id={id}", Void, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "ListUsersByIds"() {
        given: "构造请求参数"
        long[] ids = new long[1]
        ids[0] = 1

        when: "调用方法"
        //id数组
        def entity = restTemplate.postForEntity(BASE_PATH + "/ids", ids, List)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() == 1
    }

    def "PagingQueryOrganizationAndRolesById"() {
        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/{id}/organization_roles", Page, 1L)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() == 1
    }

    def "PagingQueryProjectAndRolesById"() {
        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/{id}/project_roles", Page, 1L)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "CreateUserAndAssignRoles"() {
        given: "构造请求参数"
        def userDO = new UserDTO()
        userDO.setLoginName("dengyouquan")
        userDO.setRealName("dengyouquan")
        userDO.setEmail("dengyouquan@qq.com")
        def userWithRoles = new CreateUserWithRolesDTO()
        userWithRoles.setSourceId(0)
        userWithRoles.setSourceType("site")
        userWithRoles.setMemberType("user")
        userWithRoles.setUser(userDO)

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/init_role", userWithRoles, UserDTO)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "GetUserIds"() {
        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/ids", Long[], 1L)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() == 1
    }
}
