package io.choerodon.iam.infra.asserts;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.dto.ApplicationDTO;
import io.choerodon.iam.infra.mapper.ApplicationMapper;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

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
}
