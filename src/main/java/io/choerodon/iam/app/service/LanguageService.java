package io.choerodon.iam.app.service;


import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import io.choerodon.iam.infra.dto.LanguageDTO;

import java.util.List;

/**
 * @author superlee
 */
public interface LanguageService {

    PageInfo<LanguageDTO> pagingQuery(int page, int size, LanguageDTO languageDTO, String param);

    LanguageDTO update(LanguageDTO languageDTO);

    LanguageDTO queryByCode(LanguageDTO language);

    List<LanguageDTO> listAll();
}
