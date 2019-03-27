package io.choerodon.iam.app.service.impl;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import io.choerodon.core.oauth.DetailsHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.util.SerializationUtils;
import org.springframework.stereotype.Service;

import io.choerodon.asgard.schedule.annotation.JobTask;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.UserAccessTokenDTO;
import io.choerodon.iam.app.service.AccessTokenService;
import io.choerodon.iam.domain.iam.entity.UserE;
import io.choerodon.iam.domain.oauth.entity.UserAccessTokenE;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.infra.dataobject.AccessTokenDO;
import io.choerodon.iam.infra.feign.OauthTokenFeignClient;
import io.choerodon.iam.infra.mapper.AccessTokenMapper;
import io.choerodon.iam.infra.mapper.RefreshTokenMapper;
import io.choerodon.mybatis.pagehelper.PageHelper;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

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
    public Page<UserAccessTokenDTO> pagingTokensByUserIdAndClient(PageRequest pageRequest, String clientName, String currentToken) {
        Long userId = DetailsHelper.getUserDetails().getUserId();
        UserE userE = userRepository.selectByPrimaryKey(userId);
        if (userE == null) {
            throw new CommonException("error.user.not.exist");
        }
        return pageConvert(pageRequest, userE.getLoginName(), clientName, currentToken);
    }

    public Page<UserAccessTokenDTO> pageConvert(PageRequest pageRequest, String loginName, String clientName, String currentToken) {
        //原分页信息
        Page<UserAccessTokenE> pageOri = PageHelper.doPageAndSort(pageRequest, () -> accessTokenMapper.selectTokens(loginName, clientName));
        //所有token信息
        List<UserAccessTokenE> userAccessTokenES = accessTokenMapper.selectTokens(loginName, clientName);

        Page<UserAccessTokenDTO> pageBack = new Page<>();
        pageBack.setNumber(pageOri.getNumber());
        pageBack.setSize(pageOri.getSize());
        pageBack.setNumberOfElements(pageOri.getNumberOfElements());
        pageBack.setTotalElements(pageOri.getTotalElements());
        pageBack.setTotalPages(pageOri.getTotalPages());
        if (pageOri.getContent().isEmpty()) {
            return pageBack;
        } else {
            //todo 此处还需优化修改
            //1.提取tokenDTO
            List<UserAccessTokenDTO> userAccessTokenDTOS = userAccessTokenES.stream().map(tokenE ->
                    new UserAccessTokenDTO(tokenE, currentToken)
            ).collect(Collectors.toList());
            //2.过滤老token（没有createTime）
            List<UserAccessTokenDTO> oldTokens = userAccessTokenDTOS.stream().filter(o1 -> o1.getCreateTime() == null).collect(Collectors.toList());
            //3.过滤并按创建时间将新token排序（有createTime）
            List<UserAccessTokenDTO> newAndSortedTokens = userAccessTokenDTOS.stream().filter(o1 -> o1.getCreateTime() != null).sorted(Comparator.comparing(UserAccessTokenDTO::getCreateTime).reversed()).collect(Collectors.toList());
            //4.排序：当前token + newAndSortedTokens + oldTokens
            List<UserAccessTokenDTO> result = userAccessTokenDTOS.stream().filter(o1 -> o1.getCurrentToken().equals(true)).collect(Collectors.toList());
            result.addAll(newAndSortedTokens.stream().filter(o1 -> !o1.getCurrentToken().equals(true)).collect(Collectors.toList()));
            result.addAll(oldTokens);

            pageBack.setContent(getFromIndexAndtoIndex(pageBack.getSize(), pageBack.getNumber(), result));
            return pageBack;
        }
    }

    List<UserAccessTokenDTO> getFromIndexAndtoIndex(Integer size, Integer page, List result) {
        return result.subList(size * page, (size * page + size) < result.size() ? (size * page + size) : result.size());
    }

    @Override
    public void delete(String tokenId, String currentToken) {
        AccessTokenDO accessTokenDO = accessTokenMapper.selectByPrimaryKey(tokenId);
        if (accessTokenDO == null) {
            throw new CommonException("error.token.not.exist");
        }
        if (((DefaultOAuth2AccessToken) SerializationUtils.deserialize(accessTokenDO.getToken())).getValue().equalsIgnoreCase(currentToken)) {
            throw new CommonException("error.delete.current.token");
        }
        oauthTokenFeignClient.deleteToken(tokenId);
        logger.info("iam delete token,tokenId:{}", tokenId);
    }

    @Override
    public void deleteList(List<String> tokenIds, String currentToken) {
        List<AccessTokenDO> accessTokenDOS = accessTokenMapper.selectTokenList(tokenIds);
        List<String> tokens = accessTokenDOS.stream().map(t -> ((DefaultOAuth2AccessToken) SerializationUtils.deserialize(t.getToken())).getValue()).collect(Collectors.toList());

        if (tokens != null && !tokens.isEmpty() && tokens.contains(currentToken)) {
            throw new CommonException("error.delete.current.token");
        }
        if (tokens != null && tokens.size() != tokenIds.size()) {
            tokenIds = accessTokenDOS.stream().map(AccessTokenDO::getTokenId).collect(Collectors.toList());
        }
        oauthTokenFeignClient.deleteTokenList(tokenIds);
    }

    @JobTask(maxRetryCount = 2, code = "deleteAllExpiredToken", level = ResourceLevel.SITE, description = "删除所有失效token")
    @Override
    public void deleteAllExpiredToken(Map<String, Object> map) {
        List<AccessTokenDO> accessTokenDOS = accessTokenMapper.selectAll();
        //过滤出所有失效token
        List<AccessTokenDO> allExpired = accessTokenDOS.stream().filter(t -> ((DefaultOAuth2AccessToken) SerializationUtils.deserialize(t.getToken())).isExpired()).collect(Collectors.toList());
        allExpired.forEach(t -> {
            accessTokenMapper.deleteByPrimaryKey(t.getTokenId());
            refreshTokenMapper.deleteByPrimaryKey(t.getRefreshToken());
        });
        logger.info("All expired tokens have been cleared.");
    }
}
