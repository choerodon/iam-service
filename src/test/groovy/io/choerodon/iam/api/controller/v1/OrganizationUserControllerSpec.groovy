package io.choerodon.iam.api.controller.v1

import io.choerodon.core.domain.Page
import io.choerodon.core.exception.ExceptionResponse
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.UploadHistoryDTO
import io.choerodon.iam.api.dto.test.UserDTO
import io.choerodon.iam.api.dto.UserSearchDTO
import io.choerodon.iam.infra.dataobject.UserDO
import io.choerodon.iam.infra.mapper.UserMapper
import org.springframework.beans.BeanUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Import
import org.springframework.core.io.Resource
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
class OrganizationUserControllerSpec extends Specification {
    private static final String BASE_PATH = "/v1/organizations/{organization_id}"
    private final int organizationId = 1L
    private final int notExistOrganizationId = 1000L
    @Autowired
    private TestRestTemplate restTemplate
    @Autowired
    private UserMapper userMapper

    @Shared
    def needInit = true
    @Shared
    def needClean = false
    @Shared
    def userDOList = new ArrayList<UserDO>()

    def setup() {
        if (needInit) {
            given: "构造参数"
            needInit = false
            for (int i = 0; i < 3; i++) {
                def userDO = new UserDO()
                userDO.setLoginName("dengyouquan" + i)
                userDO.setRealName("邓有全" + i)
                userDO.setEmail("youquan.deng" + i + "@hand-china.com")
                userDO.setOrganizationId(1)
                userDO.setEnabled(true)
                userDO.setAdmin(true)
                if (i == 0) {
                    userDO.setLocked(true)
                    userDO.setEnabled(false)
                }
                userDOList.add(userDO)
            }

            when: "插入数据"
            int count = userMapper.insertList(userDOList)

            then: "校验结果"
            count == 3
        }
    }

    def cleanup() {
        if (needClean) {
            given: "定义变量"
            needClean = false
            def count = 0

            when: "删除数据"
            for (UserDO userDO : userDOList) {
                count += userMapper.deleteByPrimaryKey(userDO)
            }

            then: "校验结果"
            count == 3
        }
    }

