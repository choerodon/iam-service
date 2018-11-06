package io.choerodon.iam.app.service;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.ClientCreateDTO;
import io.choerodon.iam.api.dto.ClientDTO;
import io.choerodon.iam.api.dto.ClientRoleSearchDTO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author wuguokai
 */
public interface ClientService {
    ClientDTO create(Long orgId, ClientDTO clientDTO);

    ClientCreateDTO getDefaultCreatedata(Long orgId);

    ClientDTO update(Long orgId, Long clientId, ClientDTO clientDTO);

    Boolean delete(Long orgId, Long clientId);

    ClientDTO query(Long orgId, Long clientId);

    ClientDTO queryByName(Long orgId, String clientName);

    Page<ClientDTO> list(ClientDTO clientDTO, PageRequest pageRequest, String param);

    void check(ClientDTO client);

    Page<ClientDTO> pagingQueryUsersByRoleIdOnSiteLevel(PageRequest pageRequest, ClientRoleSearchDTO clientRoleSearchDTO, Long roleId);

    Page<ClientDTO> pagingQueryClientsByRoleIdOnOrganizationLevel(PageRequest pageRequest, ClientRoleSearchDTO clientRoleSearchDTO, Long roleId, Long sourceId);

    Page<ClientDTO> pagingQueryClientsByRoleIdOnProjectLevel(PageRequest pageRequest, ClientRoleSearchDTO clientRoleSearchDTO, Long roleId, Long sourceId);
}
