package io.choerodon.iam.domain.iam.converter;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.DashboardDTO;
import io.choerodon.iam.domain.iam.entity.DashboardE;

/**
 * @author dongfan117@gmail.com
 */
@Component
public class DashboardConverter implements ConvertorI<DashboardE, Object, DashboardDTO> {

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
