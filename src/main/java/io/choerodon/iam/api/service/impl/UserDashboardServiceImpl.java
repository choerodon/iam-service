package io.choerodon.iam.api.service.impl;

import java.util.ArrayList;
import java.util.List;

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
        memberRoleValidator.userHasRoleValidator(userDetails, level, sourceId);
        return userDashboardMapper.selectWithDashboard(new UserDashboard(userDetails.getUserId(), level, sourceId));
    }

    @Override
    public List<UserDashboardDTO> update(String level, Long sourceId, List<UserDashboardDTO> userDashboardList) {
        CustomUserDetails userDetails = DetailsHelper.getUserDetails();
        if (null == userDetails) {
            return new ArrayList<>();
        }
        if (null == userDashboardMapper.selectOne(new UserDashboard(userDetails.getUserId(), level, sourceId))) {
            List<Dashboard> dashboardList = dashboardMapper.select(new Dashboard(level));

            for (Dashboard dashboard : dashboardList) {

                UserDashboard userDashboard = new UserDashboard(
                        dashboard.getId(),
                        userDetails.getUserId(),
                        level,
                        sourceId,
                        dashboard.getSort());
                if (ResourceLevel.SITE.equals(level)) {
                    userDashboard.setSourceId(0L);
                }
                Long id = Long.valueOf(userDashboardMapper.insertSelective(userDashboard));

                for (UserDashboardDTO userDashboardDTO : userDashboardList) {
                    if (dashboard.getId() == userDashboardDTO.getDashboardId()) {
                        userDashboardDTO.setId(id);
                        break;
                    }
                }
            }
        }

        for (UserDashboardDTO userDashboardDTO : userDashboardList) {
            userDashboardMapper.updateByPrimaryKeySelective(modelMapper.map(userDashboardDTO, UserDashboard.class));
        }
        return list(level, sourceId);
    }
}
