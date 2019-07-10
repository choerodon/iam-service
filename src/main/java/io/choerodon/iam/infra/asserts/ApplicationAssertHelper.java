package io.choerodon.iam.infra.asserts;

import org.springframework.stereotype.Component;
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

    private static final String ERROR_APPLICATION_NOT_EXIST = "error.application.not.exist";
    private static final String ERROR_APPLICATION_EXIST = "error.application.exist";
    private ApplicationMapper applicationMapper;

    public ApplicationAssertHelper(ApplicationMapper applicationMapper) {
        this.applicationMapper = applicationMapper;
    }

    public ApplicationDTO applicationNotExisted(Long id) {
        ApplicationDTO applicationDTO = applicationMapper.selectByPrimaryKey(id);
        if (ObjectUtils.isEmpty(applicationDTO)) {
            throw new CommonException(ERROR_APPLICATION_NOT_EXIST);
        }
        return applicationDTO;
    }

    public void applicationExisted(ApplicationDTO applicationDTO) {
        ApplicationDTO example = new ApplicationDTO();
        example.setCode(applicationDTO.getCode());
        example.setProjectId(applicationDTO.getProjectId());
        example.setOrganizationId(applicationDTO.getOrganizationId());
        example = applicationMapper.selectOne(example);
        if (!ObjectUtils.isEmpty(example)) {
            throw new CommonException(ERROR_APPLICATION_EXIST);
        }
    }
}
