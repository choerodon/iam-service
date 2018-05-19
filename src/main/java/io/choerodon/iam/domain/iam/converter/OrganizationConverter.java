package io.choerodon.iam.domain.iam.converter;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.OrganizationDTO;
import io.choerodon.iam.domain.iam.entity.OrganizationE;
import io.choerodon.iam.domain.iam.factory.OrganizationEFactory;
import io.choerodon.iam.infra.dataobject.OrganizationDO;

/**
 * @author wuguokai
 */
@Component
public class OrganizationConverter implements ConvertorI<OrganizationE, OrganizationDO, OrganizationDTO> {
    @Override
    public OrganizationE dtoToEntity(OrganizationDTO dto) {
        return OrganizationEFactory.createOrganizationE(
                dto.getId(), dto.getName(), dto.getCode(),
                dto.getObjectVersionNumber(), dto.getEnabled());
    }

    @Override
    public OrganizationDTO entityToDto(OrganizationE entity) {
        OrganizationDTO organizationDTO = new OrganizationDTO();
        BeanUtils.copyProperties(entity, organizationDTO);
        return organizationDTO;
    }

    @Override
    public OrganizationE doToEntity(OrganizationDO dataObject) {
        return OrganizationEFactory.createOrganizationE(
                dataObject.getId(), dataObject.getName(), dataObject.getCode(),
                dataObject.getObjectVersionNumber(), dataObject.getEnabled());
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
