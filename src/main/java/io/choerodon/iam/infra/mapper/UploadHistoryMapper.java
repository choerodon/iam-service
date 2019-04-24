package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dto.UploadHistoryDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * @author superlee
 */
public interface UploadHistoryMapper extends Mapper<UploadHistoryDTO> {
    UploadHistoryDTO latestHistory(@Param("userId") Long userId,
                                  @Param("type") String type,
                                  @Param("sourceId") Long sourceId,
                                  @Param("sourceType")String sourceType);
}
