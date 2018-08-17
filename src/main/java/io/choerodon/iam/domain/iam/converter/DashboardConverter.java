package io.choerodon.iam.domain.iam.converter;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.DashboardDTO;
import io.choerodon.iam.domain.iam.entity.Dashboard;

/**
 * @author dongfan117@gmail.com
 */
@Component
public class DashboardConverter implements ConvertorI<Dashboard, Dashboard, DashboardDTO> {

    @Override
    public Dashboard dtoToEntity(DashboardDTO dto) {
        Dashboard entity = new Dashboard();
        BeanUtils.copyProperties(dto, entity);
        return entity;
    }

    @Override
    public DashboardDTO entityToDto(Dashboard entity) {
        DashboardDTO DashboardDTO = new DashboardDTO();
        BeanUtils.copyProperties(entity, DashboardDTO);
        return DashboardDTO;
    }

    @Override
    public Dashboard doToEntity(Dashboard dataObject) {
        Dashboard entity = new Dashboard();
        BeanUtils.copyProperties(dataObject, entity);
        return entity;
    }

    @Override
    public Dashboard entityToDo(Dashboard entity) {
        Dashboard Dashboard = new Dashboard();
        BeanUtils.copyProperties(entity, Dashboard);
        return Dashboard;
    }

    @Override
    public DashboardDTO doToDto(Dashboard dataObject) {
        DashboardDTO DashboardDTO = new DashboardDTO();
        BeanUtils.copyProperties(dataObject, DashboardDTO);
        return DashboardDTO;
    }

    @Override
    public Dashboard dtoToDo(DashboardDTO dto) {
        Dashboard Dashboard = new Dashboard();
        BeanUtils.copyProperties(dto, Dashboard);
        return Dashboard;
    }

}
