package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dto.LookupDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author superlee
 */
public interface LookupMapper extends Mapper<LookupDTO> {

    List<LookupDTO> fulltextSearch(@Param("lookupDTO") LookupDTO lookupDTO,
                                  @Param("param") String param);

    LookupDTO selectByCodeWithLookupValues(String code);
}
