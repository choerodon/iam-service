package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dataobject.LookupDO;
import io.choerodon.mybatis.common.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author superlee
 */
public interface LookupMapper extends BaseMapper<LookupDO> {
    List<LookupDO> fulltextSearch(@Param("lookupDO") LookupDO lookupDO,
                                  @Param("param") String param);

    LookupDO selectByCodeWithLookupValues(String code);
}
