package io.choerodon.iam.api.service.impl;

import org.springframework.stereotype.Service;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.DashboardDTO;
import io.choerodon.iam.api.service.DashboardService;
import io.choerodon.iam.infra.mapper.DashboardMapper;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author dongfan117@gmail.com
 */
@Service("dashboardService")
public class DashboardServiceImpl implements DashboardService {

    private DashboardMapper dashboardMapper;


    public DashboardServiceImpl() {
    }

    public DashboardServiceImpl(DashboardMapper dashboardMapper) {
        this.dashboardMapper = dashboardMapper;
    }

    @Override
    public DashboardDTO update(Long dashboardId, DashboardDTO dashboardDTO) {
        dashboardDTO.setId(dashboardId);
        return null;
    }

    @Override
    public DashboardDTO query(Long dashboardId) {
        return null;
    }

    @Override
    public Page<DashboardDTO> list(DashboardDTO dashboardDTO, PageRequest pageRequest, String param) {
        return null;
    }

}
