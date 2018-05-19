package io.choerodon.iam.domain.repository;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.infra.dataobject.LanguageDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

import java.util.List;

/**
 * @author superlee
 */
public interface LanguageRepository {

    Page<LanguageDO> pagingQuery(PageRequest pageRequest, LanguageDO languageDO, String param);

    LanguageDO update(LanguageDO languageDO);

    LanguageDO queryById(Long id);

    LanguageDO queryByCode(LanguageDO languageDO);

    List<LanguageDO> listAll();
}
