package io.choerodon.iam.app.service.impl;

import static io.choerodon.iam.infra.common.utils.SagaTopic.Organization.ORG_DISABLE;
import static io.choerodon.iam.infra.common.utils.SagaTopic.Organization.ORG_ENABLE;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import io.choerodon.asgard.saga.annotation.Saga;
import io.choerodon.asgard.saga.dto.StartInstanceDTO;
import io.choerodon.asgard.saga.feign.SagaClient;
import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.api.dto.OrganizationDTO;
import io.choerodon.iam.api.dto.RoleDTO;
import io.choerodon.iam.api.dto.WsSendDTO;
import io.choerodon.iam.api.dto.payload.OrganizationEventPayload;
import io.choerodon.iam.app.service.OrganizationService;
import io.choerodon.iam.domain.iam.entity.OrganizationE;
import io.choerodon.iam.domain.repository.OrganizationRepository;
import io.choerodon.iam.domain.repository.ProjectRepository;
import io.choerodon.iam.domain.repository.RoleRepository;
import io.choerodon.iam.infra.dataobject.OrganizationDO;
import io.choerodon.iam.infra.dataobject.ProjectDO;
import io.choerodon.iam.infra.dataobject.RoleDO;
import io.choerodon.iam.infra.feign.NotifyFeignClient;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author wuguokai
 */
@Component
public class OrganizationServiceImpl implements OrganizationService {

    private OrganizationRepository organizationRepository;
    private ProjectRepository projectRepository;
    private RoleRepository roleRepository;

    @Value("${choerodon.devops.message:false}")
    private boolean devopsMessage;

    @Value("${spring.application.name:default}")
    private String serviceName;

    private SagaClient sagaClient;

    private final ObjectMapper mapper = new ObjectMapper();

    private NotifyFeignClient notifyFeignClient;

    private static final String ORG_MSG_NOT_EXIST = "error.organization.not.exist";

    public OrganizationServiceImpl(OrganizationRepository organizationRepository,
                                   SagaClient sagaClient,
                                   ProjectRepository projectRepository,
                                   RoleRepository roleRepository,
                                   NotifyFeignClient notifyFeignClient) {
        this.organizationRepository = organizationRepository;
        this.sagaClient = sagaClient;
        this.projectRepository = projectRepository;
        this.roleRepository = roleRepository;
        this.notifyFeignClient = notifyFeignClient;
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
        if (organizationDO == null) {
            throw new CommonException(ORG_MSG_NOT_EXIST, organizationId);
        }
        List<ProjectDO> projects = projectRepository.selectByOrgId(organizationId);
        organizationDO.setProjects(projects);
        organizationDO.setProjectCount(projects.size());
        return ConvertHelper.convert(organizationDO, OrganizationDTO.class);
    }

    @Override
    public OrganizationDTO queryOrganizationWithRoleById(Long organizationId) {
        CustomUserDetails customUserDetails = DetailsHelper.getUserDetails();
        if (customUserDetails == null) {
            throw new CommonException("error.user.not.login");
        }
        OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(organizationId);
        long userId = customUserDetails.getUserId();
        if (organizationDO == null) {
            throw new CommonException(ORG_MSG_NOT_EXIST, organizationId);
        }
        List<ProjectDO> projects = projectRepository.selectUserProjectsUnderOrg(userId, organizationId, true);
        organizationDO.setProjects(projects);
        organizationDO.setProjectCount(projects.size());
        OrganizationDTO organizationDTO = ConvertHelper.convert(organizationDO, OrganizationDTO.class);


        List<RoleDO> roles = roleRepository.selectUsersRolesBySourceIdAndType(ResourceLevel.ORGANIZATION.value(), organizationId, userId);
        organizationDTO.setRoles(ConvertHelper.convertList(roles, RoleDTO.class));
        return organizationDTO;
    }

    @Override
    public Page<OrganizationDTO> pagingQuery(OrganizationDTO organizationDTO, PageRequest pageRequest, String param) {
        Page<OrganizationDO> organizationDOPage =
                organizationRepository.pagingQuery(ConvertHelper.convert(
                        organizationDTO, OrganizationDO.class), pageRequest, param);
        return ConvertPageHelper.convertPage(organizationDOPage, OrganizationDTO.class);
    }

    @Override
    @Saga(code = ORG_ENABLE, description = "iam启用组织", inputSchemaClass = OrganizationEventPayload.class)
    public OrganizationDTO enableOrganization(Long organizationId) {
        OrganizationE organization =
                ConvertHelper.convert(organizationRepository.selectByPrimaryKey(organizationId), OrganizationE.class);
        if (organization == null) {
            throw new CommonException(ORG_MSG_NOT_EXIST);
        }
        organization.enable();
        OrganizationE organizationE = updateAndSendEvent(organization, ORG_ENABLE);
        return ConvertHelper.convert(organizationE, OrganizationDTO.class);
    }

    @Override
    @Saga(code = ORG_DISABLE, description = "iam停用组织", inputSchemaClass = OrganizationEventPayload.class)
    public OrganizationDTO disableOrganization(Long organizationId) {
        OrganizationE organization =
                ConvertHelper.convert(organizationRepository.selectByPrimaryKey(organizationId), OrganizationE.class);
        if (organization == null) {
            throw new CommonException(ORG_MSG_NOT_EXIST);
        }
        organization.disable();
        OrganizationE organizationE = updateAndSendEvent(organization, ORG_DISABLE);
        return ConvertHelper.convert(organizationE, OrganizationDTO.class);
    }

    private OrganizationE updateAndSendEvent(OrganizationE organization, String consumerType) {
        OrganizationE organizationE;
        if (devopsMessage) {
            organizationE = new OrganizationE();
            OrganizationEventPayload payload = new OrganizationEventPayload();
            payload.setOrganizationId(organization.getId());
            BeanUtils.copyProperties(organizationRepository.update(organization), organizationE);
            //saga
            try {
                String input = mapper.writeValueAsString(payload);
                sagaClient.startSaga(consumerType, new StartInstanceDTO(input, "organization", payload.getOrganizationId() + ""));
            } catch (Exception e) {
                throw new CommonException("error.organizationService.enableOrDisable.event", e);
            }
            // 给组织下所有用户发送站内信
            List<Long> userIds = organizationRepository.listMemberIds(organization.getId());
            userIds.stream().forEach(id -> {
                WsSendDTO wsSendDTO = new WsSendDTO();
                wsSendDTO.setId(id);
                wsSendDTO.setCode("sit-msg");
                if (ORG_DISABLE.equals(consumerType)) {
                    wsSendDTO.setTemplateCode("disableOrgMsg");
                } else if (ORG_ENABLE.equals(consumerType)) {
                    wsSendDTO.setTemplateCode("enableOrgMsg");
                }
                Map<String, Object> params = new HashMap<>();
                params.put("organizationName", organizationRepository.selectByPrimaryKey(organization.getId()).getName());
                wsSendDTO.setParams(params);
                notifyFeignClient.postPm(wsSendDTO);
            });

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
