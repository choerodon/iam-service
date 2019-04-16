package io.choerodon.iam.app.service;

import com.github.pagehelper.Page;
import io.choerodon.iam.api.controller.query.RoleQuery;
import io.choerodon.iam.infra.dto.RoleDTO;

/**
 * @author superlee
 * @since 2019-04-15
 */
public interface RoleService {

    /**
     * 创建角色
     * @param roleDTO
     * @return
     */
    RoleDTO create(RoleDTO roleDTO);

    /**
     * 分页查询角色
     * @param page
     * @param size
     * @param roleQuery
     * @return
     */
    Page<RoleDTO> pagedSearch(int page, int size, RoleQuery roleQuery);

    /**
     * 更新角色
     * @param id
     * @param roleDTO
     * @return
     */
    RoleDTO update(Long id, RoleDTO roleDTO);
}
