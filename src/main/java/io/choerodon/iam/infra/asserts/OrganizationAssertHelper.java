package io.choerodon.iam.infra.asserts;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.dto.OrganizationDTO;
import io.choerodon.iam.infra.mapper.OrganizationMapper;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

/**
 * 组织断言帮助类
 *
 * @author superlee
 * @since 2019-05-13
 */
@Component
public class OrganizationAssertHelper extends AssertHelper {

    private OrganizationMapper organizationMapper;

    public OrganizationAssertHelper(OrganizationMapper organizationMapper) {
        this.organizationMapper = organizationMapper;
    }

    public OrganizationDTO organizationNotExisted(Long id) {
        return organizationNotExisted(id, "error.organization.not.exist");
    }

    public OrganizationDTO organizationNotExisted(Long id, String message) {
        OrganizationDTO dto = organizationMapper.selectByPrimaryKey(id);
        if (ObjectUtils.isEmpty(dto)) {
            throw new CommonException(message, id);
        }
        return dto;
    }

    public OrganizationDTO organizationNotExisted(String code) {
        return organizationNotExisted(code, "error.organization.not.exist");
    }

    public OrganizationDTO organizationNotExisted(String code, String message) {
        OrganizationDTO dto = new OrganizationDTO();
        dto.setCode(code);
        OrganizationDTO result = organizationMapper.selectOne(dto);
        if (ObjectUtils.isEmpty(dto)) {
            throw new CommonException(message);
        }
        return result;
    }
}
