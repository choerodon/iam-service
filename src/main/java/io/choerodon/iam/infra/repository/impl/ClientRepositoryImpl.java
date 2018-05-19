package io.choerodon.iam.infra.repository.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.oauth.entity.ClientE;
import io.choerodon.iam.domain.repository.ClientRepository;
import io.choerodon.iam.infra.dataobject.ClientDO;
import io.choerodon.iam.infra.mapper.ClientMapper;
import io.choerodon.mybatis.pagehelper.PageHelper;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author wuguokai
 */
@Component
public class ClientRepositoryImpl implements ClientRepository {
    private static final Logger LOGGER = LoggerFactory.getLogger(ClientRepositoryImpl.class);

    private ClientMapper clientMapper;

    public ClientRepositoryImpl(ClientMapper clientMapper) {
        this.clientMapper = clientMapper;
    }


    @Override
    public ClientE create(ClientE clientE) {
        ClientDO clientDO = ConvertHelper.convert(clientE, ClientDO.class);
        int isInsert = clientMapper.insertSelective(clientDO);
        if (isInsert != 1) {
            throw new CommonException("error.client.create");
        }
        clientDO = clientMapper.selectByPrimaryKey(clientDO.getId());
        return ConvertHelper.convert(clientDO, ClientE.class);
    }

    @Override
    public ClientE query(Long clientId) {
        ClientDO clientDO = clientMapper.selectByPrimaryKey(clientId);
        return ConvertHelper.convert(clientDO, ClientE.class);
    }

    @Override
    public Boolean delete(Long clientId) {
        int isDelete = clientMapper.deleteByPrimaryKey(clientId);
        if (isDelete != 1) {
            throw new CommonException("error.client.delete");
        }
        return true;
    }

    @Override
    public ClientE queryByClientName(String clientName) {
        ClientDO clientDO = new ClientDO();
        clientDO.setName(clientName);
        List<ClientDO> clientDOS = clientMapper.select(clientDO);
        if (clientDOS.isEmpty()) {
            throw new CommonException("error.client.not.exit");
        }
        return ConvertHelper.convert(clientDOS.get(0), ClientE.class);
    }

    @Override
    public ClientE update(Long clientId, ClientE clientE) {
        ClientDO clientDO = ConvertHelper.convert(clientE, ClientDO.class);
        clientDO.setId(clientId);
        int isUpdate = clientMapper.updateByPrimaryKeySelective(clientDO);
        if (isUpdate != 1) {
            throw new CommonException("error.client.update");
        }
        clientDO = clientMapper.selectByPrimaryKey(clientDO.getId());
        return ConvertHelper.convert(clientDO, ClientE.class);
    }

    @Override
    public Page<ClientE> pagingQuery(PageRequest pageRequest, ClientDO clientDO, String[] params) {
        clientDO.setOrganizationId(clientDO.getOrganizationId());
        Page<ClientDO> clientDOPage
                = PageHelper.doPageAndSort(pageRequest, () -> clientMapper.fulltextSearch(clientDO, params));
        LOGGER.info("客户端查询结果： " + clientDOPage.getContent().size() +" : " + clientDOPage.getTotalElements());
        return ConvertPageHelper.convertPage(clientDOPage, ClientE.class);
    }

    @Override
    public ClientDO selectOne(ClientDO clientDO) {
        return clientMapper.selectOne(clientDO);
    }
}
