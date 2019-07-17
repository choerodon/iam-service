package io.choerodon.iam.app.service;


import com.github.pagehelper.PageInfo;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.iam.infra.dto.LanguageDTO;

import java.util.List;

/**
 * @author superlee
 */
public interface LanguageService {

    PageInfo<LanguageDTO> pagingQuery(PageRequest pageRequest, LanguageDTO languageDTO, String param);

    LanguageDTO update(LanguageDTO languageDTO);

    LanguageDTO queryByCode(String code);

    List<LanguageDTO> listAll();
}
