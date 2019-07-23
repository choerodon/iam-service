package io.choerodon.iam.app.service.impl

import io.choerodon.asgard.saga.dto.StartInstanceDTO
import io.choerodon.asgard.saga.feign.SagaClient
import io.choerodon.core.exception.CommonException
import io.choerodon.core.oauth.DetailsHelper
import io.choerodon.iam.api.dto.CreateUserWithRolesDTO
import io.choerodon.iam.api.dto.UserPasswordDTO
import io.choerodon.iam.api.validator.UserPasswordValidator
import io.choerodon.iam.app.service.UserService
import io.choerodon.iam.domain.repository.OrganizationRepository
import io.choerodon.iam.domain.repository.ProjectRepository
import io.choerodon.iam.domain.repository.RoleRepository
import io.choerodon.iam.domain.repository.UserRepository
import io.choerodon.iam.domain.service.IUserService
import io.choerodon.iam.infra.common.utils.SpockUtils
import io.choerodon.iam.infra.dto.*
import io.choerodon.iam.infra.feign.FileFeignClient
import io.choerodon.iam.infra.mapper.MemberRoleMapper
import io.choerodon.iam.infra.mapper.ProjectMapCategoryMapper
import io.choerodon.oauth.core.password.PasswordPolicyManager
import io.choerodon.oauth.core.password.domain.BasePasswordPolicyDTO
import io.choerodon.oauth.core.password.mapper.BasePasswordPolicyMapper
import io.choerodon.oauth.core.password.record.PasswordRecord
import org.apache.http.entity.ContentType
import org.junit.runner.RunWith
import org.mockito.Mockito
import org.powermock.api.mockito.PowerMockito
import org.powermock.core.classloader.annotations.PrepareForTest
import org.powermock.modules.junit4.PowerMockRunner
import org.powermock.modules.junit4.PowerMockRunnerDelegate
import org.spockframework.runtime.Sputnik
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.mock.web.MockMultipartFile
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.web.multipart.MultipartFile
import spock.lang.Specification

import java.lang.reflect.Field

/**
 * @author dengyouquan
 */
@RunWith(PowerMockRunner)
@PowerMockRunnerDelegate(Sputnik)
@PrepareForTest([DetailsHelper])
class UserServiceImplSpec extends Specification {
    private UserRepository userRepository = Mock(UserRepository)
    private IUserService iUserService = Mock(IUserService)
    private OrganizationRepository organizationRepository = Mock(OrganizationRepository)
    private ProjectRepository projectRepository = Mock(ProjectRepository)
    private PasswordRecord passwordRecord = Mock(PasswordRecord)
    private FileFeignClient fileFeignClient = Mock(FileFeignClient)
    private BasePasswordPolicyMapper basePasswordPolicyMapper = Mock(BasePasswordPolicyMapper)
    private PasswordPolicyManager passwordPolicyManager = Mock(PasswordPolicyManager)
    private RoleRepository roleRepository = Mock(RoleRepository)
    private SagaClient sagaClient = Mock(SagaClient)
    private MemberRoleMapper memberRoleMapper = Mock(MemberRoleMapper)
    private ProjectMapCategoryMapper projectMapCategoryMapper = Mock(ProjectMapCategoryMapper)
    private UserPasswordValidator userPasswordValidator = Mock(UserPasswordValidator)
    private UserService userService
    private Long userId
    def checkLogin = false

    def setup() {
        given: "构造userService"
        userService = new UserServiceImpl(userRepository, organizationRepository,
                projectRepository, iUserService, passwordRecord, fileFeignClient,
                sagaClient, basePasswordPolicyMapper, userPasswordValidator, passwordPolicyManager, roleRepository,
                memberRoleMapper, projectMapCategoryMapper)
        Field field = userService.getClass().getDeclaredField("devopsMessage")
        field.setAccessible(true)
        field.set(userService, true)

        and: "mock静态方法-CustomUserDetails"
        PowerMockito.mockStatic(DetailsHelper)
        PowerMockito.when(DetailsHelper.getUserDetails()).thenReturn(SpockUtils.getCustomUserDetails())
        userId = DetailsHelper.getUserDetails().getUserId()
    }

