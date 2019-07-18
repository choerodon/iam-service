package io.choerodon.iam.infra.asserts;

import io.choerodon.iam.infra.dto.PermissionDTO;
import io.choerodon.iam.infra.exception.NotExistedException;
import io.choerodon.iam.infra.mapper.PermissionMapper;
import org.springframework.stereotype.Component;

/**
 * permission断言类
 *
 * @author superlee
 * @since 2019-07-15
 */
@Component
public class PermissionAssertHelper extends AssertHelper {

    private PermissionMapper permissionMapper;

    public PermissionAssertHelper(PermissionMapper permissionMapper) {
        this.permissionMapper = permissionMapper;
    }

    public PermissionDTO permissionNotExisted(Long id) {
        return permissionNotExisted(id, "error.permission.not.exist");
    }

    public PermissionDTO permissionNotExisted(String code) {
        return permissionNotExisted(code, "error.permission.not.exist");
    }

    public PermissionDTO permissionNotExisted(String code, String message) {
        PermissionDTO dto = new PermissionDTO();
        dto.setCode(code);
        PermissionDTO result = permissionMapper.selectOne(dto);
        if (result == null) {
            throw new NotExistedException(message);

        }
        return result;
    }

    public PermissionDTO permissionNotExisted(Long id, String message) {
        PermissionDTO dto = permissionMapper.selectByPrimaryKey(id);
        if (dto == null) {
            throw new NotExistedException(message);
        }
        return dto;
    }

    public boolean codeExisted(String code) {
        PermissionDTO dto = new PermissionDTO();
        dto.setCode(code);
        return permissionMapper.selectOne(dto) != null;
    }
}
