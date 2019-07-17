package io.choerodon.iam.app.service;

import com.github.pagehelper.PageInfo;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.iam.api.query.ClientRoleQuery;
import io.choerodon.iam.api.dto.SimplifiedClientDTO;
import io.choerodon.iam.infra.dto.ClientDTO;

/**
 * @author wuguokai
 */
public interface ClientService {
    ClientDTO create(Long orgId, ClientDTO clientDTO);

    ClientDTO getDefaultCreateData(Long orgId);

    /**
     * 更新客户端
     *
     * @param clientDTO
     * @return
     */
    ClientDTO update(ClientDTO clientDTO);

    /**
     * 根据id删除客户端，同时删除member_role里的关系数据
     *
     * @param orgId
     * @param clientId
     */
    void delete(Long orgId, Long clientId);

    ClientDTO query(Long orgId, Long clientId);

    ClientDTO queryByName(Long orgId, String clientName);

    /**
     * 分页查询client
     *
     * @param clientDTO
     * @param pageRequest
     * @param param
     * @return
     */
    PageInfo<ClientDTO> list(ClientDTO clientDTO, PageRequest pageRequest, String param);

    void check(ClientDTO client);

    PageInfo<ClientDTO> pagingQueryUsersByRoleId(PageRequest pageRequest, ResourceType resourceType, Long sourceId, ClientRoleQuery clientRoleSearchDTO, Long roleId);


    PageInfo<SimplifiedClientDTO> pagingQueryAllClients(PageRequest pageRequest, String params);
}
