package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dataobject.ProjectTypeDO;
import io.choerodon.mybatis.common.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ProjectTypeMapper extends BaseMapper<ProjectTypeDO> {
    /**
     * 模糊查询projectType
     *
     * @param name
     * @param code
     * @param param
     * @return
     */
    List fuzzyQuery(@Param("name") String name,
                    @Param("code") String code,
                    @Param("param") String param);
}
