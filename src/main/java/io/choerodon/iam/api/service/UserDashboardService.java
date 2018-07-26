package io.choerodon.iam.api.service;

import java.util.List;

import io.choerodon.iam.api.dto.UserDashboardDTO;
import io.choerodon.iam.domain.iam.entity.UserDashboard;

/**
 * @author dongfan117@gmail.com
 */
public interface UserDashboardService {
    List<UserDashboardDTO> list(String level, Long source_Id);

    List<UserDashboardDTO> update(String level, Long source_Id, List<UserDashboard> dashboardList);
}