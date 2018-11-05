package io.choerodon.iam.app.service.impl;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.api.dto.BookMarkDTO;
import io.choerodon.iam.app.service.BookMarkService;
import io.choerodon.iam.domain.repository.BookMarkRepository;
import io.choerodon.iam.infra.dataobject.BookMarkDO;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * @author dengyouquan
 **/
@Component
public class BookMarkServiceImpl implements BookMarkService {
    private BookMarkRepository bookMarkRepository;

    public BookMarkServiceImpl(BookMarkRepository bookMarkRepository) {
        this.bookMarkRepository = bookMarkRepository;
    }

    @Override
    public BookMarkDTO create(BookMarkDTO bookMarkDTO) {
        return ConvertHelper.convert(bookMarkRepository.create(ConvertHelper.convert(bookMarkDTO, BookMarkDO.class)), BookMarkDTO.class);
    }

    /**
     * 更新失败一个就回滚
     * @param bookMarkDTOS
     * @return
     */
    @Override
    @Transactional
    public List<BookMarkDTO> updateAll(List<BookMarkDTO> bookMarkDTOS) {
        if (CollectionUtils.isEmpty(bookMarkDTOS)) return Collections.EMPTY_LIST;
        bookMarkDTOS.stream().forEach(bookMarkDTO ->
                bookMarkRepository.update(ConvertHelper.convert(bookMarkDTO, BookMarkDO.class)));
        return bookMarkDTOS;
    }

    @Override
    public List<BookMarkDTO> queryAll() {
        return ConvertHelper.convertList(bookMarkRepository.queryAll(), BookMarkDTO.class);
    }

    @Override
    public void delete(Long id) {
        bookMarkRepository.delete(id);
    }
}
