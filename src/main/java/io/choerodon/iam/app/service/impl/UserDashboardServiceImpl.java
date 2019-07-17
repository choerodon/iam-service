package io.choerodon.iam.app.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.api.dto.DashboardPositionDTO;
import io.choerodon.iam.app.service.UserDashboardService;
import io.choerodon.iam.api.validator.MemberRoleValidator;
import io.choerodon.iam.infra.dto.DashboardDTO;
import io.choerodon.iam.infra.dto.UserDashboardDTO;
import io.choerodon.iam.infra.mapper.DashboardMapper;
import io.choerodon.iam.infra.mapper.DashboardRoleMapper;
import io.choerodon.iam.infra.mapper.UserDashboardMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * @author dongfan117@gmail.com
 */
@Service("userDashboardService")
public class UserDashboardServiceImpl implements UserDashboardService {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserDashboardService.class);
    private ObjectMapper objectMapper = new ObjectMapper();
    private UserDashboardMapper userDashboardMapper;
    private DashboardMapper dashboardMapper;
    private DashboardRoleMapper dashboardRoleMapper;
    private MemberRoleValidator memberRoleValidator;

    public UserDashboardServiceImpl(
            UserDashboardMapper userDashboardMapper,
            DashboardMapper dashboardMapper,
            DashboardRoleMapper dashboardRoleMapper,
            MemberRoleValidator memberRoleValidator) {
        this.userDashboardMapper = userDashboardMapper;
        this.dashboardMapper = dashboardMapper;
        this.dashboardRoleMapper = dashboardRoleMapper;
        this.memberRoleValidator = memberRoleValidator;
    }

    @Override
    public List<UserDashboardDTO> list(String level, Long sourceId) {
        CustomUserDetails userDetails = DetailsHelper.getUserDetails();
        if (null == userDetails) {
            return new ArrayList<>();
        }
        boolean isAdmin = false;
        if (userDetails.getAdmin() != null) {
            isAdmin = userDetails.getAdmin();
        }
        if (!ResourceLevel.SITE.value().equals(level)) {
            memberRoleValidator.userHasRoleValidator(userDetails, level, sourceId, isAdmin);
        }
        UserDashboardDTO userDashboardDTO = new UserDashboardDTO();
        userDashboardDTO.setUserId(userDetails.getUserId());
        userDashboardDTO.setLevel(level);
        userDashboardDTO.setSourceId(sourceId);
        List<UserDashboardDTO> userDashboards = userDashboardMapper.selectWithDashboard(userDashboardDTO);


        List<UserDashboardDTO> userDashboards1 = userDashboardMapper.selectWithDashboardNotExist(userDashboardDTO);
        List<UserDashboardDTO> userDashboardsAdd = userDashboards1.stream().filter(
                userDashboardDTO1 -> !dashboardExist(userDashboards, userDashboardDTO1))
                .collect(Collectors.toList());
        userDashboards.addAll(userDashboardsAdd);
        return userDashboardHasRoleAndConvertPosition(userDashboards, userDetails.getUserId(), sourceId, level, isAdmin);
    }

    @Override
    public List<UserDashboardDTO> update(String level, Long sourceId, List<UserDashboardDTO> userDashboards) {
        CustomUserDetails userDetails = DetailsHelper.getUserDetails();
        if (null == userDetails) {
            return new ArrayList<>();
        }
        if (!isEquals(userDetails.getUserId(), sourceId, level)) {
            List<DashboardDTO> dashboardList = dashboardMapper.selectByLevel(level);

            for (DashboardDTO dashboard : dashboardList) {
                UserDashboardDTO userDashboardDTO = new UserDashboardDTO();
                userDashboardDTO.setDashboardId(dashboard.getId());
                userDashboardDTO.setUserId(userDetails.getUserId());
                userDashboardDTO.setLevel(level);
                userDashboardDTO.setSourceId(sourceId);

                if (null != userDashboardMapper.selectOne(userDashboardDTO)) {
                    continue;
                }
                userDashboardDTO.setLevel(dashboard.getLevel());
                userDashboardDTO.setSort(dashboard.getSort());
                if (ResourceLevel.SITE.value().equals(level)) {
                    userDashboardDTO.setSourceId(0L);
                }
                userDashboardMapper.insertSelective(userDashboardDTO);

                for (UserDashboardDTO dto : userDashboards) {
                    if (dashboard.getId().equals(dto.getDashboardId())) {
                        dto.setId(userDashboardDTO.getId());
                        break;
                    }
                }
            }
        }
        for (UserDashboardDTO userDashboardDTO : userDashboards) {
            userDashboardDTO.setPosition(convertPositionDTOToJson(userDashboardDTO.getPositionDTO()));
            userDashboardDTO.setUserId(userDetails.getUserId());
            userDashboardDTO.setLevel(level);
            userDashboardDTO.setSourceId(sourceId);
            userDashboardMapper.updateByPrimaryKeySelective(userDashboardDTO);
        }
        return list(level, sourceId);
    }

    private String convertPositionDTOToJson(DashboardPositionDTO positionDTO) {
        if (positionDTO == null ||
                (positionDTO.getPositionX() == null && positionDTO.getPositionY() == null
                        && positionDTO.getHeight() == null && positionDTO.getWidth() == null)) {
            return null;
        }
        if (positionDTO.getPositionX() == null) {
            positionDTO.setPositionX(0);
        }
        if (positionDTO.getPositionY() == null) {
            positionDTO.setPositionY(0);
        }
        if (positionDTO.getHeight() == null) {
            positionDTO.setHeight(0);
        }
        if (positionDTO.getWidth() == null) {
            positionDTO.setWidth(0);
        }
        try {
            return objectMapper.writeValueAsString(positionDTO);
        } catch (JsonProcessingException e) {
            LOGGER.warn("error.userDashboardService.convertPositionDTOToJson.JsonProcessingException", e);
            return null;
        }
    }

    private boolean isEquals(Long userId, Long sourceId, String level) {
        UserDashboardDTO userDashboardDTO = new UserDashboardDTO();
        userDashboardDTO.setSourceId(sourceId);
        userDashboardDTO.setUserId(userId);
        return userDashboardMapper.selectCount(userDashboardDTO) == dashboardMapper.selectByLevel(level).size();
    }

    private boolean dashboardExist(List<UserDashboardDTO> userDashboardList, UserDashboardDTO userDashboard) {
        boolean isExist = false;

        for (UserDashboardDTO userDashboard1 : userDashboardList) {
            if (userDashboard.getDashboardId().equals(userDashboard1.getDashboardId())) {
                isExist = true;
                break;
            }
        }
        return isExist;
    }

    private List<UserDashboardDTO> userDashboardHasRoleAndConvertPosition(
            List<UserDashboardDTO> userDashboardList, Long userId, Long sourceId, String level, Boolean isAdmin) {
        List<Long> dashboardIds = dashboardRoleMapper.selectDashboardByUserId(userId, sourceId, level);

        return userDashboardList.stream()
                .filter(userDashboard -> dashboardNeedRole(dashboardIds, userDashboard, isAdmin))
                .map(this::convertPosition)
                .collect(Collectors.toList());
    }

    private UserDashboardDTO convertPosition(final UserDashboardDTO dto) {
        if (StringUtils.isEmpty(dto.getPosition())) {
            dto.setPositionDTO(new DashboardPositionDTO(0, 0, 0, 0));
        } else {
            try {
                dto.setPositionDTO(objectMapper.readValue(dto.getPosition(), DashboardPositionDTO.class));
            } catch (IOException e) {
                dto.setPositionDTO(new DashboardPositionDTO(0, 0, 0, 0));
            }
        }
        return dto;
    }


    private boolean dashboardNeedRole(List<Long> dashboardIds, UserDashboardDTO userDashboard, Boolean isAdmin) {
        if (isAdmin) {
            return true;
        }
        return !Optional.ofNullable(userDashboard.getNeedRoles()).orElse(false) || dashboardIds.contains(userDashboard.getDashboardId());
    }

    @Override
    public void reset(String level, Long sourceId) {
        CustomUserDetails userDetails = DetailsHelper.getUserDetails();
        if (userDetails == null || userDetails.getUserId() == null) {
            LOGGER.warn("error.userDashboardService.delete.userDetailsInvalid");
            return;
        }
        UserDashboardDTO userDashboardDTO = new UserDashboardDTO();
        userDashboardDTO.setUserId(userDetails.getUserId());
        userDashboardDTO.setLevel(level);
        userDashboardDTO.setSourceId(sourceId);
        int row = userDashboardMapper.deleteWithDashboard(userDashboardDTO);
        LOGGER.trace("delete userDashboard row {}, userId {}, level {}, sourceId {}", row, userDetails.getUserId(), level, sourceId);
    }
}
