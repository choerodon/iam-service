package io.choerodon.iam.app.service.impl

import io.choerodon.asgard.saga.dto.StartInstanceDTO
import io.choerodon.asgard.saga.feign.SagaClient
import io.choerodon.core.oauth.DetailsHelper
import io.choerodon.iam.api.validator.UserPasswordValidator
import io.choerodon.iam.app.service.OrganizationUserService
import io.choerodon.iam.app.service.SystemSettingService
import io.choerodon.iam.domain.repository.OrganizationRepository
import io.choerodon.iam.domain.repository.UserRepository
import io.choerodon.iam.domain.service.IUserService
import io.choerodon.iam.infra.common.utils.SpockUtils
import io.choerodon.iam.infra.dto.OrganizationDTO
import io.choerodon.iam.infra.dto.UserDTO
import io.choerodon.iam.infra.feign.OauthTokenFeignClient
import io.choerodon.oauth.core.password.PasswordPolicyManager
import io.choerodon.oauth.core.password.mapper.BasePasswordPolicyMapper
import io.choerodon.oauth.core.password.record.PasswordRecord
import org.junit.runner.RunWith
import org.powermock.api.mockito.PowerMockito
import org.powermock.core.classloader.annotations.PrepareForTest
import org.powermock.modules.junit4.PowerMockRunner
import org.powermock.modules.junit4.PowerMockRunnerDelegate
import org.spockframework.runtime.Sputnik
import org.springframework.beans.BeanUtils
import spock.lang.Specification

import java.lang.reflect.Field

/**
 * @author dengyouquan
 * */
@RunWith(PowerMockRunner)
@PowerMockRunnerDelegate(Sputnik)
@PrepareForTest([DetailsHelper])
class OrganizationUserServiceImplSpec extends Specification {
    private PasswordRecord passwordRecord = Mock(PasswordRecord)
    private OrganizationRepository organizationRepository = Mock(OrganizationRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private IUserService iUserService = Mock(IUserService)
    private SagaClient sagaClient = Mock(SagaClient)
    private PasswordPolicyManager passwordPolicyManager = Mock(PasswordPolicyManager)
    private BasePasswordPolicyMapper basePasswordPolicyMapper = Mock(BasePasswordPolicyMapper)
    private OauthTokenFeignClient oauthTokenFeignClient = Mock(OauthTokenFeignClient)
    private UserPasswordValidator userPasswordValidator = Mock(UserPasswordValidator)
    private SystemSettingService systemSettingService = Mock(SystemSettingService)
    private OrganizationUserService organizationUserService
    private Long userId

    def setup() {
        given: "构造organizationUserService"
        organizationUserService = new OrganizationUserServiceImpl(
                organizationRepository, userRepository, passwordRecord, passwordPolicyManager,
                basePasswordPolicyMapper, oauthTokenFeignClient, userPasswordValidator, iUserService, systemSettingService, sagaClient)
        Field field = organizationUserService.getClass().getDeclaredField("devopsMessage")
        field.setAccessible(true)
        field.set(organizationUserService, true)

        and: "mock静态方法-CustomUserDetails"
        PowerMockito.mockStatic(DetailsHelper)
        PowerMockito.when(DetailsHelper.getUserDetails()).thenReturn(SpockUtils.getCustomUserDetails())
        userId = DetailsHelper.getUserDetails().getUserId()
    }

    def "Create"() {
        given: "mock静态方法-ConvertHelper"
        def checkPassword = false
        def userDTO = new UserDTO()
        userDTO.setId(userId)
        userDTO.setOrganizationId(1L)
        userDTO.setPassword("123456")
        UserDTO user = new UserDTO()
        user.setPassword("password")
        user.setId(1)
        user.setLoginName("kangkang")
        UserDTO userDO = new UserDTO()
        BeanUtils.copyProperties(user, userDO)
//        PowerMockito.mockStatic(ConvertHelper)
//        PowerMockito.when(ConvertHelper.convert(Mockito.any(), Mockito.any())).thenReturn(user).thenReturn(userDO).thenReturn(user).thenReturn(userDTO)

        when: "调用方法"
        organizationUserService.create(userDTO, checkPassword,true)

        then: "校验结果"
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDTO() }
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
        1 * userRepository.selectByLoginName(_) >> null
        1 * userRepository.insertSelective(_) >> userDO
        1 * passwordRecord.updatePassword(_, _)
    }

