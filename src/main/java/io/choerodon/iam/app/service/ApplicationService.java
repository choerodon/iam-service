package io.choerodon.iam.app.service;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.ApplicationDTO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

import java.util.List;

/**
 * @author superlee
 * @since 0.15.0
 */
public interface ApplicationService {
    /**
     * 新建应用
     * @param applicationDTO
     * @return
     */
    ApplicationDTO create(ApplicationDTO applicationDTO);

    /**
     * 更新应用
     * code，organizationId不可更新，如果projectId非空也不可更新
     * @param applicationDTO
     * @return
     */
    ApplicationDTO update(ApplicationDTO applicationDTO);

    /**
     * 分页模糊查询applications
     * @param pageRequest
     * @param applicationDTO
     * @return
     */
    Page<ApplicationDTO> pagingQuery(PageRequest pageRequest, ApplicationDTO applicationDTO);

    /**
     * 启用
     * @param id
     * @return
     */
    ApplicationDTO enable(Long id);

    /**
     * 禁用
     * @param id
     * @return
     */
    ApplicationDTO disable(Long id);

    /**
     * 获取{@link io.choerodon.iam.infra.enums.ApplicationType}的所有code
     * @return
     */
    List<String> types();

    /**
     * 校验code，name的唯一性
     * @param applicationDTO
     */
    void check(ApplicationDTO applicationDTO);
}
