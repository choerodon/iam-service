package io.choerodon.iam.domain.repository;


import com.github.pagehelper.Page;
import io.choerodon.iam.infra.dto.LanguageDTO;

import java.util.List;

/**
 * @author superlee
 */
public interface LanguageRepository {

    Page<LanguageDTO> pagingQuery(int page, int size, LanguageDTO languageDTO, String param);

    LanguageDTO update(LanguageDTO languageDTO);

    LanguageDTO queryById(Long id);

    LanguageDTO queryByCode(LanguageDTO languageDTO);

    List<LanguageDTO> listAll();
}
