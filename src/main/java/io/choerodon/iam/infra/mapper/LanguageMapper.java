package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dto.LanguageDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author superlee
 */
public interface LanguageMapper extends Mapper<LanguageDTO> {

    List<LanguageDTO> fulltextSearch(@Param("languageDTO") LanguageDTO languageDTO,
                                    @Param("param") String param);
}
