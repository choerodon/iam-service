package io.choerodon.iam.app.service;

import com.github.pagehelper.Page;
import io.choerodon.iam.api.dto.ClientRoleSearchDTO;
import io.choerodon.iam.api.dto.SimplifiedClientDTO;
import io.choerodon.iam.infra.dto.ClientDTO;

/**
 * @author wuguokai
 */
public interface ClientService {
    ClientDTO create(Long orgId, ClientDTO clientDTO);

    ClientDTO getDefaultCreatedata(Long orgId);

    ClientDTO update(Long orgId, Long clientId, ClientDTO clientDTO);

    Boolean delete(Long orgId, Long clientId);

    ClientDTO query(Long orgId, Long clientId);

    ClientDTO queryByName(Long orgId, String clientName);

    Page<ClientDTO> list(ClientDTO clientDTO, int page, int size, String param);

    void check(ClientDTO client);

    Page<ClientDTO> pagingQueryUsersByRoleIdOnSiteLevel(int page, int size, ClientRoleSearchDTO clientRoleSearchDTO, Long roleId);

    Page<ClientDTO> pagingQueryClientsByRoleIdOnOrganizationLevel(int page, int size, ClientRoleSearchDTO clientRoleSearchDTO, Long roleId, Long sourceId);

    Page<ClientDTO> pagingQueryClientsByRoleIdOnProjectLevel(int page, int size, ClientRoleSearchDTO clientRoleSearchDTO, Long roleId, Long sourceId);

    Page<SimplifiedClientDTO> pagingQueryAllClients(int page, int size, String params);
}
