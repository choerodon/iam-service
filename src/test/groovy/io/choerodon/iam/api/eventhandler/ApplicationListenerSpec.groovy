package io.choerodon.iam.api.eventhandler

import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.payload.DevOpsAppSyncPayload

import io.choerodon.iam.infra.asserts.OrganizationAssertHelper
import io.choerodon.iam.infra.asserts.ProjectAssertHelper
import io.choerodon.iam.infra.dto.ApplicationDTO
import io.choerodon.iam.infra.dto.ApplicationExplorationDTO
import io.choerodon.iam.infra.mapper.ApplicationExplorationMapper
import io.choerodon.iam.infra.mapper.ApplicationMapper
import org.codehaus.jackson.map.ObjectMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class ApplicationListenerSpec extends Specification {
    @Autowired
    private ApplicationMapper applicationMapper
    @Autowired
    private ApplicationExplorationMapper applicationExplorationMapper
    private OrganizationAssertHelper organizationAssertHelper = Mock(OrganizationAssertHelper)
    private ProjectAssertHelper projectAssertHelper = Mock(ProjectAssertHelper)
    private static final String SEPARATOR = "/";
    private ObjectMapper objectMapper = new ObjectMapper()

    @Transactional
    def "updateApplicationAbnormal"() {
        given: "构造请求参数"
        ApplicationDTO applicationDTO = new ApplicationDTO();
        applicationDTO.setOrganizationId(803)
        applicationDTO.setProjectId(826)
        applicationDTO.setCode("test")
        applicationDTO.setName("test")
        applicationDTO.setEnabled(true)
        applicationDTO.setAbnormal(false)
        applicationDTO.setApplicationCategory("application")
        applicationDTO.setApplicationType("normal")
        applicationMapper.insertSelective(applicationDTO)
        applicationDTO = applicationMapper.selectOne(applicationDTO)
        ApplicationListener applicationListener = new ApplicationListener(applicationMapper,
                applicationExplorationMapper, organizationAssertHelper, projectAssertHelper)
        String message = objectMapper.writeValueAsString(applicationDTO)

        when: "调用方法"
        applicationListener.updateApplicationAbnormal(message)

        then: "校验结果"
        ApplicationDTO applicationDTO1 = new ApplicationDTO();
        applicationDTO1.setOrganizationId(803)
        applicationDTO1.setProjectId(826)
        applicationDTO1.setCode("test")
        applicationMapper.selectOne(applicationDTO1).getAbnormal()
    }

    @Transactional
    def "syncDeleteApplication"() {
        given: "构造请求参数"
        ApplicationDTO applicationDTO = new ApplicationDTO();
        applicationDTO.setOrganizationId(803)
        applicationDTO.setProjectId(826)
        applicationDTO.setCode("test")
        applicationDTO.setName("test")
        applicationDTO.setEnabled(true)
        applicationDTO.setAbnormal(false)
        applicationDTO.setApplicationCategory("application")
        applicationDTO.setApplicationType("normal")
        applicationMapper.insertSelective(applicationDTO)
        Long appId = applicationDTO.getId()
        String path = SEPARATOR + appId + SEPARATOR
        ApplicationExplorationDTO example = new ApplicationExplorationDTO()
        example.setApplicationId(appId);
        example.setPath(path);
        example.setApplicationEnabled(true);
        example.setRootId(appId);
        example.setHashcode(String.valueOf(path.hashCode()))
        applicationExplorationMapper.insertSelective(example)
        ApplicationListener applicationListener = new ApplicationListener(applicationMapper,
                applicationExplorationMapper, organizationAssertHelper, projectAssertHelper)
        DevOpsAppSyncPayload payload = new DevOpsAppSyncPayload()
        payload.setProjectId(applicationDTO.getProjectId())
        payload.setOrganizationId(applicationDTO.getOrganizationId())
        payload.setCode(applicationDTO.getCode())
        String message = objectMapper.writeValueAsString(payload)

        when: "调用方法"
        applicationListener.syncDeleteApplication(message)

        then: "校验结果"
        ApplicationDTO applicationDTO1 = new ApplicationDTO();
        applicationDTO1.setOrganizationId(803)
        applicationDTO1.setProjectId(826)
        applicationDTO1.setCode("test")
        applicationMapper.select(applicationDTO1).size() == 0
        applicationExplorationMapper.selectDescendantByPath(path).size() == 0
    }

    @Transactional
    def "syncApplicationActiveStatus"() {
        given: "构造请求参数"
        ApplicationDTO applicationDTO = new ApplicationDTO();
        applicationDTO.setOrganizationId(803)
        applicationDTO.setProjectId(826)
        applicationDTO.setCode("test")
        applicationDTO.setName("test")
        applicationDTO.setEnabled(false)
        applicationDTO.setAbnormal(false)
        applicationDTO.setApplicationCategory("application")
        applicationDTO.setApplicationType("normal")
        applicationMapper.insertSelective(applicationDTO)
        applicationDTO = applicationMapper.selectOne(applicationDTO)
        ApplicationListener applicationListener = new ApplicationListener(applicationMapper,
                applicationExplorationMapper, organizationAssertHelper, projectAssertHelper)

        DevOpsAppSyncPayload devOpsAppSyncPayload = new DevOpsAppSyncPayload()
        devOpsAppSyncPayload.setProjectId(applicationDTO.getProjectId())
        devOpsAppSyncPayload.setOrganizationId(applicationDTO.getOrganizationId())
        devOpsAppSyncPayload.setCode(applicationDTO.getCode())
        devOpsAppSyncPayload.setActive(true)
        String message = objectMapper.writeValueAsString(devOpsAppSyncPayload)
        when: "调用方法"
        applicationListener.syncApplicationActiveStatus(message)

        then: "校验结果"
        ApplicationDTO applicationDTO1 = new ApplicationDTO();
        applicationDTO1.setOrganizationId(803)
        applicationDTO1.setProjectId(826)
        applicationDTO1.setCode("test")
        applicationMapper.selectOne(applicationDTO1).getEnabled()
    }
}
