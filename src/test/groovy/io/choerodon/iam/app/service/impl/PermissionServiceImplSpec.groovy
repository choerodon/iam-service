package io.choerodon.iam.app.service.impl

import com.fasterxml.jackson.databind.ObjectMapper
import com.netflix.appinfo.InstanceInfo
import io.choerodon.core.convertor.ConvertHelper
import io.choerodon.core.oauth.DetailsHelper
import io.choerodon.iam.api.dto.CheckPermissionDTO
import io.choerodon.iam.app.service.PermissionService
import io.choerodon.iam.domain.repository.MenuPermissionRepository
import io.choerodon.iam.domain.repository.PermissionRepository
import io.choerodon.iam.domain.repository.RolePermissionRepository
import io.choerodon.iam.infra.common.utils.SpockUtils
import io.choerodon.iam.infra.dto.PermissionDTO
import io.choerodon.iam.infra.mapper.OrganizationMapper
import io.choerodon.iam.infra.mapper.ProjectMapper
import org.junit.runner.RunWith
import org.mockito.Mockito
import org.powermock.api.mockito.PowerMockito
import org.powermock.core.classloader.annotations.PrepareForTest
import org.powermock.modules.junit4.PowerMockRunner
import org.powermock.modules.junit4.PowerMockRunnerDelegate
import org.spockframework.runtime.Sputnik
import org.springframework.cloud.client.ServiceInstance
import org.springframework.cloud.client.discovery.DiscoveryClient
import org.springframework.cloud.netflix.eureka.EurekaDiscoveryClient
import spock.lang.Specification

/**
 * @author dengyouquan
 * */
@RunWith(PowerMockRunner)
@PowerMockRunnerDelegate(Sputnik)
@PrepareForTest([DetailsHelper, ConvertHelper, PermissionServiceImpl])
class PermissionServiceImplSpec extends Specification {
    private PermissionRepository permissionRepository = Mock(PermissionRepository)
    private RolePermissionRepository rolePermissionRepository = Mock(RolePermissionRepository)
    private DiscoveryClient discoveryClient = Mockito.mock(DiscoveryClient)
    private MenuPermissionRepository menuPermissionRepository = Mock(MenuPermissionRepository)
    private OrganizationMapper organizationMapper = Mock(OrganizationMapper)
    private ProjectMapper projectMapper = Mock(ProjectMapper)
    private PermissionService permissionService
    final ObjectMapper objectMapper = new ObjectMapper()
    private Long userId

    def setup() {
        given: "构造userService"
        permissionService = PowerMockito.spy(new PermissionServiceImpl(permissionRepository,
                discoveryClient, rolePermissionRepository, menuPermissionRepository,
                organizationMapper, projectMapper))

        def file = new File(this.class.getResource('/templates/swagger.json').toURI())
        PowerMockito.doReturn(file.getText("UTF-8")).when(permissionService, "fetchSwaggerJson", Mockito.any())

        and: "mock静态方法-CustomUserDetails"
        PowerMockito.mockStatic(DetailsHelper)
        PowerMockito.when(DetailsHelper.getUserDetails()).thenReturn(SpockUtils.getNotAdminCustomUserDetails())
        userId = DetailsHelper.getUserDetails().getUserId()

        and: "mock discaryCLient"
        Mockito.doReturn(["iam-service"]).when(discoveryClient).getServices()
        String instanceJson = '{"instanceId":"localhost:iam-service:8030","app":"IAM-SERVICE","appGroupName":null,"ipAddr":"172.31.176.1","sid":"na","homePageUrl":"http://172.31.176.1:8030/","statusPageUrl":"http://172.31.176.1:8031/info","healthCheckUrl":"http://172.31.176.1:8031/health","secureHealthCheckUrl":null,"vipAddress":"iam-service","secureVipAddress":"iam-service","countryId":1,"dataCenterInfo":{"@class":"com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo","name":"MyOwn"},"hostName":"172.31.176.1","status":"UP","leaseInfo":{"renewalIntervalInSecs":1,"durationInSecs":3,"registrationTimestamp":1533216528607,"lastRenewalTimestamp":1533216528607,"evictionTimestamp":0,"serviceUpTimestamp":1533216528100},"isCoordinatingDiscoveryServer":false,"metadata":{},"lastUpdatedTimestamp":1533216528607,"lastDirtyTimestamp":1533208711227,"actionType":"ADDED","asgName":null,"overriddenStatus":"UNKNOWN"}'
        InstanceInfo instanceInfo = objectMapper.readValue(instanceJson, InstanceInfo)
        EurekaDiscoveryClient.EurekaServiceInstance eurekaServiceInstance = new EurekaDiscoveryClient.EurekaServiceInstance(instanceInfo)
        ServiceInstance serviceInstance = (ServiceInstance) eurekaServiceInstance
        ArrayList<ServiceInstance> serviceInstances = new ArrayList<ServiceInstance>()
        serviceInstances << serviceInstance
        Mockito.doReturn(serviceInstances).when(discoveryClient).getInstances("iam-service")
    }

    def "CheckPermission"() {
        given: "构造请求参数"
        List<CheckPermissionDTO> checkPermissionDTOList = new ArrayList<>()
        for (int i = 0; i < 3; i++) {
            CheckPermissionDTO checkPermissionDTO = new CheckPermissionDTO()
            checkPermissionDTO.setResourceType("organization")
            checkPermissionDTO.setCode("organization")
            checkPermissionDTO.setOrganizationId(1L)
            checkPermissionDTOList.add(checkPermissionDTO)
        }
        for (int i = 0; i < 3; i++) {
            CheckPermissionDTO checkPermissionDTO = new CheckPermissionDTO()
            checkPermissionDTO.setResourceType("site")
            checkPermissionDTO.setOrganizationId(1L)
            checkPermissionDTO.setCode("site")
            checkPermissionDTOList.add(checkPermissionDTO)
        }
        for (int i = 0; i < 3; i++) {
            CheckPermissionDTO checkPermissionDTO = new CheckPermissionDTO()
            checkPermissionDTO.setResourceType("project")
            checkPermissionDTO.setCode("project")
            checkPermissionDTO.setProjectId(1L)
            checkPermissionDTOList.add(checkPermissionDTO)
        }
        Set<String> set = new HashSet<>()
        set.add("site")

        when: "调用方法"
        permissionService.checkPermission(checkPermissionDTOList)

        then: "校验结果"
        permissionRepository.checkPermission(_, _, _, _) >> { set }
    }

    def "DeleteByCode"() {
        given: "构造请求参数"
        String code = "code"
        PermissionDTO permission = new PermissionDTO()
        permission.setCode(code)
        permission.setPath("path")
        permission.setMethod("method")
        permission.setResourceLevel("level")
        permission.setDescription("description")
        permission.setAction("action")
        permission.setController("resource")
        permission.setPublicAccess(true)
        permission.setLoginAccess(true)
        permission.setWithin(true)
        permission.setServiceCode("iam-service")


        List<ServiceInstance> serviceInstances = new ArrayList<>()

        when: "调用方法"
        //"iam-service.route.create"
        permissionService.deleteByCode("code")

        then: "校验结果"
        1 * permissionRepository.selectByCode(_) >> { permission }
        1 * permissionRepository.deleteById(_)
        1 * rolePermissionRepository.delete(_)
        1 * menuPermissionRepository.delete(_)
    }
}
