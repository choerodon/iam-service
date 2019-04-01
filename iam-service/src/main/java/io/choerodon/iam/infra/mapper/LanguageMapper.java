package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dataobject.LanguageDO;
import io.choerodon.mybatis.common.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author superlee
 */
public interface LanguageMapper extends BaseMapper<LanguageDO> {

    List<LanguageDO> fulltextSearch(@Param("languageDO") LanguageDO languageDO,
                                    @Param("param") String param);
}
