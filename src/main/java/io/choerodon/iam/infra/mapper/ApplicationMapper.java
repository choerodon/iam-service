package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dataobject.ApplicationDO;
import io.choerodon.mybatis.common.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author superlee
 * @since 0.15.0
 */
public interface ApplicationMapper extends BaseMapper<ApplicationDO> {
    /**
     * 模糊查询
     * @param example
     * @param param
     * @return
     */
    List fuzzyQuery(@Param("example") ApplicationDO example, @Param("param") String param);
}
