package io.choerodon.iam.infra.asserts;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.dto.ProjectDTO;
import io.choerodon.iam.infra.mapper.ProjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

/**
 * 项目断言帮助类
 *
 * @author superlee
 * @since 2019-05-13
 */
@Component
public class ProjectAssertHelper extends AssertHelper {

    private ProjectMapper projectMapper;

    public ProjectAssertHelper(ProjectMapper projectMapper) {
        this.projectMapper = projectMapper;
    }

    public ProjectDTO projectNotExisted(Long id) {
        return projectNotExisted(id, "error.project.not.exist");
    }

    public ProjectDTO projectNotExisted(Long id, String message) {
        ProjectDTO dto = projectMapper.selectByPrimaryKey(id);
        if (ObjectUtils.isEmpty(projectMapper.selectByPrimaryKey(id))) {
            throw new CommonException(message, id);
        }
        return dto;
    }
}
