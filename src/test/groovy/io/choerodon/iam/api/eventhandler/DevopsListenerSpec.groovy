package io.choerodon.iam.api.eventhandler

import io.choerodon.asgard.saga.dto.StartInstanceDTO
import io.choerodon.asgard.saga.feign.SagaClient
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.infra.dto.MemberRoleDTO
import io.choerodon.iam.infra.mapper.LabelMapper
import io.choerodon.iam.infra.mapper.MemberRoleMapper
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan* */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class DevopsListenerSpec extends Specification {
    private MemberRoleMapper memberRoleMapper = Mock(MemberRoleMapper)
    private LabelMapper labelMapper = Mock(LabelMapper)
    private SagaClient sagaClient = Mock(SagaClient)
    private DevopsListener devopsListener = new DevopsListener(memberRoleMapper,sagaClient,labelMapper)
    int count = 3

    def "AssignRolesOnProject"() {
        given: "构造请求参数"
        String message = "message"
        List<MemberRoleDTO> memberRoles = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            MemberRoleDTO memberRoleDO = new MemberRoleDTO()
            memberRoleDO.setSourceId(i)
            memberRoleDO.setMemberId(i)
            memberRoleDO.setSourceType("site")
            memberRoleDO.setMemberType("user")
            memberRoles.add(memberRoleDO)
        }

        when: "调用方法"
        devopsListener.assignRolesOnProject(message)

        then: "校验结果"
        1 * memberRoleMapper.select(_) >> { memberRoles }
        count * labelMapper.selectLabelNamesInRoleIds(_) >> { new HashSet<String>() }
        1 * sagaClient.startSaga(_, _ as StartInstanceDTO)
        0 * _
    }
}
