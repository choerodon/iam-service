package io.choerodon.iam.infra.repository.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.repository.LanguageRepository;
import io.choerodon.iam.infra.dto.LanguageDTO;
import io.choerodon.iam.infra.mapper.LanguageMapper;
import org.springframework.stereotype.Component;

import java.util.List;


/**
 * @author superlee
 */
@Component
public class LanguageRepositoryImpl implements LanguageRepository {

    private LanguageMapper mapper;

    public LanguageRepositoryImpl(LanguageMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public Page<LanguageDTO> pagingQuery(int page, int size, LanguageDTO languageDTO, String param) {
        return PageHelper.startPage(page,size).doSelectPage(()->mapper.fulltextSearch(languageDTO, param));
    }

    @Override
    public LanguageDTO update(LanguageDTO languageDTO) {
        if (mapper.updateByPrimaryKeySelective(languageDTO) != 1) {
            throw new CommonException("error.language.update");
        }
        return mapper.selectByPrimaryKey(languageDTO.getId());
    }

    @Override
    public LanguageDTO queryById(Long id) {
        return mapper.selectByPrimaryKey(id);
    }

    @Override
    public LanguageDTO queryByCode(LanguageDTO languageDTO) {
        return mapper.selectOne(languageDTO);
    }

    @Override
    public List<LanguageDTO> listAll() {
        return mapper.selectAll();
    }
}
