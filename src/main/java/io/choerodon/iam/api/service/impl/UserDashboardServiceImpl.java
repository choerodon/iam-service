package io.choerodon.iam.api.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.api.dto.UserDashboardDTO;
import io.choerodon.iam.api.service.UserDashboardService;
import io.choerodon.iam.api.validator.MemberRoleValidator;
import io.choerodon.iam.domain.iam.entity.DashboardE;
import io.choerodon.iam.domain.iam.entity.UserDashboardE;
import io.choerodon.iam.infra.mapper.DashboardMapper;
import io.choerodon.iam.infra.mapper.DashboardRoleMapper;
import io.choerodon.iam.infra.mapper.UserDashboardMapper;

/**
 * @author dongfan117@gmail.com
 */
@Service("userDashboardService")
public class UserDashboardServiceImpl implements UserDashboardService {
    private final ModelMapper modelMapper = new ModelMapper();
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
        if (!ResourceLevel.SITE.value().equals(level)) {
            memberRoleValidator.userHasRoleValidator(userDetails, level, sourceId);
        }
        List<UserDashboardDTO> userDashboards = userDashboardMapper.selectWithDashboard(new UserDashboardE(userDetails.getUserId(), level, sourceId));
        if (!isEquals(userDetails.getUserId(), sourceId, level)) {
            List<UserDashboardDTO> userDashboards1 = userDashboardMapper.selectWithDashboardNotExist(
                    new UserDashboardE(userDetails.getUserId(), level, sourceId));
            List<UserDashboardDTO> userDashboardsAdd = userDashboards1.stream().filter(
                    userDashboardDTO1 -> !dashboardExist(userDashboards, userDashboardDTO1))
                    .collect(Collectors.toList());
            userDashboards.addAll(userDashboardsAdd);
        }

        return userDashboardHasRole(userDashboards, userDetails.getUserId(), sourceId, level);
    }

    @Override
    public List<UserDashboardDTO> update(String level, Long sourceId, List<UserDashboardDTO> userDashboardList) {
        CustomUserDetails userDetails = DetailsHelper.getUserDetails();
        if (null == userDetails) {
            return new ArrayList<>();
        }
        if (!isEquals(userDetails.getUserId(), sourceId, level)) {
            List<DashboardE> dashboardList = dashboardMapper.selectByLevel(level);

            for (DashboardE dashboard : dashboardList) {
                if (null != userDashboardMapper.selectOne(
                        new UserDashboardE(dashboard.getId(), userDetails.getUserId(), level, sourceId))) {
                    continue;
                }
                UserDashboardE userDashboard = new UserDashboardE(
                        dashboard.getId(),
                        userDetails.getUserId(),
                        dashboard.getLevel(),
                        sourceId,
                        dashboard.getSort());
                if (ResourceLevel.SITE.equals(level)) {
                    userDashboard.setSourceId(0L);
                }
                userDashboardMapper.insertSelective(userDashboard);

                for (UserDashboardDTO userDashboardDTO : userDashboardList) {
                    if (dashboard.getId() == userDashboardDTO.getDashboardId()) {
                        userDashboardDTO.setId(userDashboard.getId());
                        break;
                    }
                }
            }
        }

        for (UserDashboardDTO userDashboardDTO : userDashboardList) {
            userDashboardDTO.setUserId(userDetails.getUserId());
            userDashboardDTO.setLevel(level);
            userDashboardDTO.setSourceId(sourceId);
            userDashboardMapper.updateByPrimaryKeySelective(modelMapper.map(userDashboardDTO, UserDashboardE.class));
        }
        return list(level, sourceId);
    }

    private boolean isEquals(Long userId, Long sourceId, String level) {
        return userDashboardMapper.selectCount(
                new UserDashboardE(userId, sourceId)) == dashboardMapper.selectByLevel(level).size();
    }

    private boolean dashboardExist(List<UserDashboardDTO> userDashboardList, UserDashboardDTO userDashboard) {
        Boolean isExist = false;

        for (UserDashboardDTO userDashboard1 : userDashboardList) {
            if (userDashboard.getDashboardId() == userDashboard1.getDashboardId()) {
                isExist = true;
                break;
            }
        }
        return isExist;
    }

    private List<UserDashboardDTO> userDashboardHasRole(
            List<UserDashboardDTO> userDashboardList,
            Long userId,
            Long sourceId,
            String level) {
        List<Long> dashboardIds = dashboardRoleMapper.selectDashboardByUserId(userId, sourceId, level);

        return userDashboardList.stream()
                .filter(userDashboard -> dashboardNeedRole(dashboardIds, userDashboard))
                .collect(Collectors.toList());
    }

    private boolean dashboardNeedRole(List<Long> dashboardIds, UserDashboardDTO userDashboard) {
        return !userDashboard.getNeedRoles() || dashboardIds.contains(userDashboard.getDashboardId());
    }
}
