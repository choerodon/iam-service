package io.choerodon.iam.app.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import io.choerodon.asgard.saga.annotation.Saga;
import io.choerodon.asgard.saga.dto.StartInstanceDTO;
import io.choerodon.asgard.saga.feign.SagaClient;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.iam.api.dto.OrgSharesDTO;
import io.choerodon.iam.api.dto.OrganizationSimplifyDTO;
import io.choerodon.iam.api.dto.payload.OrganizationEventPayload;
import io.choerodon.iam.api.dto.payload.OrganizationPayload;
import io.choerodon.iam.app.service.OrganizationService;
import io.choerodon.iam.app.service.UserService;
import io.choerodon.iam.infra.asserts.DetailsHelperAssert;
import io.choerodon.iam.infra.asserts.OrganizationAssertHelper;
import io.choerodon.iam.infra.dto.OrganizationDTO;
import io.choerodon.iam.infra.dto.ProjectDTO;
import io.choerodon.iam.infra.dto.RoleDTO;
import io.choerodon.iam.infra.dto.UserDTO;
import io.choerodon.iam.infra.exception.UpdateExcetion;
import io.choerodon.iam.infra.feign.AsgardFeignClient;
import io.choerodon.iam.infra.mapper.OrganizationMapper;
import io.choerodon.iam.infra.mapper.ProjectMapper;
import io.choerodon.iam.infra.mapper.RoleMapper;
import io.choerodon.iam.infra.mapper.UserMapper;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import java.util.*;

import static io.choerodon.iam.infra.common.utils.SagaTopic.Organization.*;

/**
 * @author wuguokai
 */
@Component
public class OrganizationServiceImpl implements OrganizationService {

    private AsgardFeignClient asgardFeignClient;

    private boolean devopsMessage;

    private SagaClient sagaClient;

    private final ObjectMapper mapper = new ObjectMapper();

    private UserService userService;

    private OrganizationAssertHelper organizationAssertHelper;

    private ProjectMapper projectMapper;

    private UserMapper userMapper;

    private OrganizationMapper organizationMapper;

    private RoleMapper roleMapper;


    public OrganizationServiceImpl(@Value("${choerodon.devops.message:false}") Boolean devopsMessage,
                                   SagaClient sagaClient,
                                   UserService userService,
                                   AsgardFeignClient asgardFeignClient,
                                   OrganizationAssertHelper organizationAssertHelper,
                                   ProjectMapper projectMapper,
                                   UserMapper userMapper,
                                   OrganizationMapper organizationMapper,
                                   RoleMapper roleMapper) {
        this.devopsMessage = devopsMessage;
        this.sagaClient = sagaClient;
        this.userService = userService;
        this.asgardFeignClient = asgardFeignClient;
        this.organizationAssertHelper = organizationAssertHelper;
        this.projectMapper = projectMapper;
        this.userMapper = userMapper;
        this.organizationMapper = organizationMapper;
        this.roleMapper = roleMapper;
    }

