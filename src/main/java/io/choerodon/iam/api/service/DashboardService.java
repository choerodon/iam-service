package io.choerodon.iam.api.service;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.DashboardDTO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author dongfan117@gmail.com
 */
public interface DashboardService {

    DashboardDTO update(Long dashboardId, DashboardDTO dashboardDTO, Boolean updateRole);

    DashboardDTO query(Long dashboardId);

    Page<DashboardDTO> list(DashboardDTO dashboardDTO, PageRequest pageRequest, String param);
}
