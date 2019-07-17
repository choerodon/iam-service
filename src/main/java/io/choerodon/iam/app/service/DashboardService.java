package io.choerodon.iam.app.service;

import com.github.pagehelper.PageInfo;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.iam.infra.dto.DashboardDTO;

/**
 * @author dongfan117@gmail.com
 */
public interface DashboardService {

    DashboardDTO update(Long dashboardId, DashboardDTO dashboardDTO, Boolean updateRole);

    DashboardDTO query(Long dashboardId);

    PageInfo<DashboardDTO> list(DashboardDTO dashboardDTO, PageRequest pageRequest, String param);

    void reset(Long dashboardId);
}
