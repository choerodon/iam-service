package io.choerodon.iam.domain.repository;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.ClientRoleSearchDTO;
import io.choerodon.iam.domain.oauth.entity.ClientE;
import io.choerodon.iam.infra.dataobject.ClientDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author wuguokai
 */
public interface ClientRepository {
    ClientE create(ClientE clientE);

    Boolean delete(Long clientId);

    ClientE query(Long clientId);

    ClientE queryByClientName(String clientName);

    ClientE update(Long clientId, ClientE clientE);

    Page<ClientE> pagingQuery(PageRequest pageRequest, ClientDO clientDO, String param);

    ClientDO selectOne(ClientDO clientDO);

    Integer selectClientCountFromMemberRoleByOptions(Long roleId, Long sourceId, String sourceType, ClientRoleSearchDTO clientRoleSearchDTO, String param);

    Page<ClientDO> pagingQueryClientsByRoleIdAndOptions(PageRequest pageRequest, ClientRoleSearchDTO clientRoleSearchDTO, Long roleId, Long sourceId, String sourceType);
}
