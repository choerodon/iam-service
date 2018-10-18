package io.choerodon.iam.app.service.impl;

import static io.choerodon.iam.infra.common.utils.SagaTopic.Organization.ORG_DISABLE;
import static io.choerodon.iam.infra.common.utils.SagaTopic.Organization.ORG_ENABLE;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.choerodon.iam.domain.iam.entity.UserE;
import io.choerodon.iam.domain.repository.UserRepository;
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
    private UserRepository userRepository;

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
                                   NotifyFeignClient notifyFeignClient,
                                   UserRepository userRepository) {
        this.organizationRepository = organizationRepository;
        this.sagaClient = sagaClient;
        this.projectRepository = projectRepository;
        this.roleRepository = roleRepository;
        this.notifyFeignClient = notifyFeignClient;
        this.userRepository = userRepository;
    }

    @Override
    public OrganizationDTO updateOrganization(Long organizationId, OrganizationDTO organizationDTO) {
        OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(organizationId);
        organizationDO.setAddress(organizationDTO.getAddress());
        organizationDO.setEnabled(organizationDTO.getEnabled() == null ? true : organizationDTO.getEnabled());
        organizationDO.setName(organizationDTO.getName());
        organizationDO.setObjectVersionNumber(organizationDTO.getObjectVersionNumber());
        organizationDO = organizationRepository.update(organizationDO);
        return ConvertHelper.convert(organizationDO, OrganizationDTO.class);
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
        Long userId = organizationDO.getUserId();
        UserE user = userRepository.selectByPrimaryKey(userId);
        OrganizationDTO dto = ConvertHelper.convert(organizationDO, OrganizationDTO.class);
        dto.setOwnerLoginName(user.getLoginName());
        dto.setOwnerRealName(user.getRealName());
        dto.setOwnerPhone(user.getPhone());
        dto.setOwnerEmail(user.getEmail());
        return dto;
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
        List<ProjectDO> projects = projectRepository.selectUserProjectsUnderOrg(userId, organizationId, null);
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
        OrganizationDO organization = organizationRepository.selectByPrimaryKey(organizationId);
        if (organization == null) {
            throw new CommonException(ORG_MSG_NOT_EXIST);
        }
        organization.setEnabled(true);
        OrganizationDO organizationDO = updateAndSendEvent(organization, ORG_ENABLE);
        return ConvertHelper.convert(organizationDO, OrganizationDTO.class);
    }

    @Override
    @Saga(code = ORG_DISABLE, description = "iam停用组织", inputSchemaClass = OrganizationEventPayload.class)
    public OrganizationDTO disableOrganization(Long organizationId) {
        OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(organizationId);
        if (organizationDO == null) {
            throw new CommonException(ORG_MSG_NOT_EXIST);
        }
        organizationDO.setEnabled(false);
        return ConvertHelper.convert(updateAndSendEvent(organizationDO, ORG_DISABLE), OrganizationDTO.class);
    }

    private OrganizationDO updateAndSendEvent(OrganizationDO organization, String consumerType) {
        OrganizationDO organizationDO = organizationRepository.update(organization);
        if (devopsMessage) {
            OrganizationEventPayload payload = new OrganizationEventPayload();
            payload.setOrganizationId(organization.getId());
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
                if (ORG_DISABLE.equals(consumerType)) {
                    wsSendDTO.setCode("disableOrganization");
                } else if (ORG_ENABLE.equals(consumerType)) {
                    wsSendDTO.setCode("enableOrganization");
                }
                Map<String, Object> params = new HashMap<>();
                params.put("organizationName", organizationRepository.selectByPrimaryKey(organization.getId()).getName());
                wsSendDTO.setParams(params);
                notifyFeignClient.postPm(wsSendDTO);
            });

        }
        return organizationRepository.selectByPrimaryKey(organizationDO.getId());
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
