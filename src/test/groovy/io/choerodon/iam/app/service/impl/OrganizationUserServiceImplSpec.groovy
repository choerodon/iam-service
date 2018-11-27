package io.choerodon.iam.app.service.impl

import io.choerodon.asgard.saga.dto.StartInstanceDTO
import io.choerodon.asgard.saga.feign.SagaClient
import io.choerodon.core.convertor.ConvertHelper
import io.choerodon.core.oauth.DetailsHelper
import io.choerodon.iam.api.dto.UserDTO
import io.choerodon.iam.api.validator.UserPasswordValidator
import io.choerodon.iam.app.service.OrganizationUserService
import io.choerodon.iam.app.service.SystemSettingService
import io.choerodon.iam.domain.iam.entity.OrganizationE
import io.choerodon.iam.domain.iam.entity.UserE
import io.choerodon.iam.domain.repository.OrganizationRepository
import io.choerodon.iam.domain.repository.UserRepository
import io.choerodon.iam.domain.service.IUserService
import io.choerodon.iam.infra.common.utils.SpockUtils
import io.choerodon.iam.infra.dataobject.OrganizationDO
import io.choerodon.iam.infra.dataobject.UserDO
import io.choerodon.iam.infra.mapper.AccessTokenMapper
import io.choerodon.iam.infra.mapper.RefreshTokenMapper
import io.choerodon.oauth.core.password.PasswordPolicyManager
import io.choerodon.oauth.core.password.mapper.BasePasswordPolicyMapper
import io.choerodon.oauth.core.password.record.PasswordRecord
import org.junit.runner.RunWith
import org.mockito.Mockito
import org.powermock.api.mockito.PowerMockito
import org.powermock.core.classloader.annotations.PrepareForTest
import org.powermock.modules.junit4.PowerMockRunner
import org.powermock.modules.junit4.PowerMockRunnerDelegate
import org.spockframework.runtime.Sputnik
import spock.lang.Specification

import java.lang.reflect.Field

/**
 * @author dengyouquan
 * */
@RunWith(PowerMockRunner)
@PowerMockRunnerDelegate(Sputnik)
@PrepareForTest([DetailsHelper, ConvertHelper])
class OrganizationUserServiceImplSpec extends Specification {
    private PasswordRecord passwordRecord = Mock(PasswordRecord)
    private OrganizationRepository organizationRepository = Mock(OrganizationRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private IUserService iUserService = Mock(IUserService)
    private SagaClient sagaClient = Mock(SagaClient)
    private PasswordPolicyManager passwordPolicyManager = Mock(PasswordPolicyManager)
    private BasePasswordPolicyMapper basePasswordPolicyMapper = Mock(BasePasswordPolicyMapper)
    private AccessTokenMapper accessTokenMapper = Mockito.mock(AccessTokenMapper)
    private RefreshTokenMapper refreshTokenMapper = Mockito.mock(RefreshTokenMapper)
    private UserPasswordValidator userPasswordValidator = Mock(UserPasswordValidator)
    private SystemSettingService systemSettingService = Mock(SystemSettingService)
    private OrganizationUserService organizationUserService
    private Long userId

    def setup() {
        given: "构造organizationUserService"
        organizationUserService = new OrganizationUserServiceImpl(
                organizationRepository, userRepository, passwordRecord, passwordPolicyManager,
                basePasswordPolicyMapper, accessTokenMapper, refreshTokenMapper, userPasswordValidator, iUserService, systemSettingService, sagaClient)
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
        OrganizationE organizationE = new OrganizationE(1, "name", "code",
                1L, userRepository, true, passwordRecord, userId, "address")
        PowerMockito.mockStatic(ConvertHelper)
        PowerMockito.when(ConvertHelper.convert(Mockito.any(), Mockito.any())).thenReturn(organizationE).thenReturn(new UserE("123456"))

        when: "调用方法"
        organizationUserService.create(userDTO, checkPassword)

        then: "校验结果"
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDO() }
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
        1 * userRepository.selectByLoginName(_)
        1 * userRepository.insertSelective(_) >> {
            UserE userE = new UserE("password")
            Field field = userE.getClass().getDeclaredField("id")
            field.setAccessible(true)
            field.set(userE, 1L)
            return userE
        }
        1 * passwordRecord.updatePassword(_, _)
    }

