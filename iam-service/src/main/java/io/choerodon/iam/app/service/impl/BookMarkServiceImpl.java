package io.choerodon.iam.app.service.impl;

import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.app.service.BookMarkService;
import io.choerodon.iam.domain.repository.BookMarkRepository;
import io.choerodon.iam.infra.dto.BookMarkDTO;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.Collections;
import java.util.List;

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
        return bookMarkRepository.create(bookMarkDTO);
    }

    /**
     * 更新失败一个就回滚
     *
     * @param bookMarks
     * @return
     */
    @Override
    @Transactional
    public List<BookMarkDTO> updateAll(List<BookMarkDTO> bookMarks) {
        if (CollectionUtils.isEmpty(bookMarks)) {
            return Collections.emptyList();
        }
        bookMarks.stream().forEach(bookMarkDTO -> bookMarkRepository.update(bookMarkDTO));
        return bookMarks;
    }

    @Override
    public List<BookMarkDTO> list() {
        Long userId = DetailsHelper.getUserDetails().getUserId();
        return bookMarkRepository.queryByUserId(userId);
    }

    @Override
    public void delete(Long id) {
        bookMarkRepository.delete(id);
    }
}
