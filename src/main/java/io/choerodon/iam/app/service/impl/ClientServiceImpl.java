package io.choerodon.iam.app.service.impl;


import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.iam.infra.asserts.ClientAssertHelper;
import io.choerodon.iam.infra.asserts.OrganizationAssertHelper;
import io.choerodon.iam.infra.common.utils.JsonUtils;
import io.choerodon.iam.infra.common.utils.ParamUtils;
import io.choerodon.iam.infra.dto.ClientDTO;
import io.choerodon.iam.infra.exception.AlreadyExsitedException;
import io.choerodon.iam.infra.exception.EmptyParamException;
import io.choerodon.iam.infra.exception.InsertException;
import io.choerodon.iam.infra.exception.UpdateExcetion;
import io.choerodon.iam.infra.mapper.ClientMapper;
import io.choerodon.iam.infra.mapper.MemberRoleMapper;
import org.apache.commons.lang.RandomStringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.query.ClientRoleQuery;
import io.choerodon.iam.api.dto.SimplifiedClientDTO;
import io.choerodon.iam.app.service.ClientService;

import java.util.Optional;

/**
 * @author wuguokai
 */
@Service
public class ClientServiceImpl implements ClientService {

    private static final String ORGANIZATION_ID_NOT_EQUAL_EXCEPTION = "error.organizationId.not.same";

    private OrganizationAssertHelper organizationAssertHelper;
    private ClientAssertHelper clientAssertHelper;
    private ClientMapper clientMapper;
    private MemberRoleMapper memberRoleMapper;

    public ClientServiceImpl(OrganizationAssertHelper organizationAssertHelper,
                             ClientAssertHelper clientAssertHelper,
                             ClientMapper clientMapper,
                             MemberRoleMapper memberRoleMapper) {
        this.organizationAssertHelper = organizationAssertHelper;
        this.clientMapper = clientMapper;
        this.clientAssertHelper = clientAssertHelper;
        this.memberRoleMapper = memberRoleMapper;
    }

    @Override
    public ClientDTO create(Long orgId, ClientDTO clientDTO) {
        organizationAssertHelper.organizationNotExisted(orgId);
        validateAdditionalInfo(clientDTO);
        clientDTO.setId(null);
        clientDTO.setOrganizationId(orgId);

        if (clientMapper.insertSelective(clientDTO) != 1) {
            throw new InsertException("error.client.create");
        }
        return clientMapper.selectByPrimaryKey(clientDTO.getId());
    }

    /**
     * 创建客户端时生成随机的clientId和secret
     */
    @Override
    public ClientDTO getDefaultCreateData(Long orgId) {
        ClientDTO clientDTO = new ClientDTO();
        clientDTO.setName(generateUniqueName());
        clientDTO.setSecret(RandomStringUtils.randomAlphanumeric(16));
        return clientDTO;
    }

    @Override
    public ClientDTO update(ClientDTO clientDTO) {
        preUpdate(clientDTO);

        if (clientMapper.updateByPrimaryKey(clientDTO) != 1) {
            throw new UpdateExcetion("error.client.update");
        }
        return clientMapper.selectByPrimaryKey(clientDTO.getId());
    }


    @Transactional(rollbackFor = Exception.class)
    @Override
    public void delete(Long orgId, Long clientId) {
        ClientDTO dto = clientAssertHelper.clientNotExisted(clientId);
        if (!dto.getOrganizationId().equals(orgId)) {
            throw new CommonException(ORGANIZATION_ID_NOT_EQUAL_EXCEPTION);
        }
        memberRoleMapper.deleteMemberRoleByMemberIdAndMemberType(clientId, "client");
        clientMapper.deleteByPrimaryKey(clientId);
    }

    @Override
    public ClientDTO query(Long orgId, Long clientId) {
        ClientDTO dto = clientAssertHelper.clientNotExisted(clientId);
        if (!orgId.equals(dto.getOrganizationId())) {
            throw new CommonException(ORGANIZATION_ID_NOT_EQUAL_EXCEPTION);
        }
        return dto;
    }

