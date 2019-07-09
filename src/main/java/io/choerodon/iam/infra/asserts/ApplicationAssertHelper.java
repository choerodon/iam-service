package io.choerodon.iam.infra.asserts;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.dto.ApplicationDTO;
import io.choerodon.iam.infra.mapper.ApplicationMapper;

/**
 * 应用断言帮助类
 *
 * @author superlee
 * @since 2019-05-13
 */
@Component
public class ApplicationAssertHelper extends AssertHelper {

    private ApplicationMapper applicationMapper;

    public ApplicationAssertHelper(ApplicationMapper applicationMapper) {
        this.applicationMapper = applicationMapper;
    }

    public ApplicationDTO applicationNotExisted(Long id) {
        return applicationNotExisted(id, "error.application.not.exist");
    }

    public ApplicationDTO applicationNotExisted(Long id, String message) {
        ApplicationDTO applicationDTO = applicationMapper.selectByPrimaryKey(id);
        if (ObjectUtils.isEmpty(applicationDTO)) {
            throw new CommonException(message);
        }
        return applicationDTO;
    }

    public void applicationExisted(ApplicationDTO applicationDTO) {
        ApplicationDTO example = new ApplicationDTO();
        example.setCode(applicationDTO.getCode());
        example.setProjectId(applicationDTO.getProjectId());
        example.setOrganizationId(applicationDTO.getOrganizationId());
        List<ApplicationDTO> applicationDTOList = applicationMapper.select(example);
        if (!CollectionUtils.isEmpty(applicationDTOList)) {
            throw new CommonException("error.application.exist");
        }
    }
}
