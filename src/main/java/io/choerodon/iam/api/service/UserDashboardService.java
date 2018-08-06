package io.choerodon.iam.api.service;

import java.util.List;

import io.choerodon.iam.api.dto.UserDashboardDTO;

/**
 * @author dongfan117@gmail.com
 */
public interface UserDashboardService {
    List<UserDashboardDTO> list(String level, Long sourceId);

    List<UserDashboardDTO> update(String level, Long sourceId, List<UserDashboardDTO> dashboardList);
}