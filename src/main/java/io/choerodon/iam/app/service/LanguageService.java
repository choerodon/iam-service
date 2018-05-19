package io.choerodon.iam.app.service;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.LanguageDTO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

import java.util.List;

/**
 * @author superlee
 */
public interface LanguageService {

    Page<LanguageDTO> pagingQuery(PageRequest pageRequest, LanguageDTO languageDTO);

    LanguageDTO update(LanguageDTO languageDTO);

    LanguageDTO queryByCode(LanguageDTO language);

    List<LanguageDTO> listAll();
}