    @Override
    public ClientDTO queryByName(Long orgId, String clientName) {
        ClientDTO dto = clientAssertHelper.clientNotExisted(clientName);
        if (!orgId.equals(dto.getOrganizationId())) {
            throw new CommonException(ORGANIZATION_ID_NOT_EQUAL_EXCEPTION);
        }
        return dto;
    }

    @Override
    public PageInfo<ClientDTO> list(ClientDTO clientDTO, PageRequest pageRequest, String param) {
        return PageHelper
                .startPage(pageRequest.getPage(), pageRequest.getSize())
                .doSelectPageInfo(() -> clientMapper.fulltextSearch(clientDTO, param));
    }

    @Override
    public void check(ClientDTO client) {
        String name = client.getName();
        if (StringUtils.isEmpty(name)) {
            throw new EmptyParamException(("error.clientName.null"));
        }
        checkName(client);
    }

    @Override
    public PageInfo<ClientDTO> pagingQueryUsersByRoleId(PageRequest pageRequest, ResourceType resourceType, Long sourceId, ClientRoleQuery clientRoleSearchDTO, Long roleId) {
        String param = Optional.ofNullable(clientRoleSearchDTO).map(dto -> ParamUtils.arrToStr(dto.getParam())).orElse(null);
        return PageHelper
                .startPage(pageRequest.getPage(), pageRequest.getSize())
                .doSelectPageInfo(() -> clientMapper.selectClientsByRoleIdAndOptions(roleId, sourceId, resourceType.value(), clientRoleSearchDTO, param));
    }

    @Override
    public PageInfo<SimplifiedClientDTO> pagingQueryAllClients(PageRequest pageRequest, String params) {
        return PageHelper.startPage(pageRequest.getPage(), pageRequest.getSize()).doSelectPageInfo(() -> clientMapper.selectAllClientSimplifiedInfo(params));
    }

    private String generateUniqueName() {
        String uniqueName;
        ClientDTO dto = new ClientDTO();
        while (true) {
            uniqueName = RandomStringUtils.randomAlphanumeric(12);
            dto.setName(uniqueName);
            if (clientMapper.selectOne(dto) == null) {
                break;
            }
        }
        return uniqueName;
    }

    private void preUpdate(ClientDTO clientDTO) {
        if (StringUtils.isEmpty(clientDTO.getName())) {
            throw new EmptyParamException("error.clientName.empty");
        }
        Long id = clientDTO.getId();
        ClientDTO dto = clientAssertHelper.clientNotExisted(id);
        //组织id不可修改
        clientDTO.setOrganizationId(dto.getOrganizationId());
        validateAdditionalInfo(clientDTO);
    }

    private void validateAdditionalInfo(ClientDTO clientDTO) {
        String additionalInfo = clientDTO.getAdditionalInformation();
        if (StringUtils.isEmpty(additionalInfo)) {
            clientDTO.setAdditionalInformation("{}");
        } else if (!JsonUtils.isJSONValid(additionalInfo)) {
            throw new CommonException("error.client.additionalInfo.notJson");
        }
    }

    private void checkName(ClientDTO client) {
        Boolean createCheck = StringUtils.isEmpty(client.getId());
        String name = client.getName();
        ClientDTO clientDTO = new ClientDTO();
        clientDTO.setName(name);
        if (createCheck) {
            Boolean existed = clientMapper.selectOne(clientDTO) != null;
            if (existed) {
                throw new AlreadyExsitedException("error.clientName.exist");
            }
        } else {
            Long id = client.getId();
            ClientDTO dto = clientMapper.selectOne(clientDTO);
            Boolean existed = dto != null && !id.equals(dto.getId());
            if (existed) {
                throw new AlreadyExsitedException("error.clientName.exist");
            }
        }

    }

}