    @Override
    public OrganizationDTO queryOrganizationById(Long organizationId) {
        OrganizationDTO organizationDTO = organizationAssertHelper.organizationNotExisted(organizationId);

        ProjectDTO example = new ProjectDTO();
        example.setOrganizationId(organizationId);
        List<ProjectDTO> projects = projectMapper.select(example);
        organizationDTO.setProjects(projects);
        organizationDTO.setProjectCount(projects.size());

        Long userId = organizationDTO.getUserId();
        UserDTO user = userMapper.selectByPrimaryKey(userId);
        if (user != null) {
            organizationDTO.setOwnerLoginName(user.getLoginName());
            organizationDTO.setOwnerRealName(user.getRealName());
            organizationDTO.setOwnerPhone(user.getPhone());
            organizationDTO.setOwnerEmail(user.getEmail());
        }
        return organizationDTO;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @Saga(code = ORG_UPDATE, description = "iam更新组织", inputSchemaClass = OrganizationPayload.class)
    public OrganizationDTO updateOrganization(Long organizationId, OrganizationDTO organizationDTO, String resourceLevel, Long sourceId) {
        preUpdate(organizationId, organizationDTO);

        organizationDTO = doUpdate(organizationDTO);
        if (devopsMessage) {
            OrganizationPayload payload = new OrganizationPayload();
            payload
                    .setId(organizationDTO.getId())
                    .setName(organizationDTO.getName())
                    .setCode(organizationDTO.getCode())
                    .setUserId(organizationDTO.getUserId())
                    .setAddress(organizationDTO.getAddress())
                    .setImageUrl(organizationDTO.getImageUrl());
            try {
                String input = mapper.writeValueAsString(payload);
                sagaClient.startSaga(ORG_UPDATE, new StartInstanceDTO(input, "organization", organizationId + "", resourceLevel, sourceId));
            } catch (JsonProcessingException e) {
                throw new CommonException("error.organization.update.payload.to.string");
            } catch (Exception e) {
                throw new CommonException("error.organization.update.event", e);
            }
        }
        return organizationDTO;
    }

    private OrganizationDTO doUpdate(OrganizationDTO organizationDTO) {
        if (organizationMapper.updateByPrimaryKeySelective(organizationDTO) != 1) {
            throw new UpdateExcetion("error.organization.update");
        }
        return organizationMapper.selectByPrimaryKey(organizationDTO);
    }

    private void preUpdate(Long organizationId, OrganizationDTO organizationDTO) {
        OrganizationDTO organization = organizationAssertHelper.organizationNotExisted(organizationId);
        organizationDTO.setId(organizationId);
        //code和创建人不可修改
        organizationDTO.setUserId(organization.getUserId());
        organizationDTO.setCode(organization.getCode());
        if (ObjectUtils.isEmpty(organizationDTO.getEnabled())) {
            organizationDTO.setEnabled(true);
        }
    }

    @Override
    public OrganizationDTO queryOrganizationWithRoleById(Long organizationId) {
        CustomUserDetails customUserDetails = DetailsHelperAssert.userDetailNotExisted();
        OrganizationDTO dto = queryOrganizationById(organizationId);
        long userId = customUserDetails.getUserId();

        List<ProjectDTO> projects = projectMapper.selectUserProjectsUnderOrg(userId, organizationId, null);
        dto.setProjects(projects);
        dto.setProjectCount(projects.size());

        List<RoleDTO> roles =
                roleMapper.queryRolesInfoByUser(ResourceType.ORGANIZATION.value(), organizationId, userId);
        dto.setRoles(roles);
        return dto;
    }

    @Override
    public PageInfo<OrganizationDTO> pagingQuery(OrganizationDTO organizationDTO, PageRequest pageRequest, String param) {
        return PageHelper.startPage(pageRequest.getPage(), pageRequest.getSize()).doSelectPageInfo(() -> organizationMapper.fulltextSearch(organizationDTO, param));
    }

    @Override
    @Saga(code = ORG_ENABLE, description = "iam启用组织", inputSchemaClass = OrganizationEventPayload.class)
    public OrganizationDTO enableOrganization(Long organizationId, Long userId) {
        OrganizationDTO organization = organizationAssertHelper.organizationNotExisted(organizationId);
        organization.setEnabled(true);
        return updateAndSendEvent(organization, ORG_ENABLE, userId);
    }

    @Override
    @Saga(code = ORG_DISABLE, description = "iam停用组织", inputSchemaClass = OrganizationEventPayload.class)
    public OrganizationDTO disableOrganization(Long organizationId, Long userId) {
        OrganizationDTO organizationDTO = organizationAssertHelper.organizationNotExisted(organizationId);
        organizationDTO.setEnabled(false);
        return updateAndSendEvent(organizationDTO, ORG_DISABLE, userId);
    }

    private OrganizationDTO updateAndSendEvent(OrganizationDTO organization, String consumerType, Long userId) {
        OrganizationDTO organizationDTO = doUpdate(organization);
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
            //给asgard发送禁用定时任务通知
            asgardFeignClient.disableOrg(organization.getId());
            // 给组织下所有用户发送通知
            List<Long> userIds = organizationMapper.listMemberIds(organization.getId(), "organization");
            Map<String, Object> params = new HashMap<>();
            params.put("organizationName", organizationDTO.getName());
            if (ORG_DISABLE.equals(consumerType)) {
                userService.sendNotice(userId, userIds, "disableOrganization", params, organization.getId());
            } else if (ORG_ENABLE.equals(consumerType)) {
                userService.sendNotice(userId, userIds, "enableOrganization", params, organization.getId());
            }
        }
        return organizationDTO;
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

    @Override
    public PageInfo<UserDTO> pagingQueryUsersInOrganization(Long organizationId, Long userId, String email, PageRequest pageRequest, String param) {
        return PageHelper
                .startPage(pageRequest.getPage(), pageRequest.getSize())
                .doSelectPageInfo(() -> userMapper.selectUsersByLevelAndOptions(ResourceLevel.ORGANIZATION.value(), organizationId, userId, email, param));
    }

    @Override
    public List<OrganizationDTO> queryByIds(Set<Long> ids) {
        if (ids.isEmpty()) {
            return new ArrayList<>();
        } else {
            return organizationMapper.selectByIds(ids);
        }
    }

    private void checkCode(OrganizationDTO organization) {
        Boolean createCheck = StringUtils.isEmpty(organization.getId());
        String code = organization.getCode();
        OrganizationDTO organizationDTO = new OrganizationDTO();
        organizationDTO.setCode(code);
        if (createCheck) {
            Boolean existed = organizationMapper.selectOne(organizationDTO) != null;
            if (existed) {
                throw new CommonException("error.organization.code.exist");
            }
        } else {
            Long id = organization.getId();
            OrganizationDTO dto = organizationMapper.selectOne(organizationDTO);
            Boolean existed = dto != null && !id.equals(dto.getId());
            if (existed) {
                throw new CommonException("error.organization.code.exist");
            }
        }
    }

    @Override
    public PageInfo<OrganizationSimplifyDTO> getAllOrgs(PageRequest pageRequest) {
        return PageHelper
                .startPage(pageRequest.getPage(), pageRequest.getSize())
                .doSelectPageInfo(() -> organizationMapper.selectAllOrgIdAndName());
    }


    @Override
    public PageInfo<OrgSharesDTO> pagingSpecified(Set<Long> orgIds, String name, String code, Boolean enabled, String params, PageRequest pageRequest) {
        if (CollectionUtils.isEmpty(orgIds)) {
            return new PageInfo<>();
        }
        return PageHelper.startPage(pageRequest.getPage(), pageRequest.getSize(), pageRequest.getSort().toSql())
                .doSelectPageInfo(() -> organizationMapper.selectSpecified(orgIds, name, code, enabled, params));
    }
}
