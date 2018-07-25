package io.choerodon.iam.api.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import io.choerodon.iam.api.service.UserDashboardService;
import io.choerodon.iam.domain.iam.entity.UserDashboard;
import io.choerodon.iam.infra.mapper.UserDashboardMapper;

/**
 * @author dongfan117@gmail.com
 */
@Service("userDashboardService")
public class UserDashboardServiceImpl implements UserDashboardService {
    private UserDashboardMapper userDashboardMapper;

    public UserDashboardServiceImpl(UserDashboardMapper userDashboardMapper) {
        this.userDashboardMapper = userDashboardMapper;
    }

    @Override
    public List<UserDashboard> list(String level, Long source_id) {
        return null;
    }

    @Override
    public List<UserDashboard> update(String level, Long source_Id, List<UserDashboard> dashboardList) {
        return null;
    }
}
