package io.choerodon.iam

import com.fasterxml.jackson.databind.ObjectMapper
import com.netflix.appinfo.InstanceInfo
import io.choerodon.core.oauth.CustomUserDetails
import io.choerodon.iam.api.dto.LdapConnectionDTO
import io.choerodon.iam.app.service.LdapService
import io.choerodon.iam.app.service.impl.LdapServiceImpl
import io.choerodon.iam.infra.dto.LdapDTO
import io.choerodon.liquibase.LiquibaseConfig
import io.choerodon.liquibase.LiquibaseExecutor
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.cloud.client.ServiceInstance
import org.springframework.cloud.client.discovery.DiscoveryClient
import org.springframework.cloud.netflix.eureka.EurekaDiscoveryClient
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.context.annotation.Primary
import org.springframework.http.HttpRequest
import org.springframework.http.client.ClientHttpRequestExecution
import org.springframework.http.client.ClientHttpRequestInterceptor
import org.springframework.http.client.ClientHttpResponse
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory
import org.springframework.ldap.core.LdapTemplate
import org.springframework.security.jwt.JwtHelper
import org.springframework.security.jwt.crypto.sign.MacSigner
import org.springframework.security.jwt.crypto.sign.Signer

import javax.annotation.PostConstruct

/**
 * @author dongfan117@gmail.com
 */
@TestConfiguration
@Import(LiquibaseConfig)
class IntegrationTestConfiguration {

    @Value('${choerodon.oauth.jwt.key:choerodon}')
    String key

    @Autowired
    TestRestTemplate testRestTemplate

    @Autowired
    LiquibaseExecutor liquibaseExecutor

    final ObjectMapper objectMapper = new ObjectMapper()

    @Bean
    LdapService LdapService() {
        LdapService ldapService = Mockito.mock(LdapService)
        LdapConnectionDTO dto = new LdapConnectionDTO()
        dto.setMatchAttribute(true)
        dto.setCanLogin(true)
        dto.setCanConnectServer(true)
        LdapTemplate ldapTemplate = Mockito.mock(LdapTemplate)
        Map<String, Object> map = new HashMap<>(2)
        map.put(LdapServiceImpl.LDAP_CONNECTION_DTO, dto)
        map.put(LdapServiceImpl.LDAP_TEMPLATE, ldapTemplate)
        Mockito.doReturn(map).when(ldapService).testConnect(Mockito.any(LdapDTO.class))
        return ldapService
    }

    @Bean("mockDiscoveryClient")
    @Primary
    DiscoveryClient discoveryClient() {
        DiscoveryClient discoveryClient = Mockito.mock(DiscoveryClient)
        Mockito.doReturn(["iam-service"]).when(discoveryClient).getServices()
        String instanceJson = '{"instanceId":"localhost:iam-service:8030","app":"IAM-SERVICE","appGroupName":null,"ipAddr":"172.31.176.1","sid":"na","homePageUrl":"http://172.31.176.1:8030/","statusPageUrl":"http://172.31.176.1:8031/info","healthCheckUrl":"http://172.31.176.1:8031/health","secureHealthCheckUrl":null,"vipAddress":"iam-service","secureVipAddress":"iam-service","countryId":1,"dataCenterInfo":{"@class":"com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo","name":"MyOwn"},"hostName":"172.31.176.1","status":"UP","leaseInfo":{"renewalIntervalInSecs":1,"durationInSecs":3,"registrationTimestamp":1533216528607,"lastRenewalTimestamp":1533216528607,"evictionTimestamp":0,"serviceUpTimestamp":1533216528100},"isCoordinatingDiscoveryServer":false,"metadata":{},"lastUpdatedTimestamp":1533216528607,"lastDirtyTimestamp":1533208711227,"actionType":"ADDED","asgName":null,"overriddenStatus":"UNKNOWN"}'
        InstanceInfo instanceInfo = objectMapper.readValue(instanceJson, InstanceInfo)
        EurekaDiscoveryClient.EurekaServiceInstance eurekaServiceInstance = new EurekaDiscoveryClient.EurekaServiceInstance(instanceInfo)
        ServiceInstance serviceInstance = (ServiceInstance) eurekaServiceInstance
        ArrayList<ServiceInstance> serviceInstances = new ArrayList<ServiceInstance>()
        serviceInstances << serviceInstance
        Mockito.doReturn(serviceInstances).when(discoveryClient).getInstances("iam-service")
        return discoveryClient
    }

    @PostConstruct
    void init() {
        liquibaseExecutor.execute()
        setTestRestTemplateJWT()
    }

    private void setTestRestTemplateJWT() {
        testRestTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory())
        testRestTemplate.getRestTemplate().setInterceptors([new ClientHttpRequestInterceptor() {
            @Override
            ClientHttpResponse intercept(HttpRequest httpRequest, byte[] bytes, ClientHttpRequestExecution clientHttpRequestExecution) throws IOException {
                httpRequest.getHeaders()
                        .add('Authorization', createJWT(key, objectMapper))
                return clientHttpRequestExecution.execute(httpRequest, bytes)
            }
        }])
    }

    static String createJWT(final String key, final ObjectMapper objectMapper) {
        Signer signer = new MacSigner(key)
        CustomUserDetails defaultUserDetails = new CustomUserDetails('default', 'unknown', Collections.emptyList())
        defaultUserDetails.setUserId(0L)
        defaultUserDetails.setOrganizationId(0L)
        defaultUserDetails.setLanguage('zh_CN')
        defaultUserDetails.setTimeZone('CCT')
        String jwtToken = null
        try {
            jwtToken = 'Bearer ' + JwtHelper.encode(objectMapper.writeValueAsString(defaultUserDetails), signer).getEncoded()
        } catch (IOException e) {
            e.printStackTrace()
        }
        return jwtToken
    }


}
