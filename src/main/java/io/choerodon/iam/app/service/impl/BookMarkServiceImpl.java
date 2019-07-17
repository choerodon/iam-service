package io.choerodon.iam.app.service.impl;

import io.choerodon.core.exception.CommonException;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.iam.app.service.BookMarkService;
import io.choerodon.iam.infra.asserts.BookMarkAssertHelper;
import io.choerodon.iam.infra.asserts.DetailsHelperAssert;
import io.choerodon.iam.infra.dto.BookMarkDTO;
import io.choerodon.iam.infra.mapper.BookMarkMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.Collections;
import java.util.List;

/**
 * @author dengyouquan
 **/
@Service
public class BookMarkServiceImpl implements BookMarkService {

    private BookMarkMapper bookMarkMapper;

    private BookMarkAssertHelper bookMarkAssertHelper;

    public BookMarkServiceImpl(BookMarkMapper bookMarkMapper,
                               BookMarkAssertHelper bookMarkAssertHelper) {
        this.bookMarkMapper = bookMarkMapper;
        this.bookMarkAssertHelper = bookMarkAssertHelper;
    }

    @Override
    public BookMarkDTO create(BookMarkDTO bookMarkDTO) {
        CustomUserDetails userDetails = DetailsHelperAssert.userDetailNotExisted();
        bookMarkDTO.setUserId(userDetails.getUserId());
        bookMarkMapper.insert(bookMarkDTO);
        return bookMarkDTO;
    }

    /**
     * 更新失败一个就回滚
     *
     * @param bookMarks
     * @return
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<BookMarkDTO> updateAll(List<BookMarkDTO> bookMarks) {
        if (CollectionUtils.isEmpty(bookMarks)) {
            return Collections.emptyList();
        }
        bookMarks.forEach(bookMarkDTO -> {
            Long id = bookMarkDTO.getId();
            if (id == null) {
                return;
            }
            BookMarkDTO dto = bookMarkAssertHelper.bookMarkNotExisted(id);
            Long userId = dto.getUserId();
            DetailsHelperAssert.notCurrentUser(userId);
            bookMarkDTO.setUserId(userId);
            if (bookMarkMapper.updateByPrimaryKey(bookMarkDTO) != 1) {
                throw new CommonException("error.bookMark.update");
            }
        });
        return bookMarks;
    }

    @Override
    public List<BookMarkDTO> list() {
        CustomUserDetails userDetails = DetailsHelperAssert.userDetailNotExisted();
        Long userId = userDetails.getUserId();
        BookMarkDTO dto = new BookMarkDTO();
        dto.setUserId(userId);
        return bookMarkMapper.select(dto);
    }

    @Override
    public void delete(Long id) {
        BookMarkDTO dto = bookMarkAssertHelper.bookMarkNotExisted(id);
        Long userId = dto.getUserId();
        DetailsHelperAssert.notCurrentUser(userId);
        bookMarkMapper.deleteByPrimaryKey(id);
    }
}
