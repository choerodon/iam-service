package io.choerodon.iam.domain.service.impl

import io.choerodon.asgard.saga.dto.StartInstanceDTO
import io.choerodon.asgard.saga.feign.SagaClient
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.RoleAssignmentDeleteDTO
import io.choerodon.iam.domain.repository.ClientRepository
import io.choerodon.iam.domain.repository.LabelRepository
import io.choerodon.iam.domain.repository.MemberRoleRepository
import io.choerodon.iam.domain.repository.UserRepository
import io.choerodon.iam.domain.service.IRoleMemberService
import io.choerodon.iam.infra.dto.MemberRoleDTO
import io.choerodon.iam.infra.dto.UserDTO
import io.choerodon.iam.infra.mapper.MemberRoleMapper
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import java.lang.reflect.Field

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan* */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class IRoleMemberServiceImplSpec extends Specification {
    private UserRepository userRepository = Mock(UserRepository)
    private MemberRoleRepository memberRoleRepository = Mock(MemberRoleRepository)
    private MemberRoleMapper memberRoleMapper = Mock(MemberRoleMapper)
    private LabelRepository labelRepository = Mock(LabelRepository)
    private SagaClient sagaClient = Mock(SagaClient)
    private ClientRepository clientRepository = Mock(ClientRepository)

    private IRoleMemberService iRoleMemberService
    private int count = 3

    def setup() {
        iRoleMemberService = new IRoleMemberServiceImpl(userRepository, memberRoleRepository, labelRepository, sagaClient, memberRoleMapper, clientRepository)

        Field field = iRoleMemberService.getClass().getDeclaredField("devopsMessage")
        field.setAccessible(true)
        field.set(iRoleMemberService, true)
    }

    def "InsertAndSendEvent"() {
        given: "构造请求参数"
        MemberRoleDTO memberRole = new MemberRoleDTO()
        String loginName = "name"
        List<MemberRoleDTO> memberRoleES = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            MemberRoleDTO memberRoleE = new MemberRoleDTO()
            memberRoleE.setId(1L)
            memberRoleE.setRoleId(1L)
            memberRoleE.setMemberId(1L)
            memberRoleE.setSourceId(0L)
            memberRoleE.setMemberType("user")
            memberRoleE.setSourceType("site")
            memberRoleES << memberRoleE
        }

        when: "调用方法"
        iRoleMemberService.insertAndSendEvent(memberRole, loginName)

        then: "校验结果"
        1 * memberRoleMapper.insertSelective(_) >> { 1 }
        1 * memberRoleRepository.select(_) >> { memberRoleES }
        1 * labelRepository.selectLabelNamesInRoleIds(_)
        1 * sagaClient.startSaga(_, _ as StartInstanceDTO)
        0 * _
    }

    def "InsertOrUpdateRolesByMemberId"() {
        given: "构造请求参数"
        Boolean isEdit = true
        Long sourceId = 1L
        Long memberId = 1L
        List<MemberRoleDTO> memberRoleEList = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            MemberRoleDTO memberRoleE = new MemberRoleDTO()
            memberRoleE.setId(1L)
            memberRoleE.setRoleId(i)
            memberRoleE.setMemberId(1L)
            memberRoleE.setSourceId(0L)
            memberRoleE.setMemberType("user")
            memberRoleE.setSourceType("site")
//            MemberRoleE memberRoleE = new MemberRoleE(1L, i, 1L,
//                    "user", 0L, "site")
            memberRoleEList << memberRoleE
        }
        List<MemberRoleDTO> existingMemberRoleEList = new ArrayList<>()
        for (int i = 1; i < count + 1; i++) {
            MemberRoleDTO memberRoleE = new MemberRoleDTO()
            memberRoleE.setId(1L)
            memberRoleE.setRoleId(i)
            memberRoleE.setMemberId(1L)
            memberRoleE.setSourceId(0L)
            memberRoleE.setMemberType("user")
            memberRoleE.setSourceType("site")
            existingMemberRoleEList << memberRoleE
        }
        String sourceType = "site"
        List<Long> longList = new ArrayList<>()
        longList << 1L
        Set<String> set = new HashSet<>()
        set << "label"
        UserDTO user = new UserDTO()
        user.setPassword("123456")

        when: "调用方法"
        iRoleMemberService.insertOrUpdateRolesOfUserByMemberId(isEdit, sourceId, memberId, memberRoleEList, sourceType)

        then: "校验结果"
        1 * labelRepository.selectLabelNamesInRoleIds(_) >> { set }
        1 * userRepository.selectByPrimaryKey(_) >> { user }
        1 * memberRoleRepository.select(_) >> { existingMemberRoleEList }
        1 * memberRoleRepository.insertSelective(_)
        1 * memberRoleRepository.selectDeleteList(_, _, _, _, _) >> { longList }
        1 * memberRoleRepository.deleteById(_)
        1 * memberRoleRepository.select(_) >> { memberRoleEList }
        1 * sagaClient.startSaga(_, _ as StartInstanceDTO)
    }

    def "Delete"() {
        given: "构造请求参数"
        String sourceType = "site"
        List<Long> list = new ArrayList<>()
        list << 1L
        Map<Long, List<Long>> map = new HashMap<>()
        map.put(1L, list)
        RoleAssignmentDeleteDTO roleAssignmentDeleteDTO = new RoleAssignmentDeleteDTO()
        roleAssignmentDeleteDTO.setView("roleView")
        roleAssignmentDeleteDTO.setData(map)
        roleAssignmentDeleteDTO.setSourceId(1L)
        MemberRoleDTO memberRoleDO = new MemberRoleDTO()
        UserDTO user = new UserDTO()
        user.setPassword("123456")

        when: "调用方法"
        iRoleMemberService.delete(roleAssignmentDeleteDTO, sourceType)

        then: "校验结果"
        1 * memberRoleRepository.selectOne(_) >> { memberRoleDO }
        1 * memberRoleRepository.deleteById(_)
        1 * userRepository.selectByPrimaryKey(_) >> { user }
        1 * sagaClient.startSaga(_, _ as StartInstanceDTO)
        0 * _
    }
}
