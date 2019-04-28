package io.choerodon.iam.infra.common.utils.excel

import io.choerodon.core.exception.CommonException
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.ExcelMemberRoleDTO
import io.choerodon.iam.api.validator.UserPasswordValidator
import io.choerodon.iam.app.service.OrganizationUserService
import io.choerodon.iam.domain.repository.MemberRoleRepository
import io.choerodon.iam.domain.repository.RoleRepository
import io.choerodon.iam.domain.repository.UploadHistoryRepository
import io.choerodon.iam.domain.repository.UserRepository
import io.choerodon.iam.domain.service.IRoleMemberService
import io.choerodon.iam.domain.service.IUserService
import io.choerodon.iam.infra.dto.RoleDTO
import io.choerodon.iam.infra.dto.UploadHistoryDTO
import io.choerodon.iam.infra.dto.UserDTO
import io.choerodon.iam.infra.feign.FileFeignClient
import org.mockito.Mockito
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan*  */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class ExcelImportUserTaskSpec extends Specification {
    private UserRepository userRepository = Mock(UserRepository)
    private RoleRepository roleRepository = Mock(RoleRepository)
    private MemberRoleRepository memberRoleRepository = Mock(MemberRoleRepository)
    private IRoleMemberService iRoleMemberService = Mock(IRoleMemberService)
    private OrganizationUserService organizationUserService = Mock(OrganizationUserService)
    private FileFeignClient fileFeignClient = Mock(FileFeignClient)
    private IUserService iUserService = Mock(IUserService)
    private ExcelImportUserTask excelImportUserTask
    private UploadHistoryRepository uploadHistoryRepository = Mock(UploadHistoryRepository)
    private UserPasswordValidator userPasswordValidator = Mockito.mock(UserPasswordValidator)
    private int count = 3

    def setup() {
        excelImportUserTask = new ExcelImportUserTask(userRepository, roleRepository, memberRoleRepository, iRoleMemberService, organizationUserService, fileFeignClient, iUserService, userPasswordValidator)
    }

    def "import users with invalid password"() {
        given: "构造请求参数"
        UserPasswordValidator userPasswordValidator2 = Mockito.mock(UserPasswordValidator)
        Mockito.when(userPasswordValidator.validate(Mockito.anyString(), Mockito.any(Long), Mockito.anyBoolean())).thenReturn(false)
        ExcelImportUserTask excelImportUserTask2 = new ExcelImportUserTask(userRepository, roleRepository, memberRoleRepository, iRoleMemberService, organizationUserService, fileFeignClient, iUserService, userPasswordValidator2)
        Long userId = 1L
        List<UserDTO> users = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            UserDTO userDO = new UserDTO()
            userDO.setLoginName("20631")
            userDO.setEmail("youquan.deng@hand-china.com")
            userDO.setRealName("dengyouquan")
            userDO.setPhone("17729888888")
            userDO.setPassword("123")
            users << userDO
        }
        for (int i = 0; i < count; i++) {
            UserDTO userDO = new UserDTO()
            userDO.setLoginName("20632")
            userDO.setEmail("youquan.deng1@hand-china.com")
            userDO.setRealName("dengyouquan1")
            userDO.setPhone("17729888889")
            users << userDO
        }
        UserDTO loginNameUserDO = new UserDTO()
        loginNameUserDO.setEmail("youquan.deng2@hand-china.com")
        loginNameUserDO.setRealName("dengyouquan2")
        loginNameUserDO.setPhone("17729888889")
        users << loginNameUserDO
        UserDTO loginNameLengthUserDO = new UserDTO()
        StringBuilder sb = new StringBuilder()
        for (int i = 0; i < 10; i++) {
            sb.append("012345678910")
        }
        loginNameLengthUserDO.setLoginName(sb.toString())
        loginNameLengthUserDO.setEmail("youquan.deng2@hand-china.com")
        loginNameLengthUserDO.setRealName("dengyouquan2")
        loginNameLengthUserDO.setPhone("17729888889")
        users << loginNameLengthUserDO
        UserDTO emailUserDO = new UserDTO()
        emailUserDO.setLoginName("20631")
        emailUserDO.setEmail("youquan.deng")
        emailUserDO.setRealName("dengyouquan2")
        emailUserDO.setPhone("17729888889")
        users << emailUserDO
        UserDTO realNameUserDO = new UserDTO()
        realNameUserDO.setLoginName("20631")
        realNameUserDO.setEmail("youquan.deng2@hand-china.com")
        realNameUserDO.setPhone("17729888889")
        users << realNameUserDO
        UserDTO phoneUserDO = new UserDTO()
        phoneUserDO.setLoginName("20631")
        phoneUserDO.setRealName("dengyouquan")
        phoneUserDO.setEmail("youquan.deng2@hand-china.com")
        phoneUserDO.setPhone("11111")
        users << phoneUserDO
        Mockito.when(userPasswordValidator.validate(Mockito.anyString(), Mockito.any(Long), Mockito.anyBoolean())).thenReturn(true)
        UserDTO passwordUserDO = new UserDTO()
        passwordUserDO.setLoginName("zmf")
        passwordUserDO.setRealName("zhengmofang")
        passwordUserDO.setEmail("zmfble@aliyun.com")
        passwordUserDO.setPassword("111")

        Long organizationId = 1L
        UploadHistoryDTO uploadHistory = new UploadHistoryDTO()
        ExcelImportUserTask.FinishFallback fallback = Mock(ExcelImportUserTask.FinishFallback)
        Set<String> matchLoginName = new HashSet<>()
        matchLoginName.add("dengyouquan")
        matchLoginName.add("dengyouquan1")
        matchLoginName.add("dengyouquan2")
        Set<String> matchEmail = new HashSet<>()
        matchEmail.add("youquan.deng@hand-china.com")
        matchEmail.add("youquan.deng1@hand-china.com")
        matchEmail.add("youquan.deng2@hand-china.com")

        when: "调用方法"
        excelImportUserTask2.importUsers(userId, users, organizationId, uploadHistory, fallback)

        then: "校验结果"
        thrown(CommonException)
        _ * userRepository.matchLoginName(_) >> new HashSet<String>()
        _ * userRepository.matchEmail(_) >> new HashSet<String>()
    }

    def "ImportUsers"() {
        given: "构造请求参数"
        Long userId = 1L
        List<UserDTO> users = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            UserDTO userDO = new UserDTO()
            userDO.setLoginName("20631")
            userDO.setEmail("youquan.deng@hand-china.com")
            userDO.setRealName("dengyouquan")
            userDO.setPhone("17729888888")
            users << userDO
        }
        for (int i = 0; i < count; i++) {
            UserDTO userDO = new UserDTO()
            userDO.setLoginName("20632")
            userDO.setEmail("youquan.deng1@hand-china.com")
            userDO.setRealName("dengyouquan1")
            userDO.setPhone("17729888889")
            users << userDO
        }
        UserDTO loginNameUserDO = new UserDTO()
        loginNameUserDO.setEmail("youquan.deng2@hand-china.com")
        loginNameUserDO.setRealName("dengyouquan2")
        loginNameUserDO.setPhone("17729888889")
        users << loginNameUserDO
        UserDTO loginNameLengthUserDO = new UserDTO()
        StringBuilder sb = new StringBuilder()
        for (int i = 0; i < 10; i++) {
            sb.append("012345678910")
        }
        loginNameLengthUserDO.setLoginName(sb.toString())
        loginNameLengthUserDO.setEmail("youquan.deng2@hand-china.com")
        loginNameLengthUserDO.setRealName("dengyouquan2")
        loginNameLengthUserDO.setPhone("17729888889")
        users << loginNameLengthUserDO
        UserDTO emailUserDO = new UserDTO()
        emailUserDO.setLoginName("20631")
        emailUserDO.setEmail("youquan.deng")
        emailUserDO.setRealName("dengyouquan2")
        emailUserDO.setPhone("17729888889")
        users << emailUserDO
        UserDTO realNameUserDO = new UserDTO()
        realNameUserDO.setLoginName("20631")
        realNameUserDO.setEmail("youquan.deng2@hand-china.com")
        realNameUserDO.setPhone("17729888889")
        users << realNameUserDO
        UserDTO phoneUserDO = new UserDTO()
        phoneUserDO.setLoginName("20631")
        phoneUserDO.setRealName("dengyouquan")
        phoneUserDO.setEmail("youquan.deng2@hand-china.com")
        phoneUserDO.setPhone("11111")
        users << phoneUserDO
        Mockito.when(userPasswordValidator.validate(Mockito.anyString(), Mockito.any(Long), Mockito.anyBoolean())).thenReturn(true)
        UserDTO passwordUserDO = new UserDTO()
        passwordUserDO.setLoginName("zmf")
        passwordUserDO.setRealName("zhengmofang")
        passwordUserDO.setEmail("zmfble@aliyun.com")
        passwordUserDO.setPassword("111")

        Long organizationId = 1L
        UploadHistoryDTO uploadHistory = new UploadHistoryDTO()
        ExcelImportUserTask.FinishFallback fallback = Mock(ExcelImportUserTask.FinishFallback)
        Set<String> matchLoginName = new HashSet<>()
        matchLoginName.add("dengyouquan")
        matchLoginName.add("dengyouquan1")
        matchLoginName.add("dengyouquan2")
        Set<String> matchEmail = new HashSet<>()
        matchEmail.add("youquan.deng@hand-china.com")
        matchEmail.add("youquan.deng1@hand-china.com")
        matchEmail.add("youquan.deng2@hand-china.com")

        when: "调用方法"
        excelImportUserTask.importUsers(userId, users, organizationId, uploadHistory, fallback)

        then: "校验结果"
        1 * fallback.callback(_)
        1 * 1 * fileFeignClient.uploadFile(_, _, _) >> { new ResponseEntity<String>(HttpStatus.OK) }
        _ * userRepository.matchLoginName(_) >> new HashSet<String>()
        _ * userRepository.matchEmail(_) >> new HashSet<String>()
    }

    def "ImportMemberRole"() {
        given: "构造请求参数"
        RoleDTO roleDO = new RoleDTO()
        roleDO.setResourceLevel("site")
        List<ExcelMemberRoleDTO> memberRoles = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            ExcelMemberRoleDTO memberRoleDTO = new ExcelMemberRoleDTO()
            memberRoleDTO.setLoginName("login")
            memberRoleDTO.setRoleCode("code")
            memberRoles << memberRoleDTO
        }
        UploadHistoryDTO uploadHistory = new UploadHistoryDTO()
        uploadHistory.setSourceType("site")
        //ExcelImportUserTask.FinishFallback fallback = Mock(ExcelImportUserTask.FinishFallback)
        ExcelImportUserTask.FinishFallback fallback = ExcelImportUserTask.FinishFallbackImpl.newInstance(excelImportUserTask, uploadHistoryRepository)

        when: "调用方法"
        excelImportUserTask.importMemberRole(memberRoles, uploadHistory, fallback)

        then: "校验结果"
        1 * roleRepository.selectOne(_) >> { roleDO }
        1 * memberRoleRepository.selectOne(_)
        1 * iRoleMemberService.insertAndSendEvent(_, _)
        1 * userRepository.selectOne(_) >> { new UserDTO() }
        1 * 1 * fileFeignClient.uploadFile(_, _, _) >> { new ResponseEntity<String>(HttpStatus.OK) }
        1 * uploadHistoryRepository.selectByPrimaryKey(_) >> { new UploadHistoryDTO() }
        1 * uploadHistoryRepository.updateByPrimaryKeySelective(_)
        0 * _
    }
}