package io.choerodon.iam.infra.asserts;

import io.choerodon.iam.infra.dto.ClientDTO;
import io.choerodon.iam.infra.exception.NotExistedException;
import io.choerodon.iam.infra.mapper.ClientMapper;
import org.springframework.stereotype.Component;

/**
 * 客户端断言帮助类
 *
 * @author superlee
 * @since 2019-07-10
 */
@Component
public class ClientAssertHelper extends AssertHelper {

    private ClientMapper clientMapper;

    public ClientAssertHelper(ClientMapper clientMapper) {
        this.clientMapper = clientMapper;
    }

    public ClientDTO clientNotExisted(Long id) {
        return clientNotExisted(id, "error.client.not.existed");
    }

    public ClientDTO clientNotExisted(Long id, String message) {
        ClientDTO dto = clientMapper.selectByPrimaryKey(id);
        if (dto == null) {
            throw new NotExistedException(message);
        }
        return dto;
    }

    public ClientDTO clientNotExisted(String name) {
        return clientNotExisted(name, "error.client.not.existed");
    }

    public ClientDTO clientNotExisted(String name, String message) {
        ClientDTO dto = new ClientDTO();
        dto.setName(name);
        ClientDTO result = clientMapper.selectOne(dto);
        if (result == null) {
            throw new NotExistedException(message);
        }
        return result;
    }
}
