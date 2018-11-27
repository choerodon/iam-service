package io.choerodon.iam.app.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    public AccessTokenServiceImpl(AccessTokenMapper accessTokenMapper, RefreshTokenMapper refreshTokenMapper, UserRepository userRepository) {
        this.accessTokenMapper = accessTokenMapper;
        this.refreshTokenMapper = refreshTokenMapper;
        this.userRepository = userRepository;
    }

    @Override
    public Page<UserAccessTokenDTO> pagingTokensByUserIdAndClient(PageRequest pageRequest, Long userId, String clientName, String currentToken) {
        UserE userE = userRepository.selectByPrimaryKey(userId);
        if (userE == null) {
            throw new CommonException("error.user.not.exist");
        }
        Page<UserAccessTokenE> userAccessTokenES = PageHelper.doPageAndSort(pageRequest, () -> accessTokenMapper.selectTokens(userE.getLoginName(), clientName));
        return pageConvert(userAccessTokenES, currentToken);
    }

    public Page<UserAccessTokenDTO> pageConvert(Page<UserAccessTokenE> pageOri, String currentToken) {
        Page<UserAccessTokenDTO> pageBack = new Page<>();
        pageBack.setNumber(pageOri.getNumber());
        pageBack.setNumberOfElements(pageOri.getNumberOfElements());
        pageBack.setSize(pageOri.getSize());
        pageBack.setTotalElements(pageOri.getTotalElements());
        pageBack.setTotalPages(pageOri.getTotalPages());
        if (pageOri.getContent().isEmpty()) {
            return pageBack;
        } else {
            List<UserAccessTokenDTO> userAccessTokenDTOS = pageOri.getContent().stream().map(tokenE ->
                    new UserAccessTokenDTO(tokenE.getTokenId(), tokenE.getClientId(), tokenE.getRedirectUri(),
                            ((DefaultOAuth2AccessToken) SerializationUtils.deserialize(tokenE.getToken())).getValue(),
                            ((DefaultOAuth2AccessToken) SerializationUtils.deserialize(tokenE.getToken())).getExpiration(),
                            tokenE.getAccessTokenValidity(), currentToken)
            ).collect(Collectors.toList());
            List<UserAccessTokenDTO> result = userAccessTokenDTOS.stream().filter(o1 -> o1.getCurrentToken().equals(true)).collect(Collectors.toList());
            result.addAll(userAccessTokenDTOS.stream().filter(o1 -> !o1.getCurrentToken().equals(true)).collect(Collectors.toList()));
            pageBack.setContent(result);
            return pageBack;
        }
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
        accessTokenMapper.deleteByPrimaryKey(tokenId);
        refreshTokenMapper.deleteByPrimaryKey(accessTokenDO.getRefreshToken());
    }

    @JobTask(maxRetryCount = 2, code = "deleteAllExpiredToken", level = ResourceLevel.SITE, description = "删除所有失效token")
    @Override
    public void deleteAllExpiredToken(Map<String, Object> map) {
        List<AccessTokenDO> accessTokenDOS = accessTokenMapper.selectAll();
        //过滤出所有失效token
        List<AccessTokenDO> allExpired = accessTokenDOS.stream().filter(t -> ((DefaultOAuth2AccessToken) SerializationUtils.deserialize(t.getToken())).getExpiration().getTime() < new Date().getTime()).collect(Collectors.toList());
        allExpired.forEach(t -> {
            accessTokenMapper.deleteByPrimaryKey(t.getTokenId());
            refreshTokenMapper.deleteByPrimaryKey(t.getRefreshToken());
        });
        logger.info("All expired tokens have been cleared.");
    }
}
