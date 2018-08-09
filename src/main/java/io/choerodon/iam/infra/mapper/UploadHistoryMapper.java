package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dataobject.UploadHistoryDO;
import io.choerodon.mybatis.common.BaseMapper;
import org.apache.ibatis.annotations.Param;

/**
 * @author superlee
 */
public interface UploadHistoryMapper extends BaseMapper<UploadHistoryDO> {
    UploadHistoryDO latestHistory(@Param("userId") Long userId,
                                  @Param("type") String type);
}
