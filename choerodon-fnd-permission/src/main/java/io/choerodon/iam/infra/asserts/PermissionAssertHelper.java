package io.choerodon.iam.infra.asserts;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.dto.PermissionDTO;
import io.choerodon.iam.infra.mapper.PermissionMapper;
import org.springframework.stereotype.Component;

/**
 * @author superlee
 * @since 2019-04-16
 */
@Component
public class PermissionAssertHelper {

    private PermissionMapper permissionMapper;

    public PermissionAssertHelper(PermissionMapper permissionMapper) {
        this.permissionMapper = permissionMapper;
    }

    public PermissionDTO permissionNotExisted(Long id) {
        return permissionNotExisted(id, "error.permission.not.exist");
    }

    public PermissionDTO permissionNotExisted(Long id, String message) {
        PermissionDTO dto = permissionMapper.selectByPrimaryKey(id);
        if (dto == null) {
            throw new CommonException(message, id);
        }
        return dto;
    }
}
