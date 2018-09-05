package io.choerodon.iam.api.service.impl;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.DashboardDTO;
import io.choerodon.iam.api.dto.DashboardRoleDTO;
import io.choerodon.iam.api.service.DashboardService;
import io.choerodon.iam.domain.iam.entity.DashboardE;
import io.choerodon.iam.infra.mapper.DashboardMapper;
import io.choerodon.iam.infra.mapper.DashboardRoleMapper;
import io.choerodon.mybatis.pagehelper.PageHelper;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author dongfan117@gmail.com
 */
@Service("dashboardService")
public class DashboardServiceImpl implements DashboardService {

    private DashboardMapper dashboardMapper;
    private DashboardRoleMapper dashboardRoleMapper;
    private final ModelMapper modelMapper = new ModelMapper();

    public DashboardServiceImpl(DashboardMapper dashboardMapper, DashboardRoleMapper dashboardRoleMapper) {
        this.dashboardMapper = dashboardMapper;
        this.dashboardRoleMapper = dashboardRoleMapper;
    }

    @Override
    public DashboardDTO update(Long dashboardId, DashboardDTO dashboardDTO) {
        DashboardE dashboard = new DashboardE(
                dashboardId,
                dashboardDTO.getName(),
                dashboardDTO.getTitle(),
                dashboardDTO.getDescription(),
                dashboardDTO.getIcon(),
                dashboardDTO.getObjectVersionNumber());

        int isUpdate = dashboardMapper.updateByPrimaryKeySelective(dashboard);
        if (isUpdate != 1) {
            throw new CommonException("error.dashboard.not.exist");
        }
        return modelMapper.map(
                dashboardMapper.selectByPrimaryKey(dashboardId),
                DashboardDTO.class);
    }

    @Override
    public DashboardDTO query(Long dashboardId) {
        DashboardE dashboard = new DashboardE();
        dashboard.setId(dashboardId);
        dashboard = dashboardMapper.selectByPrimaryKey(dashboardId);

        if (dashboard == null) {
            throw new CommonException("error.dashboard.not.exist");
        }
        return modelMapper.map(dashboard, DashboardDTO.class);
    }

    @Override
    public Page<DashboardDTO> list(DashboardDTO dashboardDTO, PageRequest pageRequest, String param) {
        Page<DashboardE> dashboardPage = PageHelper.doPageAndSort(
                pageRequest, () -> dashboardMapper.fulltextSearch(
                        modelMapper.map(dashboardDTO, DashboardE.class), param));

        return ConvertPageHelper.convertPage(
                dashboardPage, DashboardDTO.class);
    }

    @Override
    public List<DashboardRoleDTO> queryRoles(Long dashboardId, String level) {
        DashboardE dashboard = new DashboardE(dashboardId, level);

        return dashboardRoleMapper.query(dashboard);
    }


}
