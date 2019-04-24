package io.choerodon.iam.api.service;

import com.github.pagehelper.Page;
import io.choerodon.iam.infra.dto.DashboardDTO;

/**
 * @author dongfan117@gmail.com
 */
public interface DashboardService {

    DashboardDTO update(Long dashboardId, DashboardDTO dashboardDTO, Boolean updateRole);

    DashboardDTO query(Long dashboardId);

    Page<DashboardDTO> list(DashboardDTO dashboardDTO, int page, int size, String param);

    void reset(Long dashboardId);
}
