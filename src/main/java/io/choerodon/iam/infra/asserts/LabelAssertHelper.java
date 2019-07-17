package io.choerodon.iam.infra.asserts;

import io.choerodon.iam.infra.dto.LabelDTO;
import io.choerodon.iam.infra.exception.NotExistedException;
import io.choerodon.iam.infra.mapper.LabelMapper;
import org.springframework.stereotype.Component;

/**
 * label断言类
 *
 * @author superlee
 * @since 2019-07-15
 */
@Component
public class LabelAssertHelper extends AssertHelper {

    private LabelMapper labelMapper;

    public  LabelAssertHelper (LabelMapper labelMapper) {
        this.labelMapper = labelMapper;
    }

    public LabelDTO labelNotExisted(Long id) {
        return labelNotExisted(id, "error.label.not.exist");
    }

    public LabelDTO labelNotExisted(Long id, String message) {
        LabelDTO dto = labelMapper.selectByPrimaryKey(id);
        if(dto == null) {
            throw new NotExistedException(message);
        }
        return dto;
    }
}
