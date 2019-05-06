package io.choerodon.iam.infra.repository.impl;

import java.util.Optional;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import io.choerodon.iam.infra.dto.ClientDTO;
import org.springframework.stereotype.Component;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.ClientRoleSearchDTO;
import io.choerodon.iam.api.dto.SimplifiedClientDTO;
import io.choerodon.iam.domain.repository.ClientRepository;
import io.choerodon.iam.infra.common.utils.ParamUtils;
import io.choerodon.iam.infra.mapper.ClientMapper;
import io.choerodon.iam.infra.mapper.MemberRoleMapper;

/**
 * @author wuguokai
 */
@Component
public class ClientRepositoryImpl implements ClientRepository {

    private ClientMapper clientMapper;

    private MemberRoleMapper memberRoleMapper;

    public ClientRepositoryImpl(ClientMapper clientMapper, MemberRoleMapper memberRoleMapper) {
        this.clientMapper = clientMapper;
        this.memberRoleMapper = memberRoleMapper;
    }


    @Override
    public ClientDTO create(ClientDTO clientDTO) {
        int isInsert = clientMapper.insertSelective(clientDTO);
        if (isInsert != 1) {
            throw new CommonException("error.client.create");
        }
        return clientMapper.selectByPrimaryKey(clientDTO);
    }

    @Override
    public ClientDTO query(Long clientId) {
        return clientMapper.selectByPrimaryKey(clientId);
    }

    @Override
    public Boolean delete(Long clientId) {
        // delete the member-role relationship before the client was deleted
        memberRoleMapper.deleteMemberRoleByMemberIdAndMemberType(clientId, "client");

        int isDelete = clientMapper.deleteByPrimaryKey(clientId);
        if (isDelete != 1) {
            throw new CommonException("error.client.delete");
        }
        return true;
    }

    @Override
    public ClientDTO queryByClientName(String clientName) {
        ClientDTO clientDTO = new ClientDTO();
        clientDTO.setName(clientName);
        return clientMapper.selectOne(clientDTO);
    }

    @Override
    public ClientDTO update(Long clientId, ClientDTO clientDTO) {
        clientDTO.setId(clientId);
        int isUpdate = clientMapper.updateByPrimaryKey(clientDTO);
        if (isUpdate != 1) {
            throw new CommonException("error.client.update");
        }
        return clientMapper.selectByPrimaryKey(clientDTO);
    }

    @Override
    public PageInfo<ClientDTO> pagingQuery(int page, int size, ClientDTO clientDTO, String param) {
        return PageHelper.startPage(page, size).doSelectPageInfo(() -> clientMapper.fulltextSearch(clientDTO, param));
    }

    @Override
    public ClientDTO selectOne(ClientDTO clientDTO) {
        return clientMapper.selectOne(clientDTO);
    }

    @Override
    public Integer selectClientCountFromMemberRoleByOptions(Long roleId, Long sourceId, String sourceType, ClientRoleSearchDTO clientRoleSearchDTO, String param) {
        return clientMapper.selectClientCountFromMemberRoleByOptions(roleId, sourceType, sourceId, clientRoleSearchDTO, param);
    }

    @Override
    public PageInfo<ClientDTO> pagingQueryClientsByRoleIdAndOptions(int page, int size, ClientRoleSearchDTO clientRoleSearchDTO, Long roleId, Long sourceId, String sourceType) {
        String param = Optional.ofNullable(clientRoleSearchDTO).map(dto -> ParamUtils.arrToStr(dto.getParam())).orElse(null);
        return PageHelper.startPage(page, size).doSelectPageInfo(() -> clientMapper.selectClientsByRoleIdAndOptions(roleId, sourceId, sourceType, clientRoleSearchDTO, param));
    }

    @Override
    public PageInfo<SimplifiedClientDTO> pagingAllClientsByParams(int page, int size, String params) {
        return PageHelper.startPage(page, size).doSelectPageInfo(() -> clientMapper.selectAllClientSimplifiedInfo(params));
    }
}
