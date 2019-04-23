package io.choerodon.iam.infra.mapper;

import java.util.List;

import io.choerodon.iam.infra.dto.AuditDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;


/**
 * Created by Eugen on 01/03/2019.
 */
public interface AuditMapper extends Mapper<AuditDTO> {

    List<AuditDTO> selectByParams(@Param("userId") Long userId,
                                  @Param("businessType") String businessType,
                                  @Param("dataType") String dataType);

}
