package io.choerodon.iam.app.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import io.choerodon.iam.api.dto.RelationshipCheckDTO;
import io.choerodon.iam.infra.dto.ProjectRelationshipDTO;

/**
 * @author Eugen
 */
public interface ProjectRelationshipService {

    /**
     * 查询项目群下的所有项目
     *
     * @param projectId 项目Id
     * @return
     */
    List<ProjectRelationshipDTO> getProjUnderGroup(Long projectId);

    /**
     * 项目组下移除项目
     *
     * @param groupId
     */
    void removesAProjUnderGroup(Long groupId);

    /**
     * 查询项目在该项目组下的不可用时间
     *
     * @param projectId 项目id
     * @param parentId  项目组id
     * @return
     */
    List<Map<String, Date>> getUnavailableTime(Long projectId, Long parentId);


    /**
     * 批量修改/新增/启停用项目组
     *
     * @param list
     * @return
     */
    List<ProjectRelationshipDTO> batchUpdateRelationShipUnderProgram(Long orgId, List<ProjectRelationshipDTO> list);

    /**
     * 校验项目关系能否被启用
     *
     * @param id
     * @return
     */
    RelationshipCheckDTO checkRelationshipCanBeEnabled(Long id);
}
