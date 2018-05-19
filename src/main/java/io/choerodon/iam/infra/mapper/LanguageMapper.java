package io.choerodon.iam.infra.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.infra.dataobject.LanguageDO;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author superlee
 */
public interface LanguageMapper extends BaseMapper<LanguageDO> {

    List<LanguageDO> fulltextSearch(@Param("languageDO") LanguageDO languageDO,
                                    @Param("param") String param);
}
