package io.choerodon.iam.app.service.impl;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.infra.dto.AccessTokenDTO;
import io.choerodon.iam.infra.dto.UserDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.util.SerializationUtils;
import org.springframework.stereotype.Service;

import io.choerodon.asgard.schedule.annotation.JobTask;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.app.service.AccessTokenService;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.infra.feign.OauthTokenFeignClient;
import io.choerodon.iam.infra.mapper.AccessTokenMapper;
import io.choerodon.iam.infra.mapper.RefreshTokenMapper;

/**
 * @author Eugen
 **/
@Service
public class AccessTokenServiceImpl implements AccessTokenService {
    private static final Logger logger = LoggerFactory.getLogger(AccessTokenServiceImpl.class);
    private AccessTokenMapper accessTokenMapper;
    private RefreshTokenMapper refreshTokenMapper;
    private UserRepository userRepository;
    private OauthTokenFeignClient oauthTokenFeignClient;

    public AccessTokenServiceImpl(AccessTokenMapper accessTokenMapper, RefreshTokenMapper refreshTokenMapper, UserRepository userRepository, OauthTokenFeignClient oauthTokenFeignClient) {
        this.accessTokenMapper = accessTokenMapper;
        this.refreshTokenMapper = refreshTokenMapper;
        this.userRepository = userRepository;
        this.oauthTokenFeignClient = oauthTokenFeignClient;
    }

    @Override
    public PageInfo<AccessTokenDTO> pagingTokensByUserIdAndClient(int page, int size, String clientName, String currentToken) {
        Long userId = DetailsHelper.getUserDetails().getUserId();
        UserDTO userDTO = userRepository.selectByPrimaryKey(userId);
        if (userDTO == null) {
            throw new CommonException("error.user.not.exist");
        }
        return pageConvert(page, size, userDTO.getLoginName(), clientName, currentToken);
    }

    public PageInfo<AccessTokenDTO> pageConvert(int page, int size, String loginName, String clientName, String currentToken) {
        //原分页信息
        PageInfo<AccessTokenDTO> pageInfo = PageHelper.startPage(page, size).doSelectPageInfo(() -> accessTokenMapper.selectTokens(loginName, clientName));
        //所有token信息
        List<AccessTokenDTO> userAccessTokens = accessTokenMapper.selectTokens(loginName, clientName);
        List<AccessTokenDTO> list = pageInfo.getList();
        if (list.isEmpty()) {
            return pageInfo;
        } else {
            //todo 此处还需优化修改
            //1.提取tokenDTO
            List<AccessTokenDTO> userAccessTokenDTOS = userAccessTokens.stream().map(token -> {
                AccessTokenDTO accessTokenDTO = new AccessTokenDTO();
                accessTokenDTO.setTokenId(token.getTokenId());
                accessTokenDTO.setClientId(token.getClientId());
                accessTokenDTO.setRedirectUri(token.getRedirectUri());
                DefaultOAuth2AccessToken defaultToken = SerializationUtils.deserialize(token.getToken());
                accessTokenDTO.setAccesstoken(defaultToken.getValue());
                accessTokenDTO.setExpirationTime(defaultToken.getExpiration());
                accessTokenDTO.setExpire(defaultToken.isExpired());
                accessTokenDTO.setCreateTime((Date) defaultToken.getAdditionalInformation().get("createTime"));
                accessTokenDTO.setCurrentToken(currentToken.equalsIgnoreCase(accessTokenDTO.getAccesstoken()));
                return accessTokenDTO;
            }).collect(Collectors.toList());
            //2.过滤老token（没有createTime）
            List<AccessTokenDTO> oldTokens = userAccessTokenDTOS.stream().filter(o1 -> o1.getCreateTime() == null).collect(Collectors.toList());
            //3.过滤并按创建时间将新token排序（有createTime）
            List<AccessTokenDTO> newAndSortedTokens = userAccessTokenDTOS.stream().filter(o1 -> o1.getCreateTime() != null).sorted(Comparator.comparing(AccessTokenDTO::getCreateTime).reversed()).collect(Collectors.toList());
            //4.排序：当前token + newAndSortedTokens + oldTokens
            List<AccessTokenDTO> resultDTO = userAccessTokenDTOS.stream().filter(o1 -> o1.getCurrentToken().equals(true)).collect(Collectors.toList());
            resultDTO.addAll(newAndSortedTokens.stream().filter(o1 -> !o1.getCurrentToken().equals(true)).collect(Collectors.toList()));
            resultDTO.addAll(oldTokens);

            list.clear();
            list.addAll(getFromIndexAndtoIndex(size, page, resultDTO));
            return pageInfo;
        }
    }

    List<AccessTokenDTO> getFromIndexAndtoIndex(Integer size, Integer page, List result) {
        return result.subList(size * page, (size * page + size) < result.size() ? (size * page + size) : result.size());
    }

    @Override
    public void delete(String tokenId, String currentToken) {
        AccessTokenDTO accessTokenDTO = accessTokenMapper.selectByPrimaryKey(tokenId);
        if (accessTokenDTO == null) {
            throw new CommonException("error.token.not.exist");
        }
        if (((DefaultOAuth2AccessToken) SerializationUtils.deserialize(accessTokenDTO.getToken())).getValue().equalsIgnoreCase(currentToken)) {
            throw new CommonException("error.delete.current.token");
        }
        oauthTokenFeignClient.deleteToken(tokenId);
        logger.info("iam delete token,tokenId:{}", tokenId);
    }

    @Override
    public void deleteList(List<String> tokenIds, String currentToken) {
        List<AccessTokenDTO> accessTokens = accessTokenMapper.selectTokenList(tokenIds);
        List<String> tokens = accessTokens.stream().map(t -> ((DefaultOAuth2AccessToken) SerializationUtils.deserialize(t.getToken())).getValue()).collect(Collectors.toList());

        if (tokens != null && !tokens.isEmpty() && tokens.contains(currentToken)) {
            throw new CommonException("error.delete.current.token");
        }
        if (tokens != null && tokens.size() != tokenIds.size()) {
            tokenIds = accessTokens.stream().map(AccessTokenDTO::getTokenId).collect(Collectors.toList());
        }
        oauthTokenFeignClient.deleteTokenList(tokenIds);
    }

    @JobTask(maxRetryCount = 2, code = "deleteAllExpiredToken", level = ResourceLevel.SITE, description = "删除所有失效token")
    @Override
    public void deleteAllExpiredToken(Map<String, Object> map) {
        List<AccessTokenDTO> accessTokens = accessTokenMapper.selectAll();
        //过滤出所有失效token
        List<AccessTokenDTO> allExpired = accessTokens.stream().filter(t -> ((DefaultOAuth2AccessToken) SerializationUtils.deserialize(t.getToken())).isExpired()).collect(Collectors.toList());
        allExpired.forEach(t -> {
            accessTokenMapper.deleteByPrimaryKey(t.getTokenId());
            refreshTokenMapper.deleteByPrimaryKey(t.getRefreshToken());
        });
        logger.info("All expired tokens have been cleared.");
    }
}
