package io.choerodon.iam.app.service.impl;

import java.util.Random;

import com.github.pagehelper.PageInfo;
import io.choerodon.iam.infra.dto.ClientDTO;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.ClientRoleSearchDTO;
import io.choerodon.iam.api.dto.SimplifiedClientDTO;
import io.choerodon.iam.app.service.ClientService;
import io.choerodon.iam.domain.repository.ClientRepository;
import io.choerodon.iam.domain.repository.OrganizationRepository;

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
        return clientRepository.create(clientDTO);
    }

    /**
     * 创建客户端时生成随机的clientId和secret
     */
    @Override
    public ClientDTO getDefaultCreatedata(Long orgId) {
        String name = "";
        boolean flag = false;
        while (!flag) {
            name = generateString(new Random(), SOURCES, 12);
            ClientDTO clientDTO = new ClientDTO();
            clientDTO.setName(name);
            ClientDTO clientByName = clientRepository.selectOne(clientDTO);
            if (clientByName == null) {
                flag = true;
            }
        }
        ClientDTO clientDTO = new ClientDTO();
        clientDTO.setName(name);
        clientDTO.setSecret(generateString(new Random(), SOURCES, 16));
        return clientDTO;
    }

    @Override
    public ClientDTO update(Long orgId, Long clientId, ClientDTO clientDTO) {
        isOrgExist(orgId);
        return clientRepository.update(clientId, clientDTO);
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
        ClientDTO clientDTO = clientRepository.query(clientId);
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
        ClientDTO clientDTO = clientRepository.queryByClientName(clientName);
        if (clientDTO == null) {
            throw new CommonException("error.client.not.exist");
        }
        if (!orgId.equals(clientDTO.getOrganizationId())) {
            throw new CommonException(ORGANIZATION_ID_NOT_EQUAL_EXCEPTION);
        }
        return clientDTO;
    }

    @Override
    public PageInfo<ClientDTO> list(ClientDTO clientDTO, int page, int size, String param) {
        isOrgExist(clientDTO.getOrganizationId());
        return clientRepository.pagingQuery(page,size,clientDTO,param);
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
    public PageInfo<ClientDTO> pagingQueryUsersByRoleIdOnSiteLevel(int page,int size, ClientRoleSearchDTO clientRoleSearchDTO, Long roleId) {
        return clientRepository.pagingQueryClientsByRoleIdAndOptions(page,size, clientRoleSearchDTO, roleId, 0L, ResourceLevel.SITE.value());
    }

    @Override
    public PageInfo<ClientDTO> pagingQueryClientsByRoleIdOnOrganizationLevel(int page,int size, ClientRoleSearchDTO clientRoleSearchDTO, Long roleId, Long sourceId) {
        return clientRepository.pagingQueryClientsByRoleIdAndOptions(page,size, clientRoleSearchDTO, roleId, sourceId, ResourceLevel.ORGANIZATION.value());
    }

    @Override
    public PageInfo<ClientDTO> pagingQueryClientsByRoleIdOnProjectLevel(int page,int size, ClientRoleSearchDTO clientRoleSearchDTO, Long roleId, Long sourceId) {
        return clientRepository.pagingQueryClientsByRoleIdAndOptions(page,size, clientRoleSearchDTO, roleId, sourceId, ResourceLevel.PROJECT.value());
    }

    private void checkName(ClientDTO client) {
        Boolean createCheck = StringUtils.isEmpty(client.getId());
        String name = client.getName();
        ClientDTO clientDTO = new ClientDTO();
        clientDTO.setName(name);
        if (createCheck) {
            Boolean existed = clientRepository.selectOne(clientDTO) != null;
            if (existed) {
                throw new CommonException("error.clientName.exist");
            }
        } else {
            Long id = client.getId();
            ClientDTO dto = clientRepository.selectOne(clientDTO);
            Boolean existed = dto != null && !id.equals(dto.getId());
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
    public PageInfo<SimplifiedClientDTO> pagingQueryAllClients(int page, int size, String params) {
        return clientRepository.pagingAllClientsByParams(page,size, params);
    }
}
