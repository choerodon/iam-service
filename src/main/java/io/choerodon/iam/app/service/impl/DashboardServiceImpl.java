package io.choerodon.iam.app.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.iam.api.dto.DashboardPositionDTO;
import io.choerodon.iam.app.service.DashboardService;
import io.choerodon.iam.infra.dto.DashboardDTO;
import io.choerodon.iam.infra.dto.DashboardRoleDTO;
import io.choerodon.iam.infra.dto.UserDashboardDTO;
import io.choerodon.iam.infra.exception.NotExistedException;
import io.choerodon.iam.infra.exception.UpdateExcetion;
import io.choerodon.iam.infra.mapper.DashboardMapper;
import io.choerodon.iam.infra.mapper.DashboardRoleMapper;
import io.choerodon.iam.infra.mapper.UserDashboardMapper;
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
        dashboardDTO.setId(dashboardId);
        dashboardDTO.setPosition(convertPositionToJson(dashboardDTO.getPositionDTO()));
        if (dashboardMapper.updateByPrimaryKeySelective(dashboardDTO) != 1) {
            throw new UpdateExcetion("error.dashboard.not.exist");
        }
        DashboardDTO dashboard =
                modelMapper.map(dashboardMapper.selectByPrimaryKey(dashboardId), DashboardDTO.class);
        if (!updateRole && dashboard.getNeedRoles() != null && !dashboard.getNeedRoles()) {
            return dashboard;
        }
        List<String> roleCodes = dashboardDTO.getRoleCodes();
        if (roleCodes != null && !roleCodes.isEmpty()) {
            dashboardRoleMapper.deleteByDashboardCode(dashboard.getCode());
            for (String role : roleCodes) {
                DashboardRoleDTO dto = new DashboardRoleDTO();
                dto.setRoleCode(role);
                dto.setDashboardCode(dashboard.getCode());
                dashboardRoleMapper.insertSelective(dto);
            }
        }
        dashboard.setRoleCodes(dashboardRoleMapper.selectRoleCodes(dashboard.getCode()));
        return dashboard;
    }

    @Override
    public DashboardDTO query(Long dashboardId) {
        DashboardDTO dashboard = new DashboardDTO();
        dashboard.setId(dashboardId);
        dashboard = dashboardMapper.selectByPrimaryKey(dashboardId);

        if (dashboard == null) {
            throw new NotExistedException("error.dashboard.not.exist");
        }
        return modelMapper.map(dashboard, DashboardDTO.class);
    }

    @Override
    public PageInfo<DashboardDTO> list(DashboardDTO dashboardDTO, PageRequest pageRequest, String param) {
        PageInfo<DashboardDTO> pageInfo =
                PageHelper
                        .startPage(pageRequest.getPage(), pageRequest.getSize())
                        .doSelectPageInfo(() -> dashboardMapper.fulltextSearch(dashboardDTO, param));
        pageInfo.getList().forEach(dashboard -> {
            List<String> roleCodes = dashboardMapper.selectRoleCodesByDashboard(dashboard.getCode(), dashboard.getLevel());
            dashboard.setRoleCodes(roleCodes);
        });
        return pageInfo;
    }

    @Override
    public void reset(Long dashboardId) {
        UserDashboardDTO deleteCondition = new UserDashboardDTO();
        deleteCondition.setSourceId(dashboardId);
        long num = userDashboardMapper.delete(deleteCondition);
        LOGGER.info("reset userDashboard by dashboardId: {}, delete num: {}", dashboardId, num);
    }

    private String convertPositionToJson(DashboardPositionDTO positionDTO) {
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
            LOGGER.warn("error.userDashboardService.convertPositionToJson.JsonProcessingException", e);
            return null;
        }
    }
}
