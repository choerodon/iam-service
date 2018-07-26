package io.choerodon.iam.api.validator;

import org.springframework.stereotype.Component;

import io.choerodon.iam.infra.mapper.DashboardMapper;

/**
 * @author dongfan117@gmail.com
 */
@Component
public class DashboardValidator {
    private DashboardMapper dashboardMapper;

    public DashboardValidator(DashboardMapper dashboardMapper) {
        this.dashboardMapper = dashboardMapper;
    }
}