    def "Create"() {
        given: "构造请求参数"
        def userDTO = new UserDTO()
        userDTO.setLoginName("dengyouquan")
        userDTO.setRealName("邓有全")
        userDTO.setEmail("youquan.deng@hand-china.com")
        userDTO.setOrganizationId(1)
        userDTO.setEnabled(true)
        userDTO.setAdmin(true)

        when: "调用方法[异常-密码为空]"
        def entity = restTemplate.postForEntity(BASE_PATH + "/users", userDTO, ExceptionResponse, organizationId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.user.password.empty")

        when: "调用方法[异常-组织不存在]"
        def userDTO1 = new UserDTO()
        BeanUtils.copyProperties(userDTO, userDTO1)
        userDTO1.setPassword("123456")
        entity = restTemplate.postForEntity(BASE_PATH + "/users", userDTO1, ExceptionResponse, notExistOrganizationId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.not.exist")

        when: "调用方法"
        userDTO.setPassword("123456")
        entity = restTemplate.postForEntity(BASE_PATH + "/users", userDTO, UserDTO, organizationId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getEnabled().equals(userDTO.getEnabled())
        entity.getBody().getEmail().equals(userDTO.getEmail())
        entity.getBody().getAdmin().equals(userDTO.getAdmin())
        entity.getBody().getLoginName().equals(userDTO.getLoginName())
        entity.getBody().getRealName().equals(userDTO.getRealName())
        entity.getBody().getOrganizationId().equals(userDTO.getOrganizationId())
        userMapper.deleteByPrimaryKey(entity.getBody().getId())
    }

    def "Update"() {
        given: "构造请求参数"
        def userId = userDOList.get(2).getId()
        def userDTO = new UserDTO()
        userDTO.setLoginName("dengyouquan-update")
        userDTO.setRealName("邓有全update")
        userDTO.setEmail("youquan.deng-update@hand-china.com")
        userDTO.setOrganizationId(1)
        userDTO.setEnabled(true)
        userDTO.setAdmin(true)

        when: "调用方法[异常-组织不存在]"
        def httpEntity = new HttpEntity<Object>(userDTO)
        def entity = restTemplate.exchange(BASE_PATH + "/users/{id}", HttpMethod.PUT, httpEntity, ExceptionResponse, notExistOrganizationId, userId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.not.exist")

        when: "调用方法"
        userDTO.setOrganizationId(organizationId)
        userDTO.setObjectVersionNumber(1)
        httpEntity = new HttpEntity<Object>(userDTO)
        entity = restTemplate.exchange(BASE_PATH + "/users/{id}", HttpMethod.PUT, httpEntity, UserDTO, organizationId, userId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getEnabled().equals(userDTO.getEnabled())
        entity.getBody().getEmail().equals(userDTO.getEmail())
        entity.getBody().getAdmin().equals(userDTO.getAdmin())
        entity.getBody().getLoginName().equals(userDTO.getLoginName())
        entity.getBody().getRealName().equals(userDTO.getRealName())
        entity.getBody().getOrganizationId().equals(userDTO.getOrganizationId())
    }

    def "List"() {
        given: "构造请求参数"
        def userSearchDTO = new UserSearchDTO()
        userSearchDTO.setLoginName("admin")
        userSearchDTO.setRealName("管理员")

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/users/search", userSearchDTO, Page, organizationId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().totalPages == 1
        entity.getBody().totalElements == 1
    }

    def "Query"() {
        given: "构造请求参数"
        def userDO = userDOList.get(0)
        def userId = userDO.getId()

        when: "调用方法[异常-组织不存在]"
        def entity = restTemplate.getForEntity(BASE_PATH + "/users/{id}", ExceptionResponse, notExistOrganizationId, userId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.not.exist")

        when: "调用方法"
        entity = restTemplate.getForEntity(BASE_PATH + "/users/{id}", UserDTO, organizationId, userId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getEmail().equals(userDO.getEmail())
        entity.getBody().getAdmin().equals(userDO.getAdmin())
        entity.getBody().getLoginName().equals(userDO.getLoginName())
        entity.getBody().getRealName().equals(userDO.getRealName())
        entity.getBody().getOrganizationId().equals(userDO.getOrganizationId())
    }

    def "Unlock"() {
        given: "构造请求参数"
        def userId = userDOList.get(0).getId()

        when: "调用方法[异常-组织不存在]"
        def entity = restTemplate.getForEntity(BASE_PATH + "/users/{id}/unlock", ExceptionResponse, notExistOrganizationId, userId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.not.exist")

        when: "调用方法"
        entity = restTemplate.getForEntity(BASE_PATH + "/users/{id}/unlock", UserDTO, organizationId, userId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        !entity.getBody().getLocked()
    }

    def "EnableUser"() {
        given: "构造请求参数"
        def userId = userDOList.get(0).getId()
        def httpEntity = new HttpEntity<Object>()

        when: "调用方法[异常-组织不存在]"
        def entity = restTemplate.exchange(BASE_PATH + "/users/{id}/enable", HttpMethod.PUT, httpEntity, ExceptionResponse, notExistOrganizationId, userId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.not.exist")

        when: "调用方法"
        entity = restTemplate.exchange(BASE_PATH + "/users/{id}/enable", HttpMethod.PUT, httpEntity, UserDTO, organizationId, userId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getEnabled()
    }

    def "DisableUser"() {
        given: "构造请求参数"
        def userId = userDOList.get(0).getId()
        def httpEntity = new HttpEntity<Object>()

        when: "调用方法[异常-组织不存在]"
        def entity = restTemplate.exchange(BASE_PATH + "/users/{id}/disable", HttpMethod.PUT, httpEntity, ExceptionResponse, notExistOrganizationId, userId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.not.exist")

        when: "调用方法"
        entity = restTemplate.exchange(BASE_PATH + "/users/{id}/disable", HttpMethod.PUT, httpEntity, UserDTO, organizationId, userId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        !entity.getBody().getEnabled()
    }

    def "Check"() {
        given: "构造请求参数"
        def userId = userDOList.get(0).getId()
        def userDTO = new UserDTO()
        userDTO.setLoginName("dengyouquan")
        userDTO.setRealName("邓有全")
        userDTO.setOrganizationId(1)

        when: "调用方法[异常-登录名字段为空]"
        userDTO.setLoginName("")
        userDTO.setEmail("")
        def entity = restTemplate.postForEntity(BASE_PATH + "/users/check", userDTO, ExceptionResponse, organizationId, userId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.user.validation.fields.empty")

        when: "调用方法[异常-登录名已经存在]"
        userDTO.setLoginName("dengyouquan1")
        entity = restTemplate.postForEntity(BASE_PATH + "/users/check", userDTO, ExceptionResponse, organizationId, userId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.user.loginName.exist")

        when: "调用方法[异常-邮箱地址已经存在]"
        userDTO.setLoginName("check")
        userDTO.setEmail("youquan.deng0@hand-china.com")
        entity = restTemplate.postForEntity(BASE_PATH + "/users/check", userDTO, ExceptionResponse, organizationId, userId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.user.email.exist")

        when: "调用方法"
        userDTO.setEmail("check@qq.com")
        entity = restTemplate.postForEntity(BASE_PATH + "/users/check", userDTO, ExceptionResponse, organizationId, userId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "ImportUsersFromExcel"() {
        given: "构造请求参数"
        def organizationId = 1L
        MultipartFile multipartFile = null

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/users/batch_import", multipartFile, Void, organizationId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "DownloadTemplates"() {
        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/users/download_templates", Resource, organizationId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "LatestHistory"() {
        given: "构造请求参数"
        def userId = userDOList.get(0).getId()

        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/users/{user_id}/upload/history", UploadHistoryDTO, organizationId, userId)
        needClean = true

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }
}
