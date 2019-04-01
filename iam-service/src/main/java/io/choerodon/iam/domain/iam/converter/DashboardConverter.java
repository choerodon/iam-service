package io.choerodon.iam.domain.iam.converter;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.DashboardDTO;
import io.choerodon.iam.api.dto.DashboardPositionDTO;
import io.choerodon.iam.domain.iam.entity.DashboardE;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.IOException;

/**
 * @author dongfan117@gmail.com
 */
@Component
public class DashboardConverter implements ConvertorI<DashboardE, Object, DashboardDTO> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final Logger LOGGER = LoggerFactory.getLogger(DashboardConverter.class);

    @Override
    public DashboardE dtoToEntity(DashboardDTO dto) {
        DashboardE entity = new DashboardE();
        BeanUtils.copyProperties(dto, entity);
        return entity;
    }

    @Override
    public DashboardDTO entityToDto(DashboardE entity) {
        DashboardDTO dashboardDTO = new DashboardDTO();
        BeanUtils.copyProperties(entity, dashboardDTO);
        if (StringUtils.isEmpty(entity.getPosition())) {
            dashboardDTO.setPositionDTO(new DashboardPositionDTO(0, 0, 0, 0));
        } else {
            try {
                dashboardDTO.setPositionDTO(objectMapper.readValue(entity.getPosition(), DashboardPositionDTO.class));
            } catch (IOException e) {
                dashboardDTO.setPositionDTO(new DashboardPositionDTO(0, 0, 0, 0));
                LOGGER.warn("error.dashboardConverter.entityToDto", e);
            }
        }
        return dashboardDTO;
    }

    @Override
    public DashboardE entityToDo(DashboardE entity) {
        DashboardE dashboard = new DashboardE();
        BeanUtils.copyProperties(entity, dashboard);
        return dashboard;
    }

    @Override
    public DashboardE dtoToDo(DashboardDTO dto) {
        DashboardE dashboard = new DashboardE();
        BeanUtils.copyProperties(dto, dashboard);
        return dashboard;
    }

}
