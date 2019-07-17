package io.choerodon.iam.infra.asserts;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.dto.RoleDTO;
import io.choerodon.iam.infra.exception.AlreadyExsitedException;
import io.choerodon.iam.infra.exception.NotExistedException;
import io.choerodon.iam.infra.mapper.RoleMapper;
import org.springframework.stereotype.Component;

/**
 * 角色断言帮助类
 *
 * @author superlee
 * @since 2019-04-15
 */
@Component
public class RoleAssertHelper extends AssertHelper {

    private RoleMapper roleMapper;

    public RoleAssertHelper(RoleMapper roleMapper) {
        this.roleMapper = roleMapper;
    }

    public void codeExisted(String code) {
        RoleDTO dto = new RoleDTO();
        dto.setCode(code);
        if (roleMapper.selectOne(dto) != null) {
            throw new AlreadyExsitedException("error.role.code.existed");
        }
    }

    public RoleDTO roleNotExisted(Long id) {
        return roleNotExisted(id, "error.role.not.exist");
    }

    public RoleDTO roleNotExisted(Long id, String message) {
        RoleDTO dto = roleMapper.selectByPrimaryKey(id);
        if (dto == null) {
            throw new CommonException(message, id);
        }
        return dto;
    }

    public RoleDTO roleNotExisted(String code) {
        return roleNotExisted(code, "error.role.not.existed");
    }

    public RoleDTO roleNotExisted(String code, String message) {
        RoleDTO dto = new RoleDTO();
        dto.setCode(code);
        RoleDTO result = roleMapper.selectOne(dto);
        if (result == null) {
            throw new NotExistedException(message);
        }
        return result;
    }
}
