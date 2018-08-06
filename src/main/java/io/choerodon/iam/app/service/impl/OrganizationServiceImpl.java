package io.choerodon.iam.app.service.impl;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.event.producer.execute.EventProducerTemplate;
import io.choerodon.iam.api.dto.OrganizationDTO;
import io.choerodon.iam.api.dto.payload.OrganizationEventPayload;
import io.choerodon.iam.app.service.OrganizationService;
import io.choerodon.iam.domain.iam.entity.OrganizationE;
import io.choerodon.iam.domain.repository.OrganizationRepository;
import io.choerodon.iam.infra.dataobject.OrganizationDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * @author wuguokai
 */
@Component
public class OrganizationServiceImpl implements OrganizationService {

    private OrganizationRepository organizationRepository;

    @Value("${choerodon.devops.message:false}")
    private boolean devopsMessage;

    @Value("${spring.application.name:default}")
    private String serviceName;

    private EventProducerTemplate eventProducerTemplate;

    public OrganizationServiceImpl(OrganizationRepository organizationRepository,
                                   EventProducerTemplate eventProducerTemplate) {
        this.organizationRepository = organizationRepository;
        this.eventProducerTemplate = eventProducerTemplate;
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
    public Page<OrganizationDTO> pagingQuery(OrganizationDTO organizationDTO, PageRequest pageRequest, String param) {
        Page<OrganizationDO> organizationDOPage =
                organizationRepository.pagingQuery(ConvertHelper.convert(
                        organizationDTO, OrganizationDO.class), pageRequest, param);
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
        OrganizationE organizationE = updateAndSendEvent(organization, "enableOrganization");
        return ConvertHelper.convert(organizationE, OrganizationDTO.class);
    }

    @Override
    public OrganizationDTO disableOrganization(Long organizationId) {
        OrganizationE organization =
                ConvertHelper.convert(organizationRepository.selectByPrimaryKey(organizationId), OrganizationE.class);
        if (organization == null) {
            throw new CommonException("error.organization.not.exist");
        }
        organization.disable();
        OrganizationE organizationE = updateAndSendEvent(organization, "disableOrganization");
        return ConvertHelper.convert(organizationE, OrganizationDTO.class);
    }

    private OrganizationE updateAndSendEvent(OrganizationE organization, String consumerType) {
        OrganizationE organizationE;
        if (devopsMessage) {
            organizationE = new OrganizationE();
            OrganizationEventPayload payload = new OrganizationEventPayload();
            payload.setOrganizationId(organization.getId());
            Exception exception = eventProducerTemplate.execute("organization", consumerType,
                    serviceName, payload,
                    (String uuid) ->
                        BeanUtils.copyProperties(organizationRepository.update(organization), organizationE)
                    );
            if (exception != null) {
                throw new CommonException(exception.getMessage());
            }
        } else {
            organizationE = organizationRepository.update(organization);
        }
        return organizationE;
    }

    @Override
    public void check(OrganizationDTO organization) {
        Boolean checkCode = !StringUtils.isEmpty(organization.getCode());
        if (!checkCode) {
            throw new CommonException("error.organization.code.empty");
        } else {
            checkCode(organization);
        }
    }

    private void checkCode(OrganizationDTO organization) {
        Boolean createCheck = StringUtils.isEmpty(organization.getId());
        String code = organization.getCode();
        OrganizationDO organizationDO = new OrganizationDO();
        organizationDO.setCode(code);
        if (createCheck) {
            Boolean existed = organizationRepository.selectOne(organizationDO) != null;
            if (existed) {
                throw new CommonException("error.organization.code.exist");
            }
        } else {
            Long id = organization.getId();
            OrganizationDO organizationDO1 = organizationRepository.selectOne(organizationDO);
            Boolean existed = organizationDO1 != null && !id.equals(organizationDO1.getId());
            if (existed) {
                throw new CommonException("error.organization.code.exist");
            }
        }
    }
}
