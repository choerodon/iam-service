package io.choerodon.iam.app.service;

import com.github.pagehelper.PageInfo;
import io.choerodon.iam.api.dto.ApplicationSearchDTO;
import io.choerodon.iam.infra.dto.ApplicationDTO;
import io.choerodon.iam.infra.dto.ApplicationExplorationDTO;

import java.util.List;

/**
 * @author superlee
 * @since 0.15.0
 */
public interface ApplicationService {
    /**
     * 新建应用
     *
     * @param applicationDTO
     * @return
     */
    ApplicationDTO create(ApplicationDTO applicationDTO);

    /**
     * 更新应用
     * code，organizationId不可更新，如果projectId非空也不可更新
     *
     * @param applicationDTO
     * @return
     */
    ApplicationDTO update(ApplicationDTO applicationDTO);

    /**
     * 删除应用.
     *
     * @param organizationId 组织Id
     * @param id             应用Id
     */
    void delete(Long organizationId, Long id);

    /**
     * 分页模糊查询applications.
     *
     * @param page
     * @param size
     * @param applicationSearchDTO
     * @return
     */
    PageInfo<ApplicationDTO> pagingQuery(int page, int size, ApplicationSearchDTO applicationSearchDTO, Boolean withDescendants);

    /**
     * 启用
     *
     * @param id
     * @return
     */
    ApplicationDTO enable(Long id);

    /**
     * 禁用
     *
     * @param id
     * @return
     */
    ApplicationDTO disable(Long id);

    /**
     * 获取{@link io.choerodon.iam.infra.enums.ApplicationType}的所有code
     *
     * @return
     */
    List<String> types();

    /**
     * 校验code，name的唯一性
     *
     * @param applicationDTO
     */
    void check(ApplicationDTO applicationDTO);

    /**
     * 在组织下面将应用或组合应用添加到指定的组合应用里
     *
     * @param organizationId 组织id
     * @param id             应用id，applicationCategory为combination-application {@link io.choerodon.iam.infra.enums.ApplicationCategory#COMBINATION}
     * @param ids            需要被分配的应用或组合应用
     */
    void addToCombination(Long organizationId, Long id, Long[] ids);

    /**
     * 查询指定组合应用下的所有节点
     *
     * @param id
     * @return
     */
    List<ApplicationExplorationDTO> queryDescendant(Long id);

    /**
     * 根据组合应用id查询下面所有的普通应用{@link io.choerodon.iam.infra.enums.ApplicationCategory#APPLICATION}
     *
     * @param id
     * @return
     */
    PageInfo<ApplicationDTO> queryApplicationList(int page, int size, Long id, String name, String code);

    /**
     * 查询可以向指定组合应用添加的后代，判别标准是不构成环
     *
     * @param id
     * @param organizationId
     * @return
     */
    List<ApplicationDTO> queryEnabledApplication(Long organizationId, Long id);

    /**
     * 根据id查询应用详情
     *
     * @param id
     * @param withDescendants 是否携带后代
     * @return
     */
    ApplicationDTO query(Long id, Boolean withDescendants);

    /**
     * 从组合应用中移除指定应用
     *
     * @param organizationId 组织id
     * @param id             应用id
     * @param ids            被移除的应用id数组
     */
    void deleteCombination(Long organizationId, Long id, Long[] ids);

    String getToken(Long id);

    String createToken(Long id);

    ApplicationDTO getApplicationByToken(String applicationToken);

    Long getIdByCode(String code, Long projectId);
}
