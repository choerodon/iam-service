package io.choerodon.iam.infra.common.utils;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.dto.ApplicationDTO;
import io.choerodon.iam.infra.dto.OrganizationDTO;
import io.choerodon.iam.infra.dto.ProjectDTO;
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

    public OrganizationDTO organizationNotExisted(Long id) {
        OrganizationDTO dto = organizationMapper.selectByPrimaryKey(id);
        if (ObjectUtils.isEmpty(dto)) {
            throw new CommonException("error.organization.notFound", id);
        }
        return dto;
    }

    public OrganizationDTO organizationNotExisted(Long id, String message) {
        OrganizationDTO dto = organizationMapper.selectByPrimaryKey(id);
        if (ObjectUtils.isEmpty(dto)) {
            throw new CommonException(message, id);
        }
        return dto;
    }

    public ProjectDTO projectNotExisted(Long id) {
        ProjectDTO dto = projectMapper.selectByPrimaryKey(id);
        if (ObjectUtils.isEmpty(dto)) {
            throw new CommonException("error.project.not.exist", id);
        }
        return dto;
    }

    public ProjectDTO projectNotExisted(Long id, String message) {
        ProjectDTO dto = projectMapper.selectByPrimaryKey(id);
        if (ObjectUtils.isEmpty(projectMapper.selectByPrimaryKey(id))) {
            throw new CommonException(message, id);
        }
        return dto;
    }

    public void objectVersionNumberNotNull(Long objectVersionNumber){
        if (ObjectUtils.isEmpty(objectVersionNumber)) {
            throw new CommonException("error.objectVersionNumber.null");
        }
    }

    public ApplicationDTO applicationNotExisted(Long id) {
        ApplicationDTO applicationDTO = applicationMapper.selectByPrimaryKey(id);
        if (ObjectUtils.isEmpty(applicationDTO)) {
            throw new CommonException("error.application.not.exist");
        }
        return applicationDTO;
    }

    public ApplicationDTO applicationNotExisted(Long id, String message) {
        ApplicationDTO applicationDTO = applicationMapper.selectByPrimaryKey(id);
        if (ObjectUtils.isEmpty(applicationDTO)) {
            throw new CommonException(message);
        }
        return applicationDTO;
    }
}
