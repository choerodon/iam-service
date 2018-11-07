package io.choerodon.iam.domain.service.impl

import io.choerodon.asgard.saga.dto.StartInstanceDTO
import io.choerodon.asgard.saga.feign.SagaClient
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.RoleAssignmentDeleteDTO
import io.choerodon.iam.domain.iam.entity.MemberRoleE
import io.choerodon.iam.domain.iam.entity.UserE
import io.choerodon.iam.domain.repository.ClientRepository
import io.choerodon.iam.domain.repository.LabelRepository
import io.choerodon.iam.domain.repository.MemberRoleRepository
import io.choerodon.iam.domain.repository.UserRepository
import io.choerodon.iam.domain.service.IRoleMemberService
import io.choerodon.iam.infra.dataobject.MemberRoleDO
import io.choerodon.iam.infra.mapper.MemberRoleMapper
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import java.lang.reflect.Field

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
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
        MemberRoleDO memberRole = new MemberRoleDO()
        String loginName = "name"
        List<MemberRoleE> memberRoleES = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            MemberRoleE memberRoleE = new MemberRoleE(1L, 1L, 1L,
                    "user", 0L, "site")
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
        List<MemberRoleE> memberRoleEList = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            MemberRoleE memberRoleE = new MemberRoleE(1L, i, 1L,
                    "user", 0L, "site")
            memberRoleEList << memberRoleE
        }
        List<MemberRoleE> existingMemberRoleEList = new ArrayList<>()
        for (int i = 1; i < count + 1; i++) {
            MemberRoleE memberRoleE = new MemberRoleE(1L, i, 1L,
                    "user", 0L, "site")
            existingMemberRoleEList << memberRoleE
        }
        String sourceType = "site"
        List<Long> longList = new ArrayList<>()
        longList << 1L
        Set<String> set = new HashSet<>()
        set << "label"

        when: "调用方法"
        iRoleMemberService.insertOrUpdateRolesOfUserByMemberId(isEdit, sourceId, memberId, memberRoleEList, sourceType)

        then: "校验结果"
        1 * labelRepository.selectLabelNamesInRoleIds(_) >> { set }
        1 * userRepository.selectByPrimaryKey(_) >> { new UserE("123456") }
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
        MemberRoleDO memberRoleDO = new MemberRoleDO()

        when: "调用方法"
        iRoleMemberService.delete(roleAssignmentDeleteDTO, sourceType)

        then: "校验结果"
        1 * memberRoleRepository.selectOne(_) >> { memberRoleDO }
        1 * memberRoleRepository.deleteById(_)
        1 * userRepository.selectByPrimaryKey(_) >> { new UserE("123456") }
        1 * sagaClient.startSaga(_, _ as StartInstanceDTO)
        0 * _
    }
}
