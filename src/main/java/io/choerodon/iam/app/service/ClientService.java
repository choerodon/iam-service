package io.choerodon.iam.app.service;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.ClientDTO;
import io.choerodon.iam.api.dto.ClientRoleSearchDTO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author wuguokai
 */
public interface ClientService {
    ClientDTO create(Long orgId, ClientDTO clientDTO);

    ClientDTO update(Long orgId, Long clientId, ClientDTO clientDTO);

    Boolean delete(Long orgId, Long clientId);

    ClientDTO query(Long orgId, Long clientId);

    ClientDTO queryByName(Long orgId, String clientName);

    Page<ClientDTO> list(ClientDTO clientDTO, PageRequest pageRequest, String param);

    void check(ClientDTO client);

    Page<ClientDTO> pagingQueryClientsByRoleIdAndOptions(PageRequest pageRequest, ClientRoleSearchDTO clientRoleSearchDTO, Long roleId, Long sourceId);
}
