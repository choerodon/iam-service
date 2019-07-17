package io.choerodon.iam.app.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.app.service.LanguageService;
import io.choerodon.iam.infra.asserts.AssertHelper;
import io.choerodon.iam.infra.dto.LanguageDTO;
import io.choerodon.iam.infra.mapper.LanguageMapper;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 * @author superlee
 */
@Service
public class LanguageServiceImpl implements LanguageService {

    private LanguageMapper languageMapper;

    private AssertHelper assertHelper;

    public LanguageServiceImpl(LanguageMapper languageMapper,
                               AssertHelper assertHelper) {
        this.languageMapper = languageMapper;
        this.assertHelper = assertHelper;
    }

    @Override
    public PageInfo<LanguageDTO> pagingQuery(PageRequest pageRequest, LanguageDTO languageDTO, String param) {
        return PageHelper
                .startPage(pageRequest.getPage(), pageRequest.getSize())
                .doSelectPageInfo(() -> languageMapper.fulltextSearch(languageDTO, param));
    }

    @Override
    @Transactional(rollbackFor = CommonException.class)
    public LanguageDTO update(LanguageDTO languageDTO) {
        assertHelper.objectVersionNumberNotNull(languageDTO.getObjectVersionNumber());
        if (languageMapper.updateByPrimaryKeySelective(languageDTO) != 1) {
            throw new CommonException("error.language.update");
        }
        return languageMapper.selectByPrimaryKey(languageDTO.getId());
    }

    @Override
    public LanguageDTO queryByCode(String code) {
        LanguageDTO dto = new LanguageDTO();
        dto.setCode(code);
        return languageMapper.selectOne(dto);
    }

    @Override
    public List<LanguageDTO> listAll() {
        return languageMapper.selectAll();
    }

}
