package io.choerodon.iam.app.service.impl

import com.github.pagehelper.PageHelper
import io.choerodon.core.exception.CommonException
import io.choerodon.core.oauth.CustomUserDetails
import io.choerodon.core.oauth.DetailsHelper
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.infra.asserts.UserAssertHelper
import io.choerodon.iam.infra.dto.AccessTokenDTO
import io.choerodon.iam.infra.dto.ClientDTO
import io.choerodon.iam.infra.dto.RefreshTokenDTO
import io.choerodon.iam.infra.dto.UserDTO
import io.choerodon.iam.infra.feign.OauthTokenFeignClient
import io.choerodon.iam.infra.mapper.AccessTokenMapper
import io.choerodon.iam.infra.mapper.RefreshTokenMapper
import org.junit.runner.RunWith
import org.powermock.api.mockito.PowerMockito
import org.powermock.core.classloader.annotations.PrepareForTest
import org.powermock.modules.junit4.PowerMockRunner
import org.powermock.modules.junit4.PowerMockRunnerDelegate
import org.spockframework.runtime.Sputnik
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken
import org.springframework.security.oauth2.common.util.SerializationUtils
import org.springframework.transaction.annotation.Transactional
import spock.lang.Shared
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 *
 * @author Eugen
 */
@RunWith(PowerMockRunner)
@PowerMockRunnerDelegate(Sputnik)
@PrepareForTest([DetailsHelper])
class AccessTokenServiceImplSpec extends Specification {
    private AccessTokenMapper accessTokenMapper = Mock(AccessTokenMapper)
    private RefreshTokenMapper refreshTokenMapper = Mock(RefreshTokenMapper)
    private OauthTokenFeignClient oauthTokenFeignClient = Mock(OauthTokenFeignClient)
    private UserAssertHelper userAssertHelper = Mock(UserAssertHelper)

    private AccessTokenServiceImpl accessTokenService =
            new AccessTokenServiceImpl(accessTokenMapper, refreshTokenMapper, oauthTokenFeignClient, userAssertHelper)

    @Shared
    def accessTokenList = new ArrayList<AccessTokenDTO>()
    @Shared
    def refreshTokenList = new ArrayList<RefreshTokenDTO>()
    @Shared
    def user = new UserDTO()
    @Shared
    def client = new ClientDTO()

    @Shared
    def needInit = true
    def count = 3

    def setup() {
        user.setId(1)
        user.setLoginName("testUser")

        if (needInit) {
            given: "构造参数"
            needInit = false

            client.setId(1L)
            client.setName("testClient")
            client.setAccessTokenValidity(120)

            for (int i = 0; i < count; i++) {

                AccessTokenDTO accessToken = new AccessTokenDTO()
                accessToken.setClientId(client.getName())
                accessToken.setUserName(user.getLoginName())
                accessToken.setTokenId(i * i + "00c40debf9959f11844cec62f9a2f14")
                accessToken.setTokenId(i.toString())
                DefaultOAuth2AccessToken token = new DefaultOAuth2AccessToken()
                token.setValue(i + "9574c75-e00f-463e-b376-4d1f961acade")
                token.setExpiration(new Date(new Date().getTime() - 3600))
                accessToken.setToken(SerializationUtils.serialize(token))
                accessToken.setAuthentication((i + "" + i).bytes)
                accessToken.setRefreshToken(i + "3453c75-e00f-463e-b376-4d1f961descf")
                accessTokenList.add(accessToken)
                RefreshTokenDTO refreshToken = new RefreshTokenDTO()
                refreshToken.setTokenId(accessToken.getRefreshToken())
                refreshToken.setToken(SerializationUtils.serialize(i + "oaleic75-sfgf-433e-b33e-4d1fyehsndje"))
                refreshToken.setAuthentication((i + "" + i).bytes)
                refreshTokenList.add(refreshToken)
            }
        }
    }

    @Transactional
    def "pagedSearch"() {
        given:
        AccessTokenDTO dto = new AccessTokenDTO()
        dto.setTokenId("0001419a84132ec887b9f4222934a42d")

        DefaultOAuth2AccessToken token = new DefaultOAuth2AccessToken()
        token.setValue("9574c75-e00f-463e-b376-4d1f961acade")
        token.setExpiration(new Date(new Date().getTime() - 3600))

        dto.setToken(SerializationUtils.serialize(token))
        dto.setAuthenticationId("0001419a84132ec887b9f4222934a42d")
        dto.setUserName("user")
        dto.setClientId("client")
        dto.setAuthentication("authentication".bytes)
        dto.setRefreshToken("0001419a84132ec887b9f4222934a42d")
        List<AccessTokenDTO> list = new ArrayList<>()
        list << dto

        and:
        PowerMockito.mockStatic(DetailsHelper)
        CustomUserDetails userDetails = Mock(CustomUserDetails)
        PowerMockito.when(DetailsHelper.getUserDetails()).thenReturn(userDetails)
        userDetails.getUserId() >> 1L

        UserDTO userDTO = Mock(UserDTO)

        userAssertHelper.userNotExisted(_) >> userDTO
        userDTO.getLoginName() >> "user"

        and:
        accessTokenMapper.selectTokens(_, _) >> list

        when:
        def entity = accessTokenService.pagedSearch(1, 20, "client", "9574c75-e00f-463e-b376-4d1f961acade")

        then:
        !entity.list.isEmpty()
    }


    def "Delete"() {
        given:
        AccessTokenDTO dto = new AccessTokenDTO()
        dto.setTokenId("0001419a84132ec887b9f4222934a42d")
        DefaultOAuth2AccessToken token = new DefaultOAuth2AccessToken()
        token.setValue("9574c75-e00f-463e-b376-4d1f961acade")
        token.setExpiration(new Date(new Date().getTime() - 3600))

        dto.setToken(SerializationUtils.serialize(token))
        dto.setAuthenticationId("0001419a84132ec887b9f4222934a42d")
        dto.setUserName("user")
        dto.setClientId("client")
        dto.setAuthentication("authentication".bytes)
        dto.setRefreshToken("0001419a84132ec887b9f4222934a42d")

        and:
        accessTokenMapper.selectByPrimaryKey(_) >> dto

        when:
        accessTokenService.delete("0001419a84132ec887b9f4222934a42d", "0001419a84132ec887b9f4222934a42d")
        then:
        1 * oauthTokenFeignClient.deleteToken(_)
        noExceptionThrown()
    }
}