    def "QuerySelf"() {
        given: "mock静态方法-ConvertHelper"
        def userDTO = new UserDTO()
        userDTO.setOrganizationId(1L)
//        PowerMockito.mockStatic(ConvertHelper)
//        PowerMockito.when(ConvertHelper.convert(Mockito.any(), Mockito.any())).thenReturn(userDTO)
        UserDTO user = new UserDTO();
        user.setPassword("password")


        when: "调用方法"
        userService.querySelf()

        then: "校验结果"
        1 * userRepository.selectByPrimaryKey(_) >> { user }
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDTO() }
    }

    def "QueryOrganizations"() {
//        given: "mock静态方法-ConvertHelper"
//        PowerMockito.mockStatic(ConvertHelper)
//        PowerMockito.when(ConvertHelper.convertList(Mockito.any(), Mockito.any())).thenReturn(new ArrayList<OrganizationDTO>())

        when: "调用方法"
        userService.queryOrganizations(userId, false)

        then: "校验结果"
        1 * organizationRepository.selectAll() >> { new ArrayList<OrganizationDTO>() }
    }

    def "QueryProjects"() {
        given: "mock静态方法-ConvertHelper"
//        PowerMockito.mockStatic(ConvertHelper)
//        PowerMockito.when(ConvertHelper.convertList(Mockito.any(), Mockito.any())).thenReturn(new ArrayList<ProjectDTO>())

        when: "调用方法"
        userService.queryProjects(userId, false)

        then: "校验结果"
        1 * projectRepository.selectAll() >> { new ArrayList<ProjectDTO>() }
    }

    def "UploadPhoto"() {
        given: "构造参数"
        MultipartFile multipartFile = new MockMultipartFile("name", new byte[10])

        when: "调用方法"
        userService.uploadPhoto(userId, multipartFile)

        then: "校验结果"
        1 * fileFeignClient.uploadFile(_, _, _) >> { new ResponseEntity<String>(HttpStatus.OK) }
    }

    def "SavePhoto"() {
        given: "构造参数"
        Double rotate = null
        def axisX = 1
        def axisY = 1
        def width = 1
        def height = 1
        File excelFile = new File(this.class.getResource('/templates/bk_log.jpg').toURI())
        FileInputStream fileInputStream = new FileInputStream(excelFile)
        MultipartFile multipartFile = new MockMultipartFile(excelFile.getName(),
                excelFile.getName(), ContentType.APPLICATION_OCTET_STREAM.toString(),
                fileInputStream)

        when: "调用方法"
        userService.savePhoto(userId, multipartFile, rotate, axisX, axisY, width, height)

        then: "校验结果"
        1 * fileFeignClient.uploadFile(_, _, _) >> { new ResponseEntity<String>(HttpStatus.OK) }
        1 * userRepository.updatePhoto(_, _)

        when: "调用方法"
        rotate = 1.0
        userService.savePhoto(userId, multipartFile, rotate, axisX, axisY, width, height)

        then: "校验结果"
        1 * fileFeignClient.uploadFile(_, _, _) >> { new ResponseEntity<String>(HttpStatus.OK) }
        1 * userRepository.updatePhoto(_, _)

        when: "调用方法"
        rotate = 1.0
        userService.savePhoto(userId, null, rotate, axisX, axisY, width, height)

        then: "校验结果"
        def exception = thrown(CommonException)
        exception.message.equals("error.user.photo.save")
    }

    def "SelfUpdatePassword"() {
        given: "构造参数"
        BCryptPasswordEncoder ENCODER = new BCryptPasswordEncoder()
        UserPasswordDTO userPasswordDTO = new UserPasswordDTO()
        userPasswordDTO.setPassword("123456")
        userPasswordDTO.setOriginalPassword("123456")
        def checkPassword = true

        when: "调用方法"
        userService.selfUpdatePassword(userId, userPasswordDTO, checkPassword, checkLogin)

        then: "校验结果"
        1 * userRepository.selectByPrimaryKey(_) >> {
            UserDTO user = new UserDTO()
            user.setPassword("password")
            Field field = user.getClass().getDeclaredField("ldap")
            field.setAccessible(true)
            field.set(user, false)
            Field field1 = user.getClass().getDeclaredField("password")
            field1.setAccessible(true)
            field1.set(user, ENCODER.encode("123456"))
            return user
        }
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDTO() }
        1 * basePasswordPolicyMapper.selectOne(_) >> { new BasePasswordPolicyDTO() }
        1 * passwordPolicyManager.passwordValidate(_, _, _)
        1 * userRepository.updateSelective(_)
        1 * passwordRecord.updatePassword(_, _)
        1 * iUserService.sendNotice(_, _, _, _, _)
        noExceptionThrown()
    }

    def "SelfUpdatePassword[Exception]"() {
        given: "构造参数"
        UserPasswordDTO userPasswordDTO = new UserPasswordDTO()
        def checkPassword = false

        when: "调用方法"
        userService.selfUpdatePassword(userId, userPasswordDTO, checkPassword, checkLogin)

        then: "校验结果"
        1 * userRepository.selectByPrimaryKey(_) >> {
            UserDTO user = new UserDTO()
            user.setPassword("password")
            Field field = user.getClass().getDeclaredField("ldap")
            field.setAccessible(true)
            field.set(user, true)
            return user
        }
        def exception = thrown(CommonException)
        exception.message.equals("error.ldap.user.can.not.update.password")

        when: "调用方法"
        userService.selfUpdatePassword(userId, userPasswordDTO, checkPassword, checkLogin)

        then: "校验结果"
        1 * userRepository.selectByPrimaryKey(_) >> {
            UserDTO user = new UserDTO()
            user.setPassword("password")
            Field field = user.getClass().getDeclaredField("ldap")
            field.setAccessible(true)
            field.set(user, false)
            return user
        }
        exception = thrown(CommonException)
        exception.message.equals("error.password.originalPassword")
    }

    def "UpdateInfo"() {
        given: "构造请求参数"
        def userDTO = new UserDTO()
        userDTO.setId(userId)

        and: "mock静态方法-ConvertHelper"
//        PowerMockito.mockStatic(ConvertHelper)
//        PowerMockito.when(ConvertHelper.convert(Mockito.any(), Mockito.any())).thenReturn(new UserE("123456")).thenReturn(new UserDTO())

        when: "调用方法"
        userService.updateInfo(userDTO)

        then: "校验结果"
        1 * organizationRepository.selectByPrimaryKey(_) >> new OrganizationDTO()
        1 * iUserService.updateUserInfo(_) >> {
            UserDTO user = new UserDTO()
            user.setPassword("123456")
            Field field = user.getClass().getDeclaredField("id")
            field.setAccessible(true)
            field.set(user, 1L)
            return user
        }
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }

    def "LockUser"() {
        given: "构造请求参数"
        def lockExpireTime = 1
        UserDTO user = new UserDTO()
        user.setPassword("123456")

        when: "调用方法"
        userService.lockUser(userId, lockExpireTime)

        then: "校验结果"
        1 * userRepository.selectByPrimaryKey(_) >> { user }
        1 * userRepository.updateSelective(_) >> { user }
    }

    def "AddAdminUsers"() {
        given: "构造请求参数"
        long[] ids = new long[1]
        ids[0] = userId
        UserDTO userE = new UserDTO()
        userE.setPassword("123456")

        when: "调用方法"
        userService.addAdminUsers(ids)

        then: "校验结果"
        1 * userRepository.selectByPrimaryKey(_) >> {

            Field field = userE.getClass().getDeclaredField("admin")
            field.setAccessible(true)
            field.set(userE, false)
            return userE
        }
        1 * userRepository.updateSelective(_) >> { userE }
    }

    def "DeleteAdminUser"() {
        given: "构造请求参数"
        long id = 1L
        UserDTO userE = new UserDTO()
        userE.setPassword("123456")

        when: "调用方法"
        userService.deleteAdminUser(id)

        then: "校验结果"
        1 * userRepository.selectByPrimaryKey(_) >> {
//            UserE userE = new UserE("123456")
            Field field = userE.getClass().getDeclaredField("admin")
            field.setAccessible(true)
            field.set(userE, true)
            return userE
        }
        1 * userRepository.updateSelective(_) >> { userE }
        1 * userRepository.selectCount(_) >> { 2 }
    }

    def "CreateUserAndAssignRoles"() {
        given: "构造请求参数"
        Set<String> roleCodes = new HashSet<>()
        roleCodes.add("code")
        UserDTO userDO = new UserDTO()
        userDO.setLoginName("loginName")
        userDO.setEmail("email")
        userDO.setPassword("123456")
        CreateUserWithRolesDTO userWithRoles = new CreateUserWithRolesDTO()
        userWithRoles.setUser(userDO)
        userWithRoles.setSourceId(0)
        userWithRoles.setSourceType("organization")
        userWithRoles.setRoleCode(roleCodes)

        and: "mock静态方法-ConvertHelper"
        PowerMockito.mockStatic(ConvertHelper)
        UserDTO userDTO = new UserDTO()
        userDTO.setPassword("123456")
        PowerMockito.when(ConvertHelper.convert(Mockito.any(), Mockito.any())).thenReturn(userDTO).thenReturn(new UserDTO())

        when: "调用方法"
        userService.createUserAndAssignRoles(userWithRoles)

        then: "校验结果"
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDTO() }
        1 * roleRepository.selectByCode(_) >> {
            RoleDTO roleDO = new RoleDTO()
            roleDO.setResourceLevel("organization")
            return roleDO
        }
        1 * userRepository.selectByLoginName(_)
        1 * userRepository.selectOne(_)
        1 * basePasswordPolicyMapper.selectOne(_) >> {
            BasePasswordPolicyDTO basePasswordPolicyDO = new BasePasswordPolicyDTO()
            basePasswordPolicyDO.setOriginalPassword("123456")
            return basePasswordPolicyDO
        }
        1 * userRepository.insertSelective(_) >> {
            UserDTO user = new UserDTO()
            user.setPassword("123456")
            return user
        }
        1 * memberRoleMapper.selectOne(_) >> { new MemberRoleDTO() }
    }

    def "PagingQueryProjectsSelf"() {
    }

    def "PagingQueryOrganizationsSelf"() {
    }

    def "ListUserIds"() {
    }

    def "QueryOrgIdByEmail"() {
        given: "构造请求参数"
        String email = "email"

        when: "调用方法"
        userService.queryOrgIdByEmail(email)

        then: "校验结果"
        1 * userRepository.selectOne(_) >> { new UserDTO() }
    }
}
