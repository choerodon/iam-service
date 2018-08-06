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
import io.choerodon.iam.domain.iam.entity.Dashboard;
import io.choerodon.iam.domain.iam.entity.UserDashboard;
import io.choerodon.iam.infra.mapper.DashboardMapper;
import io.choerodon.iam.infra.mapper.UserDashboardMapper;

/**
 * @author dongfan117@gmail.com
 */
@Service("userDashboardService")
public class UserDashboardServiceImpl implements UserDashboardService {
    private final ModelMapper modelMapper = new ModelMapper();
    private UserDashboardMapper userDashboardMapper;
    private DashboardMapper dashboardMapper;
    private MemberRoleValidator memberRoleValidator;

    public UserDashboardServiceImpl(
            UserDashboardMapper userDashboardMapper,
            DashboardMapper dashboardMapper,
            MemberRoleValidator memberRoleValidator) {
        this.userDashboardMapper = userDashboardMapper;
        this.dashboardMapper = dashboardMapper;
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
        List<UserDashboardDTO> userDashboards = userDashboardMapper.selectWithDashboard(new UserDashboard(1L, level, sourceId));
        if (!isEquals(1L, sourceId, level)) {
            List<UserDashboardDTO> userDashboards1 = userDashboardMapper.selectWithDashboardNotExist(
                    new UserDashboard(1L, level, sourceId));
            List<UserDashboardDTO> userDashboardsAdd = userDashboards1.stream().filter(
                    userDashboardDTO1 -> !dashboardExist(userDashboards, userDashboardDTO1))
                    .collect(Collectors.toList());
            userDashboards.addAll(userDashboardsAdd);
        }
        return userDashboards;
    }

    @Override
    public List<UserDashboardDTO> update(String level, Long sourceId, List<UserDashboardDTO> userDashboardList) {
        CustomUserDetails userDetails = DetailsHelper.getUserDetails();
        if (null == userDetails) {
            return new ArrayList<>();
        }
        if (!isEquals(userDetails.getUserId(), sourceId, level)) {
            List<Dashboard> dashboardList = dashboardMapper.selectByLevel(level);

            for (Dashboard dashboard : dashboardList) {
                if (null != userDashboardMapper.selectOne(
                        new UserDashboard(dashboard.getId(), userDetails.getUserId(), level, sourceId))) {
                    continue;
                }
                UserDashboard userDashboard = new UserDashboard(
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
            userDashboardMapper.updateByPrimaryKeySelective(modelMapper.map(userDashboardDTO, UserDashboard.class));
        }
        return list(level, sourceId);
    }

    private boolean isEquals(Long userId, Long sourceId, String level) {
        return userDashboardMapper.selectCount(
                new UserDashboard(userId, sourceId)) == dashboardMapper.selectByLevel(level).size();
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
}
