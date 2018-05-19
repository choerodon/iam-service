package io.choerodon.iam.infra.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.infra.dataobject.LookupDO;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author superlee
 */
public interface LookupMapper extends BaseMapper<LookupDO> {
    List<LookupDO> fulltextSearch(@Param("lookupDO") LookupDO lookupDO,
                                  @Param("param") String param);

    LookupDO selectByCodeWithLookupValues(String code);
}
