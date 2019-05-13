package io.choerodon.iam.app.service.impl

import com.github.pagehelper.PageHelper
import io.choerodon.core.domain.Page
import io.choerodon.core.exception.CommonException
import io.choerodon.core.oauth.CustomUserDetails
import io.choerodon.core.oauth.DetailsHelper
import io.choerodon.iam.domain.oauth.entity.UserAccessTokenE
import io.choerodon.iam.infra.dto.AccessTokenDTO
import io.choerodon.iam.infra.dto.ClientDTO
import io.choerodon.iam.infra.dto.RefreshTokenDTO
import io.choerodon.iam.infra.dto.UserDTO
import io.choerodon.iam.infra.feign.OauthTokenFeignClient
import io.choerodon.iam.infra.mapper.AccessTokenMapper
import io.choerodon.iam.infra.mapper.RefreshTokenMapper
import io.choerodon.iam.infra.repository.impl.UserRepositoryImpl
import org.junit.runner.RunWith
import org.mockito.Mockito
import org.powermock.api.mockito.PowerMockito
import org.powermock.core.classloader.annotations.PrepareForTest
import org.powermock.modules.junit4.PowerMockRunner
import org.powermock.modules.junit4.PowerMockRunnerDelegate
import org.spockframework.runtime.Sputnik
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken
import org.springframework.security.oauth2.common.util.SerializationUtils
import spock.lang.Shared
import spock.lang.Specification

/**
 * @author Eugen*   */
@RunWith(PowerMockRunner)
@PowerMockRunnerDelegate(Sputnik)
@PrepareForTest([PageHelper, DetailsHelper])
class AccessTokenServiceImplSpec extends Specification {
    private AccessTokenMapper accessTokenMapper = Mock(AccessTokenMapper)
    private RefreshTokenMapper refreshTokenMapper = Mock(RefreshTokenMapper)
    private UserRepositoryImpl userRepository = Mock(UserRepositoryImpl)
    private OauthTokenFeignClient oauthTokenFeignClient = Mock(OauthTokenFeignClient)

    private AccessTokenServiceImpl accessTokenService = new AccessTokenServiceImpl(accessTokenMapper, refreshTokenMapper, userRepository, oauthTokenFeignClient)

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
//    @Shared
//    def needClean = false
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

    def "PagingTokensByUserIdAndClient"() {
        given: "数据准备"
        def userId = user.getId()
        def clientName = client.getName()
        and: "mock"
        userRepository.selectByPrimaryKey(userId) >> { return user }
        PowerMockito.mockStatic(DetailsHelper)
        CustomUserDetails customUserDetails = Mock(CustomUserDetails)
        customUserDetails.getUserId() >> 2L
        PowerMockito.when(DetailsHelper.getUserDetails()).thenReturn(customUserDetails)


        when: "用户不存在"
        accessTokenService.pagedSearch(1, 20, clientName, ((DefaultOAuth2AccessToken) SerializationUtils.deserialize(accessTokenList.get(0).getToken())).getValue())
        then: "结果分析"
        def e = thrown(CommonException)
        e.message == "error.user.not.exist"
    }

    def "pageConvert"() {
        given: "数据准备"
        Page<UserAccessTokenE> pageBack = new Page<>();
        pageBack.setNumber(0)
        pageBack.setNumberOfElements(1)
        pageBack.setSize(20)
        pageBack.setTotalElements(1)
        pageBack.setTotalPages(1)
        def userList = new ArrayList<UserAccessTokenE>()
        def usertokenE = new UserAccessTokenE()
        usertokenE.setTokenId(accessTokenList.get(0).getTokenId())
        usertokenE.setClientId(accessTokenList.get(0).getClientId())
        usertokenE.setToken(accessTokenList.get(0).getToken())
        usertokenE.setAccessTokenValidity(new Long(300))
        def usertokenE2 = new UserAccessTokenE()
        usertokenE2.setTokenId(accessTokenList.get(1).getTokenId())
        usertokenE2.setClientId(accessTokenList.get(1).getClientId())
        usertokenE2.setToken(accessTokenList.get(1).getToken())
        usertokenE2.setAccessTokenValidity(new Long(300))
        userList.add(usertokenE)
        userList.add(usertokenE2)
        pageBack.setContent(userList)

//        PageRequest pageRequest = new PageRequest(0, 20)


        and: "mock"
        accessTokenMapper.selectTokens(_, _) >> { return userList }
        PowerMockito.mockStatic(PageHelper)
        PowerMockito.when(PageHelper.doPageAndSort(Mockito.any(), Mockito.any())).thenReturn(pageBack)

        when: "用户不存在"
        accessTokenService.pageConvert(1, 20, "loginName", "clientName", ((DefaultOAuth2AccessToken) SerializationUtils.deserialize(accessTokenList.get(1).getToken())).getValue())
        then: "结果分析"
        noExceptionThrown()
    }


    def "Delete[EmptyToken]"() {
        when: "删除空token错误"
        accessTokenService.delete("null_tokenId", ((DefaultOAuth2AccessToken) SerializationUtils.deserialize(accessTokenList.get(0).getToken())).getValue())
        then: "token不存在异常"
        def e = thrown(CommonException)
        e.message == "error.token.not.exist"
    }

    def "Delete"() {
        given: "mock"
        accessTokenMapper.selectByPrimaryKey(_) >> { return accessTokenList.get(0) }
        when: "删除当前token错误"
        accessTokenService.delete(accessTokenList.get(0).getTokenId(), ((DefaultOAuth2AccessToken) SerializationUtils.deserialize(accessTokenList.get(0).getToken())).getValue())
        then: "不可删除当前token"
        def e1 = thrown(CommonException)
        e1.message == "error.delete.current.token"

        when: "删除成功"
        accessTokenService.delete(accessTokenList.get(0).getTokenId(), ((DefaultOAuth2AccessToken) SerializationUtils.deserialize(accessTokenList.get(1).getToken())).getValue())

        then: "删除成功"
        noExceptionThrown()
    }
}
