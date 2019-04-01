package io.choerodon.iam.domain.iam.converter;

import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.OrganizationDTO;
import io.choerodon.iam.domain.iam.entity.OrganizationE;
import io.choerodon.iam.infra.dataobject.OrganizationDO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

/**
 * @author wuguokai
 */
@Component
public class OrganizationConverter implements ConvertorI<OrganizationE, OrganizationDO, OrganizationDTO> {
    @Override
    public OrganizationE dtoToEntity(OrganizationDTO dto) {
        OrganizationE organizationE = new OrganizationE();
        BeanUtils.copyProperties(dto, organizationE);
        return organizationE;
    }

    @Override
    public OrganizationDTO entityToDto(OrganizationE entity) {
        OrganizationDTO organizationDTO = new OrganizationDTO();
        BeanUtils.copyProperties(entity, organizationDTO);
        return organizationDTO;
    }

    @Override
    public OrganizationE doToEntity(OrganizationDO dataObject) {
        OrganizationE organizationE = new OrganizationE();
        BeanUtils.copyProperties(dataObject, organizationE);
        return organizationE;
    }

    @Override
    public OrganizationDO entityToDo(OrganizationE entity) {
        OrganizationDO organizationDO = new OrganizationDO();
        BeanUtils.copyProperties(entity, organizationDO);
        return organizationDO;
    }

    @Override
    public OrganizationDTO doToDto(OrganizationDO dataObject) {
        OrganizationDTO organizationDTO = new OrganizationDTO();
        BeanUtils.copyProperties(dataObject, organizationDTO);
        return organizationDTO;
    }

    @Override
    public OrganizationDO dtoToDo(OrganizationDTO dto) {
        OrganizationDO organizationDO = new OrganizationDO();
        BeanUtils.copyProperties(dto, organizationDO);
        return organizationDO;
    }
}
