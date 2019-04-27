package io.choerodon.iam.domain.service.impl

import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.domain.iam.entity.UserE
import io.choerodon.iam.domain.repository.UserRepository
import io.choerodon.iam.infra.feign.NotifyFeignClient
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class IUserServiceImplSpec extends Specification {
    private UserRepository userRepository = Mock(UserRepository)
    private NotifyFeignClient notifyFeignClient = Mock(NotifyFeignClient)
    private IUserServiceImpl iUserService

    def setup() {
        iUserService = new IUserServiceImpl(userRepository, notifyFeignClient)
    }

    def "SendNotice"() {
        given: "构造请求参数"
        Long fromUserId = 1L
        List<Long> userIds = new ArrayList<>()
        userIds.add(fromUserId)
        String code = "addUser"
        Map<String, Object> params = new HashMap<>()
        UserE userE = new UserE("123456")

        when: "调用方法"
        iUserService.sendNotice(fromUserId, userIds, code, params, 0L)

        then: "校验结果"
        1 * userRepository.selectByPrimaryKey(_) >> userE
        1 * notifyFeignClient.postNotice(_)
        0 * _
    }
}
