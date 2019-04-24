package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dto.ProjectTypeDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ProjectTypeMapper extends Mapper<ProjectTypeDTO> {
    /**
     * 模糊查询projectType
     *
     * @param name
     * @param code
     * @param param
     * @return
     */
    List<ProjectTypeDTO> fuzzyQuery(@Param("name") String name,
                    @Param("code") String code,
                    @Param("param") String param);
}
