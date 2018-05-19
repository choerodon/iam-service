package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dataobject.IconDO;
import io.choerodon.mybatis.common.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author superlee
 * @data 2018-04-11
 */
public interface IconMapper extends BaseMapper<IconDO> {

    List fulltextSearch(@Param("code") String code);
}
