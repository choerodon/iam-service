package io.choerodon.iam.app.service.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.app.service.LanguageService;
import io.choerodon.iam.domain.repository.LanguageRepository;
import io.choerodon.iam.infra.dto.LanguageDTO;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 * @author superlee
 */
@Component
public class LanguageServiceImpl implements LanguageService {

    private LanguageRepository repository;

    public LanguageServiceImpl(LanguageRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageInfo<LanguageDTO> pagingQuery(int page, int size, LanguageDTO languageDTO, String param) {
        return repository.pagingQuery(page,size,languageDTO,param);
//        Page<LanguageDO> languageDOPage =
//                repository.pagingQuery(pageRequest,
//                        ConvertHelper.convert(languageDTO, LanguageDO.class), languageDTO.getParam());
//        return ConvertPageHelper.convertPage(languageDOPage, LanguageDTO.class);
    }

    @Override
    @Transactional(rollbackFor = CommonException.class)
    public LanguageDTO update(LanguageDTO languageDTO) {
        if (repository.queryById(languageDTO.getId()) == null) {
            throw new CommonException("error.language.not.exist");
        }
        return repository.update(languageDTO);
    }

    @Override
    public LanguageDTO queryByCode(LanguageDTO language) {
        return repository.queryByCode(language);
    }

    @Override
    public List<LanguageDTO> listAll() {
        return repository.listAll();
    }

}
