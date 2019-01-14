package io.choerodon.iam.infra.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.api.dto.AuditDTO;
import io.choerodon.iam.infra.dataobject.AuditDO;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * Created by Eugen on 01/03/2019.
 */
public interface AuditMapper extends BaseMapper<AuditDO> {

    List<AuditDTO> selectByParams(@Param("userId") Long userId,
                                  @Param("businessType") String businessType,
                                  @Param("dataType") String dataType);

}
