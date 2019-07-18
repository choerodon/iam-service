package io.choerodon.iam.api.eventhandler

import com.fasterxml.jackson.databind.ObjectMapper
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.payload.UserEventPayload
import io.choerodon.iam.app.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan* */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class NotifyListenerSpec extends Specification {

    private UserService userService=Mock(UserService)
    private NotifyListener notifyListener = new NotifyListener(userService)
    private final ObjectMapper mapper = new ObjectMapper()

    def "Create"() {
        given: "构造请求参数"
        UserEventPayload eventPayload = new UserEventPayload()
        eventPayload.setFromUserId(1L)
        eventPayload.setOrganizationId(1L)
        List<UserEventPayload> userEventPayloads = new ArrayList<>()
        userEventPayloads.add(eventPayload)
        String message = mapper.writeValueAsString(userEventPayloads)

        when: "调用方法"
        notifyListener.create(message)

        then: "校验结果"
        1 * userService.sendNotice(_, _, _, _, _)
    }
}
