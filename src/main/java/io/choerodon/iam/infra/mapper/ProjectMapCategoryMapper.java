package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dto.ProjectMapCategoryDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


/**
 * @author Eugen
 */
public interface ProjectMapCategoryMapper extends Mapper<ProjectMapCategoryDTO> {

    List<String> selectProjectCategories(@Param("projectId") Long projectId);

    /**
     * 批量插入
     *
     * @param records
     * @return
     */
    int batchInsert(@Param("records") List<ProjectMapCategoryDTO> records);

}
