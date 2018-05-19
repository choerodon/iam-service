package io.choerodon.iam.app.service.impl;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.LanguageDTO;
import io.choerodon.iam.app.service.LanguageService;
import io.choerodon.iam.domain.repository.LanguageRepository;
import io.choerodon.iam.infra.dataobject.LanguageDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

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
    public Page<LanguageDTO> pagingQuery(PageRequest pageRequest, LanguageDTO languageDTO) {
        Page<LanguageDO> languageDOPage =
                repository.pagingQuery(pageRequest,
                        ConvertHelper.convert(languageDTO, LanguageDO.class), languageDTO.getParam());
        return ConvertPageHelper.convertPage(languageDOPage, LanguageDTO.class);
    }

    @Override
    @Transactional(rollbackFor = CommonException.class)
    public LanguageDTO update(LanguageDTO languageDTO) {
        if (repository.queryById(languageDTO.getId()) == null) {
            throw new CommonException("error.language.not.exist");
        }
        return ConvertHelper.convert(
                repository.update(
                        ConvertHelper.convert(
                                languageDTO, LanguageDO.class)), LanguageDTO.class);
    }

    @Override
    public LanguageDTO queryByCode(LanguageDTO language) {
        return ConvertHelper.convert(
                repository.queryByCode(
                        ConvertHelper.convert(language, LanguageDO.class)), LanguageDTO.class);
    }

    @Override
    public List<LanguageDTO> listAll() {
        return ConvertHelper.convertList(repository.listAll(), LanguageDTO.class);
    }

}
