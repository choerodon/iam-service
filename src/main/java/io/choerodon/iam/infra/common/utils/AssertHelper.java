package io.choerodon.iam.infra.common.utils;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.dataobject.ApplicationDO;
import io.choerodon.iam.infra.dataobject.OrganizationDO;
import io.choerodon.iam.infra.dataobject.ProjectDO;
import io.choerodon.iam.infra.mapper.ApplicationMapper;
import io.choerodon.iam.infra.mapper.OrganizationMapper;
import io.choerodon.iam.infra.mapper.ProjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

/**
 * 断言帮助类，用于抽象常用的校验，抛出{@link CommonException}
 *
 * @author superlee
 * @since 0.15.0
 */
@Component
public class AssertHelper {

    @Autowired
    private OrganizationMapper organizationMapper;
    @Autowired
    private ProjectMapper projectMapper;
    @Autowired
    private ApplicationMapper applicationMapper;

    public OrganizationDO organizationNotExisted(Long id) {
        OrganizationDO organizationDO = organizationMapper.selectByPrimaryKey(id);
        if (ObjectUtils.isEmpty(organizationDO)) {
            throw new CommonException("error.organization.notFound", id);
        }
        return organizationDO;
    }

    public OrganizationDO organizationNotExisted(Long id, String message) {
        OrganizationDO organizationDO = organizationMapper.selectByPrimaryKey(id);
        if (ObjectUtils.isEmpty(organizationDO)) {
            throw new CommonException(message, id);
        }
        return organizationDO;
    }

    public ProjectDO projectNotExisted(Long id) {
        ProjectDO projectDO = projectMapper.selectByPrimaryKey(id);
        if (ObjectUtils.isEmpty(projectDO)) {
            throw new CommonException("error.project.not.exist", id);
        }
        return projectDO;
    }

    public ProjectDO projectNotExisted(Long id, String message) {
        ProjectDO projectDO = projectMapper.selectByPrimaryKey(id);
        if (ObjectUtils.isEmpty(projectMapper.selectByPrimaryKey(id))) {
            throw new CommonException(message, id);
        }
        return projectDO;
    }

    public void objectVersionNumberNotNull(Long objectVersionNumber){
        if (ObjectUtils.isEmpty(objectVersionNumber)) {
            throw new CommonException("error.objectVersionNumber.null");
        }
    }

    public ApplicationDO applicationNotExisted(Long id) {
        ApplicationDO applicationDO = applicationMapper.selectByPrimaryKey(id);
        if (ObjectUtils.isEmpty(applicationDO)) {
            throw new CommonException("error.application.not.exist");
        }
        return applicationDO;
    }

    public ApplicationDO applicationNotExisted(Long id, String message) {
        ApplicationDO applicationDO = applicationMapper.selectByPrimaryKey(id);
        if (ObjectUtils.isEmpty(applicationDO)) {
            throw new CommonException(message);
        }
        return applicationDO;
    }
}