    def "BatchCreateUsers"() {
        given: "构造请求参数"
        UserDTO user = new UserDTO()
        user.setEnabled(true)
        user.setId(userId)
        List<UserDTO> insertUsers = new ArrayList<>()
        insertUsers.add(user)

        when: "调用方法"
        organizationUserService.batchCreateUsers(insertUsers)

        then: "校验结果"
        1 * userRepository.insertSelective(_) >> { user }
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }

    def "Update"() {
        given: "构造请求参数"
        UserDTO user = new UserDTO()
        user.setId(1)
        user.setLoginName("kangkang")
        user.setPassword("password")

//        and: "mock ConvertHelper"
//        PowerMockito.mockStatic(ConvertHelper)
//        PowerMockito.when(ConvertHelper.convert(Mockito.any(), Mockito.any())).thenReturn(user).thenReturn(user).thenReturn(new UserDTO())

        when: "调用方法"
        organizationUserService.update(new UserDTO())

        then: "校验结果"
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDTO() }
        1 * userRepository.updateSelective(_) >> { user }
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }

    def "Delete"() {
        given: "构造请求参数"
        def organizationId = 1L
        UserDTO user = new UserDTO()
        user.setPassword("password")
        Field field = user.getClass().getDeclaredField("id")
        field.setAccessible(true)
        field.set(user, 1L)

        and: "mock ConvertHelper"
        OrganizationDTO organization = new OrganizationDTO()
        organization.setId(1)
        organization.setName("name")
        organization.setCode("code")
        organization.setEnabled(true)
        organization.setUserId(userId)
        organization.setAddress("address")

        when: "调用方法"
        organizationUserService.delete(organizationId, userId)

        then: "校验结果"
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDTO() }
        1 * userRepository.selectByPrimaryKey(_) >> { user }
        1 * userRepository.deleteById(_)
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }

    def "EnableUser"() {
        given: "构造请求参数"
        def organizationId = 1L
        UserDTO user = new UserDTO()
        user.setPassword("password")
        Field field = user.getClass().getDeclaredField("id")
        field.setAccessible(true)
        field.set(user, 1L)

//        and: "mock ConvertHelper"
//        PowerMockito.mockStatic(ConvertHelper)
//        PowerMockito.when(ConvertHelper.convert(Mockito.any(), Mockito.any())).thenReturn(new UserDTO())

        when: "调用方法"
        organizationUserService.enableUser(organizationId, userId)

        then: "校验结果"
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDTO() }
        1 * userRepository.selectByPrimaryKey(_) >> { user }
        1 * iUserService.updateUserEnabled(_) >> { user }
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }

    def "DisableUser"() {
        given: "构造请求参数"
        def organizationId = 1L
        UserDTO user = new UserDTO()
        user.setPassword("password")
        Field field = user.getClass().getDeclaredField("id")
        field.setAccessible(true)
        field.set(user, 1L)

//        and: "mock ConvertHelper"
//        PowerMockito.mockStatic(ConvertHelper)
//        PowerMockito.when(ConvertHelper.convert(Mockito.any(), Mockito.any())).thenReturn(new UserDTO())

        when: "调用方法"
        organizationUserService.disableUser(organizationId, userId)

        then: "校验结果"
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDTO() }
        1 * userRepository.selectByPrimaryKey(_) >> { user }
        1 * iUserService.updateUserDisabled(_) >> { user }
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }
}
