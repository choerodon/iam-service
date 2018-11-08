package io.choerodon.iam.app.service.impl;

import java.util.Random;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.ClientCreateDTO;
import io.choerodon.iam.api.dto.ClientDTO;
import io.choerodon.iam.api.dto.ClientRoleSearchDTO;
import io.choerodon.iam.api.dto.SimplifiedClientDTO;
import io.choerodon.iam.app.service.ClientService;
import io.choerodon.iam.domain.oauth.entity.ClientE;
import io.choerodon.iam.domain.repository.ClientRepository;
import io.choerodon.iam.domain.repository.OrganizationRepository;
import io.choerodon.iam.infra.dataobject.ClientDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author wuguokai
 */
@Component
public class ClientServiceImpl implements ClientService {

    private static final String ORGANIZATION_ID_NOT_EQUAL_EXCEPTION = "error.organizationId.not.same";
    public static final String SOURCES =
            "ABCDEFGHIJKLMNOPQISTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    private OrganizationRepository organizationRepository;
    private ClientRepository clientRepository;

    public ClientServiceImpl(OrganizationRepository organizationRepository, ClientRepository clientRepository) {
        this.organizationRepository = organizationRepository;
        this.clientRepository = clientRepository;
    }

    @Override
    public ClientDTO create(Long orgId, ClientDTO clientDTO) {
        isOrgExist(orgId);
        clientDTO.setId(null);
        clientDTO.setOrganizationId(orgId);
        return ConvertHelper.convert(
                clientRepository.create(ConvertHelper.convert(clientDTO, ClientE.class)), ClientDTO.class);
    }

    /**
     * 创建客户端时生成随机的clientId和secret
     */
    @Override
    public ClientCreateDTO getDefaultCreatedata(Long orgId) {
        String name = "";
        boolean flag = false;
        while (!flag) {
            name = generateString(new Random(), SOURCES, 12);
            ClientDO clientDO = new ClientDO();
            clientDO.setName(name);
            ClientDO clientByName = clientRepository.selectOne(clientDO);
            if (clientByName == null) {
                flag = true;
            }
        }
        String secret = generateString(new Random(), SOURCES, 16);
        ClientCreateDTO clientCreateDTO = new ClientCreateDTO(name, secret);
        return clientCreateDTO;
    }

    @Override
    public ClientDTO update(Long orgId, Long clientId, ClientDTO clientDTO) {
        isOrgExist(orgId);
        return ConvertHelper.convert(
                clientRepository.update(clientId, ConvertHelper.convert(clientDTO, ClientE.class)),
                ClientDTO.class);
    }

    @Transactional
    @Override
    public Boolean delete(Long orgId, Long clientId) {
        ClientDTO clientDTO = query(orgId, clientId);
        if (!orgId.equals(clientDTO.getOrganizationId())) {
            throw new CommonException(ORGANIZATION_ID_NOT_EQUAL_EXCEPTION);
        }
        return clientRepository.delete(clientId);
    }

    @Override
    public ClientDTO query(Long orgId, Long clientId) {
        ClientDTO clientDTO = ConvertHelper.convert(clientRepository.query(clientId), ClientDTO.class);
        if (clientDTO == null) {
            throw new CommonException("error.client.not.exist");
        }
        if (!orgId.equals(clientDTO.getOrganizationId())) {
            throw new CommonException(ORGANIZATION_ID_NOT_EQUAL_EXCEPTION);
        }
        return clientDTO;
    }

    @Override
    public ClientDTO queryByName(Long orgId, String clientName) {
        ClientDTO clientDTO = ConvertHelper.convert(clientRepository.queryByClientName(clientName), ClientDTO.class);
        if (clientDTO == null) {
            throw new CommonException("error.client.not.exist");
        }
        if (!orgId.equals(clientDTO.getOrganizationId())) {
            throw new CommonException(ORGANIZATION_ID_NOT_EQUAL_EXCEPTION);
        }
        return clientDTO;
    }

    @Override
    public Page<ClientDTO> list(ClientDTO clientDTO, PageRequest pageRequest, String param) {
        isOrgExist(clientDTO.getOrganizationId());
        return ConvertPageHelper.convertPage(
                clientRepository.pagingQuery(pageRequest,
                        ConvertHelper.convert(clientDTO, ClientDO.class),
                        param), ClientDTO.class);
    }

    @Override
    public void check(ClientDTO client) {
        Boolean checkName = !StringUtils.isEmpty(client.getName());
        if (!checkName) {
            throw new CommonException("error.clientName.null");
        } else {
            checkName(client);
        }
    }

    @Override
    public Page<ClientDTO> pagingQueryUsersByRoleIdOnSiteLevel(PageRequest pageRequest, ClientRoleSearchDTO clientRoleSearchDTO, Long roleId) {
        return ConvertPageHelper.convertPage(clientRepository.pagingQueryClientsByRoleIdAndOptions(pageRequest, clientRoleSearchDTO, roleId, 0L, ResourceLevel.SITE.value()), ClientDTO.class);
    }

    @Override
    public Page<ClientDTO> pagingQueryClientsByRoleIdOnOrganizationLevel(PageRequest pageRequest, ClientRoleSearchDTO clientRoleSearchDTO, Long roleId, Long sourceId) {
        return ConvertPageHelper.convertPage(clientRepository.pagingQueryClientsByRoleIdAndOptions(pageRequest, clientRoleSearchDTO, roleId, sourceId, ResourceLevel.ORGANIZATION.value()), ClientDTO.class);
    }

    @Override
    public Page<ClientDTO> pagingQueryClientsByRoleIdOnProjectLevel(PageRequest pageRequest, ClientRoleSearchDTO clientRoleSearchDTO, Long roleId, Long sourceId) {
        return ConvertPageHelper.convertPage(clientRepository.pagingQueryClientsByRoleIdAndOptions(pageRequest, clientRoleSearchDTO, roleId, sourceId, ResourceLevel.PROJECT.value()), ClientDTO.class);
    }

    private void checkName(ClientDTO client) {
        Boolean createCheck = StringUtils.isEmpty(client.getId());
        String name = client.getName();
        ClientDO clientDO = new ClientDO();
        clientDO.setName(name);
        if (createCheck) {
            Boolean existed = clientRepository.selectOne(clientDO) != null;
            if (existed) {
                throw new CommonException("error.clientName.exist");
            }
        } else {
            Long id = client.getId();
            ClientDO clientDO1 = clientRepository.selectOne(clientDO);
            Boolean existed = clientDO1 != null && !id.equals(clientDO1.getId());
            if (existed) {
                throw new CommonException("error.clientName.exist");
            }
        }

    }

    private void isOrgExist(Long orgId) {
        if (organizationRepository.selectByPrimaryKey(orgId) == null) {
            throw new CommonException("error.organization.notFound");
        }
    }

    private String generateString(Random random, String characters, int length) {
        char[] text = new char[length];
        for (int i = 0; i < length; i++) {
            text[i] = characters.charAt(random.nextInt(characters.length()));
        }
        return new String(text);
    }

    @Override
    public Page<SimplifiedClientDTO> pagingQueryAllClients(PageRequest pageRequest, String params) {
        return clientRepository.pagingAllClientsByParams(pageRequest, params);
    }
}
