package io.choerodon.iam.api.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.DashboardPositionDTO;
import io.choerodon.iam.api.service.DashboardService;
import io.choerodon.iam.infra.dto.DashboardDTO;
import io.choerodon.iam.infra.dto.DashboardRoleDTO;
import io.choerodon.iam.infra.dto.UserDashboardDTO;
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
//        DashboardE dashboard = new DashboardE(
//                dashboardId,
//                dashboardDTO.getName(),
//                dashboardDTO.getTitle(),
//                dashboardDTO.getDescription(),
//                dashboardDTO.getIcon(),
//                dashboardDTO.getNeedRoles(),
//                dashboardDTO.getObjectVersionNumber());
//        dashboard.setEnabled(dashboardDTO.getEnabled());
        dashboardDTO.setPosition(convertPositionDTOToJson(dashboardDTO.getPositionDTO()));
        int isUpdate = dashboardMapper.updateByPrimaryKeySelective(dashboardDTO);
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
                DashboardRoleDTO dto = new DashboardRoleDTO();
                dto.setRoleId(roleId);
                dto.setDashboardId(dashboardId);
                dashboardRoleMapper.insertSelective(dto);
            }
        }
        select.setRoleIds(dashboardRoleMapper.selectRoleIds(select.getId()));
        return select;
    }

    @Override
    public DashboardDTO query(Long dashboardId) {
        DashboardDTO dashboard = new DashboardDTO();
        dashboard.setId(dashboardId);
        dashboard = dashboardMapper.selectByPrimaryKey(dashboardId);

        if (dashboard == null) {
            throw new CommonException("error.dashboard.not.exist");
        }
        return modelMapper.map(dashboard, DashboardDTO.class);
    }

    @Override
    public PageInfo<DashboardDTO> list(DashboardDTO dashboardDTO, int page, int size, String param) {
        return PageHelper.startPage(page, size).doSelectPageInfo(() -> dashboardMapper.fulltextSearch(dashboardDTO, param));
    }

    @Override
    public void reset(Long dashboardId) {
        UserDashboardDTO deleteCondition = new UserDashboardDTO();
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
