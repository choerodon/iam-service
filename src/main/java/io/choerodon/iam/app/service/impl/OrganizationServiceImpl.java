package io.choerodon.iam.app.service.impl;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.OrganizationDTO;
import io.choerodon.iam.app.service.OrganizationService;
import io.choerodon.iam.domain.iam.entity.OrganizationE;
import io.choerodon.iam.domain.repository.OrganizationRepository;
import io.choerodon.iam.infra.dataobject.OrganizationDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author wuguokai
 */
@Component
public class OrganizationServiceImpl implements OrganizationService {

    private OrganizationRepository organizationRepository;

    public OrganizationServiceImpl(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    @Override
    public OrganizationDTO updateOrganization(Long organizationId, OrganizationDTO organizationDTO) {
        organizationDTO.setId(organizationId);
        //code不可更新
        organizationDTO.setCode(null);
        OrganizationE organizationE = ConvertHelper.convert(organizationDTO, OrganizationE.class);
        organizationE = organizationRepository.update(organizationE);
        return ConvertHelper.convert(organizationE, OrganizationDTO.class);
    }

    @Override
    public OrganizationDTO queryOrganizationById(Long organizationId) {
        OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(organizationId);
        return ConvertHelper.convert(organizationDO, OrganizationDTO.class);
    }

    @Override
    public Page<OrganizationDTO> pagingQuery(OrganizationDTO organizationDTO, PageRequest pageRequest, String[] params) {
        Page<OrganizationDO> organizationDOPage =
                organizationRepository.pagingQuery(ConvertHelper.convert(
                        organizationDTO, OrganizationDO.class), pageRequest, params);
        return ConvertPageHelper.convertPage(organizationDOPage, OrganizationDTO.class);
    }

    @Override
    public OrganizationDTO enableOrganization(Long organizationId) {
        OrganizationE organization =
                ConvertHelper.convert(organizationRepository.selectByPrimaryKey(organizationId), OrganizationE.class);
        if (organization == null) {
            throw new CommonException("error.organization.not.exist");
        }
        organization.enable();
        return ConvertHelper.convert(organizationRepository.update(organization), OrganizationDTO.class);
    }

    @Override
    public OrganizationDTO disableOrganization(Long organizationId) {
        OrganizationE organization =
                ConvertHelper.convert(organizationRepository.selectByPrimaryKey(organizationId), OrganizationE.class);
        if (organization == null) {
            throw new CommonException("error.organization.not.exist");
        }
        organization.disable();
        return ConvertHelper.convert(organizationRepository.update(organization), OrganizationDTO.class);
    }

    @Override
    public void check(OrganizationDTO organization) {
        Boolean createCheck = StringUtils.isEmpty(organization.getId());
        String code = organization.getCode();
        if (StringUtils.isEmpty(code)) {
            throw new CommonException("error.organization.code.empty");
        }
        OrganizationDO organizationDO = new OrganizationDO();
        organizationDO.setCode(code);
        if (createCheck) {
            if (organizationRepository.select(organizationDO).size() > 0) {
                throw new CommonException("error.organization.code.exist");
            }
        } else {
            OrganizationDO organizationDO1 = organizationRepository.selectOne(organizationDO);
            if (organizationDO1 != null && !organizationDO1.getId().equals(organization.getId())) {
                throw new CommonException("error.organization.code.exist");
            }
        }
    }
}