    def "BatchCreateUsers"() {
        given: "构造请求参数"
        UserDO userDO = new UserDO()
        userDO.setEnabled(true)
        userDO.setId(userId)
        List<UserDO> insertUsers = new ArrayList<>()
        insertUsers.add(userDO)

        when: "调用方法"
        organizationUserService.batchCreateUsers(insertUsers)

        then: "校验结果"
        1 * userRepository.insertList(_) >> { insertUsers }
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }

    def "Update"() {
        given: "构造请求参数"
        UserE userE = new UserE("password")
        Field field = userE.getClass().getDeclaredField("id")
        field.setAccessible(true)
        field.set(userE, 1L)

        and: "mock ConvertHelper"
        OrganizationE organizationE = new OrganizationE(1, "name", "code",
                1L, userRepository, true, passwordRecord, userId, "address")
        PowerMockito.mockStatic(ConvertHelper)
        PowerMockito.when(ConvertHelper.convert(Mockito.any(), Mockito.any())).thenReturn(organizationE).thenReturn(userE).thenReturn(new UserDTO())

        when: "调用方法"
        organizationUserService.update(new UserDTO())

        then: "校验结果"
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDO() }
        1 * userRepository.updateSelective(_) >> { userE }
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }

    def "Delete"() {
        given: "构造请求参数"
        def organizationId = 1L
        UserE userE = new UserE("password")
        Field field = userE.getClass().getDeclaredField("id")
        field.setAccessible(true)
        field.set(userE, 1L)

        and: "mock ConvertHelper"
        OrganizationE organizationE = new OrganizationE(1, "name", "code",
                1L, userRepository, true, passwordRecord, userId, "address")
        PowerMockito.mockStatic(ConvertHelper)
        PowerMockito.when(ConvertHelper.convert(Mockito.any(), Mockito.any())).thenReturn(organizationE).thenReturn(userE).thenReturn(new UserDTO())

        when: "调用方法"
        organizationUserService.delete(organizationId, userId)

        then: "校验结果"
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDO() }
        1 * userRepository.selectByPrimaryKey(_) >> { userE }
        1 * userRepository.deleteById(_)
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }

    def "EnableUser"() {
        given: "构造请求参数"
        def organizationId = 1L
        UserE userE = new UserE("password")
        Field field = userE.getClass().getDeclaredField("id")
        field.setAccessible(true)
        field.set(userE, 1L)

        and: "mock ConvertHelper"
        OrganizationE organizationE = new OrganizationE(1, "name", "code",
                1L, userRepository, true, passwordRecord, userId, "address")
        PowerMockito.mockStatic(ConvertHelper)
        PowerMockito.when(ConvertHelper.convert(Mockito.any(), Mockito.any())).thenReturn(new UserDTO())

        when: "调用方法"
        organizationUserService.enableUser(organizationId, userId)

        then: "校验结果"
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDO() }
        1 * userRepository.selectByPrimaryKey(_) >> { userE }
        1 * iUserService.updateUserEnabled(_) >> { userE }
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }

    def "DisableUser"() {
        given: "构造请求参数"
        def organizationId = 1L
        UserE userE = new UserE("password")
        Field field = userE.getClass().getDeclaredField("id")
        field.setAccessible(true)
        field.set(userE, 1L)

        and: "mock ConvertHelper"
        OrganizationE organizationE = new OrganizationE(1, "name", "code",
                1L, userRepository, true, passwordRecord, userId, "address")
        PowerMockito.mockStatic(ConvertHelper)
        PowerMockito.when(ConvertHelper.convert(Mockito.any(), Mockito.any())).thenReturn(new UserDTO())

        when: "调用方法"
        organizationUserService.disableUser(organizationId, userId)

        then: "校验结果"
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDO() }
        1 * userRepository.selectByPrimaryKey(_) >> { userE }
        1 * iUserService.updateUserDisabled(_) >> { userE }
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }
}
