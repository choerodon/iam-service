package io.choerodon.iam.api.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.DashboardDTO;
import io.choerodon.iam.api.dto.DashboardPositionDTO;
import io.choerodon.iam.api.service.DashboardService;
import io.choerodon.iam.domain.iam.entity.DashboardE;
import io.choerodon.iam.domain.iam.entity.DashboardRoleE;
import io.choerodon.iam.domain.iam.entity.UserDashboardE;
import io.choerodon.iam.infra.mapper.DashboardMapper;
import io.choerodon.iam.infra.mapper.DashboardRoleMapper;
import io.choerodon.iam.infra.mapper.UserDashboardMapper;
import io.choerodon.mybatis.pagehelper.PageHelper;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author dongfan117@gmail.com
 */
@Service("dashboardService")
public class DashboardServiceImpl implements DashboardService {

    private static final Logger LOGGER = LoggerFactory.getLogger(DashboardService.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    private DashboardMapper dashboardMapper;
    private DashboardRoleMapper dashboardRoleMapper;
    private UserDashboardMapper userDashboardMapper;
    private final ModelMapper modelMapper = new ModelMapper();

    public DashboardServiceImpl(DashboardMapper dashboardMapper,
                                DashboardRoleMapper dashboardRoleMapper,
                                UserDashboardMapper userDashboardMapper) {
        this.dashboardMapper = dashboardMapper;
        this.dashboardRoleMapper = dashboardRoleMapper;
        this.userDashboardMapper = userDashboardMapper;
    }

    @Override
    public DashboardDTO update(Long dashboardId, DashboardDTO dashboardDTO, Boolean updateRole) {
        DashboardE dashboard = new DashboardE(
                dashboardId,
                dashboardDTO.getName(),
                dashboardDTO.getTitle(),
                dashboardDTO.getDescription(),
                dashboardDTO.getIcon(),
                dashboardDTO.getNeedRoles(),
                dashboardDTO.getObjectVersionNumber());
        dashboard.setEnabled(dashboardDTO.getEnabled());
        dashboard.setPosition(convertPositionDTOToJson(dashboardDTO.getPositionDTO()));
        int isUpdate = dashboardMapper.updateByPrimaryKeySelective(dashboard);
        if (isUpdate != 1) {
            throw new CommonException("error.dashboard.not.exist");
        }
        DashboardDTO select = modelMapper.map(
                dashboardMapper.selectByPrimaryKey(dashboardId),
                DashboardDTO.class);
        if (!updateRole && select.getNeedRoles() != null && !select.getNeedRoles()) {
            return select;
        }
        List<Long> roleIds = dashboardDTO.getRoleIds();
        if (roleIds != null && !roleIds.isEmpty()) {
            dashboardRoleMapper.deleteByDashboardId(select.getId());
            for (Long roleId : roleIds) {
                DashboardRoleE dashboardRoleE = new DashboardRoleE();
                dashboardRoleE.setRoleId(roleId);
                dashboardRoleE.setDashboardId(dashboardId);
                dashboardRoleMapper.insertSelective(dashboardRoleE);
            }
        }
        select.setRoleIds(dashboardRoleMapper.selectRoleIds(select.getId()));
        return select;
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

        return ConvertPageHelper.convertPage(dashboardPage, DashboardDTO.class);
    }

    @Override
    public void reset(Long dashboardId) {
        UserDashboardE deleteCondition = new UserDashboardE();
        deleteCondition.setSourceId(dashboardId);
        long num = userDashboardMapper.delete(deleteCondition);
        LOGGER.info("reset userDashboard by dashboardId: {}, delete num: {}", dashboardId, num);
    }

    private String convertPositionDTOToJson(DashboardPositionDTO positionDTO) {
        if (positionDTO == null ||
                (positionDTO.getHeight() == null && positionDTO.getWidth() == null)) {
            return null;
        }
        if (positionDTO.getPositionX() == null) {
            positionDTO.setPositionX(0);
        }
        if (positionDTO.getPositionY() == null) {
            positionDTO.setPositionY(0);
        }
        if (positionDTO.getHeight() == null) {
            positionDTO.setHeight(0);
        }
        if (positionDTO.getWidth() == null) {
            positionDTO.setWidth(0);
        }
        try {
            return objectMapper.writeValueAsString(positionDTO);
        } catch (JsonProcessingException e) {
            LOGGER.warn("error.userDashboardService.convertPositionDTOToJson.JsonProcessingException", e);
            return null;
        }
    }
}
