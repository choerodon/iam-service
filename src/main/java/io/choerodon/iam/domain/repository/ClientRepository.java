package io.choerodon.iam.domain.repository;

import com.github.pagehelper.PageInfo;
import io.choerodon.iam.api.dto.ClientRoleSearchDTO;
import io.choerodon.iam.api.dto.SimplifiedClientDTO;
import io.choerodon.iam.infra.dto.ClientDTO;

/**
 * @author wuguokai
 */
public interface ClientRepository {
    ClientDTO create(ClientDTO clientDTO);

    Boolean delete(Long clientId);

    ClientDTO query(Long clientId);

    ClientDTO queryByClientName(String clientName);

    ClientDTO update(Long clientId, ClientDTO clientDTO);

    PageInfo<ClientDTO> pagingQuery(int page, int size, ClientDTO clientDTO, String param);

    ClientDTO selectOne(ClientDTO clientDTO);

    Integer selectClientCountFromMemberRoleByOptions(Long roleId, Long sourceId, String sourceType, ClientRoleSearchDTO clientRoleSearchDTO, String param);

    PageInfo<ClientDTO> pagingQueryClientsByRoleIdAndOptions(int page,int size, ClientRoleSearchDTO clientRoleSearchDTO, Long roleId, Long sourceId, String sourceType);

    PageInfo<SimplifiedClientDTO> pagingAllClientsByParams(int page,int size, String params);


}
