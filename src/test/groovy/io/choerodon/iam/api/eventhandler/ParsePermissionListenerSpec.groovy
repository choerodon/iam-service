//package io.choerodon.iam.api.eventhandler
//
//import io.choerodon.eureka.event.EurekaEventPayload
//import io.choerodon.iam.domain.service.ParsePermissionService
//import spock.lang.Specification
//
//class ParsePermissionListenerSpec extends Specification {
//
//    def "test receiveUpEvent"() {
//        given:
//        def service = Mock(ParsePermissionService)
//        def listener = new ParsePermissionListener(service)
//        when:
//        listener.receiveUpEvent(new EurekaEventPayload())
//
//        then:
//        1 * service.parser(_)
//    }
//
//}
