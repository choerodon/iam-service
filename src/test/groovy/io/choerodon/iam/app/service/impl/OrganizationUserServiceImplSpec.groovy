package io.choerodon.iam.app.service.impl

import io.choerodon.asgard.saga.dto.StartInstanceDTO
import io.choerodon.asgard.saga.feign.SagaClient
import io.choerodon.core.oauth.DetailsHelper
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.validator.UserPasswordValidator
import io.choerodon.iam.app.service.OrganizationUserService
import io.choerodon.iam.app.service.SystemSettingService
import io.choerodon.iam.app.service.UserService
import io.choerodon.iam.infra.asserts.OrganizationAssertHelper
import io.choerodon.iam.infra.asserts.UserAssertHelper
import io.choerodon.iam.infra.dto.UserDTO
import io.choerodon.iam.infra.feign.OauthTokenFeignClient
import io.choerodon.iam.infra.mapper.OrganizationMapper
import io.choerodon.iam.infra.mapper.UserMapper
import io.choerodon.oauth.core.password.PasswordPolicyManager
import io.choerodon.oauth.core.password.mapper.BasePasswordPolicyMapper
import io.choerodon.oauth.core.password.record.PasswordRecord
import org.springframework.beans.BeanUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification

import java.lang.reflect.Field

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan*    */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class OrganizationUserServiceImplSpec extends Specification {
    private SagaClient sagaClient = Mock(SagaClient)
    private OauthTokenFeignClient oauthTokenFeignClient = Mock(OauthTokenFeignClient)
    private Long userId
    @Autowired
    private PasswordRecord passwordRecord
    @Autowired
    private UserService userService
    @Autowired
    private PasswordPolicyManager passwordPolicyManager
    @Autowired
    private BasePasswordPolicyMapper basePasswordPolicyMapper
    @Autowired
    private UserPasswordValidator userPasswordValidator
    @Autowired
    private SystemSettingService systemSettingService
    @Autowired
    private OrganizationUserService organizationUserService

    @Autowired
    OrganizationAssertHelper organizationAssertHelper
    @Autowired
    OrganizationMapper organizationMapper
    @Autowired
    UserAssertHelper userAssertHelper
    @Autowired
    UserMapper userMapper

    def setup() {
        given: "构造organizationUserService"
        organizationUserService = new OrganizationUserServiceImpl(passwordRecord, passwordPolicyManager,
                basePasswordPolicyMapper, oauthTokenFeignClient, userPasswordValidator, systemSettingService, sagaClient,
                organizationAssertHelper, organizationMapper, userAssertHelper, userMapper, userService)
        Field field = organizationUserService.getClass().getDeclaredField("devopsMessage")
        field.setAccessible(true)
        field.set(organizationUserService, true)
        DetailsHelper.setCustomUserDetails(1L, "zh_CN");
    }

    @Transactional
    def "Create"() {
        given: "mock静态方法-ConvertHelper"
        def checkPassword = false
        def userDTO = new UserDTO()
        userDTO.setId(userId)
        userDTO.setOrganizationId(1L)
        userDTO.setPassword("123456")
        userDTO.setPassword("password")
        userDTO.setLoginName("askhfuweasdsha")
        userDTO.setEmail("kangkang@qq.com")

        when: "调用方法"
        organizationUserService.create(userDTO, checkPassword)

        then: "校验结果"
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }

    @Transactional
    def "BatchCreateUsers"() {
        given: "构造请求参数"
        UserDTO user = new UserDTO()
        user.setEnabled(true)
        user.setLoginName("1")
        user.setEmail("email")
        user.setOrganizationId(1L)
        user.setLanguage("zh_CN")
        user.setTimeZone("zcc")
        user.setLastPasswordUpdatedAt(new Date())
        user.setLocked(false)

        UserDTO user1 = new UserDTO()
        BeanUtils.copyProperties(user, user1)
        user1.setLoginName("2")
        user1.setEmail("email2")
        List<UserDTO> insertUsers = new ArrayList<>()
        insertUsers << user
        insertUsers << user1

        when: "调用方法"
        organizationUserService.batchCreateUsers(insertUsers)

        then: "校验结果"
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }

    @Transactional
    def "Update"() {
        given: "构造请求参数"

        UserDTO dto = userMapper.selectByPrimaryKey(1)
        dto.setLoginName("abcsa")

        when: "调用方法"
        organizationUserService.update(dto)

        then: "校验结果"
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }

    @Transactional
    def "Delete"() {
        when: "调用方法"
        organizationUserService.delete(1L, 1L)

        then: "校验结果"
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }

    @Transactional
    def "EnableUser"() {

        when: "调用方法"
        organizationUserService.enableUser(1, 1)

        then: "校验结果"
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }

    @Transactional
    def "DisableUser"() {

        when: "调用方法"
        organizationUserService.disableUser(1, 1)

        then: "校验结果"
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }
}
