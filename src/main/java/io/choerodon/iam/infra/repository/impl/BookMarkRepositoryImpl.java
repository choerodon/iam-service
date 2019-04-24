package io.choerodon.iam.infra.repository.impl;

import io.choerodon.core.exception.CommonException;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.domain.repository.BookMarkRepository;
import io.choerodon.iam.infra.dto.BookMarkDTO;
import io.choerodon.iam.infra.mapper.BookMarkMapper;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author dengyouquan
 **/
@Component
public class BookMarkRepositoryImpl implements BookMarkRepository {
    private BookMarkMapper bookMarkMapper;

    public BookMarkRepositoryImpl(BookMarkMapper bookMarkMapper) {
        this.bookMarkMapper = bookMarkMapper;
    }

    @Override
    public BookMarkDTO create(BookMarkDTO bookMarkDTO) {
        bookMarkMapper.insert(bookMarkDTO);
        return bookMarkDTO;
    }

    @Override
    public BookMarkDTO update(BookMarkDTO bookMarkDTO) {
        validatorCurrentUser(bookMarkDTO.getId());
        bookMarkDTO.setUserId(DetailsHelper.getUserDetails().getUserId());
        if (bookMarkMapper.updateByPrimaryKey(bookMarkDTO) != 1) {
            throw new CommonException("error.bookMark.update");
        }
        return bookMarkDTO;
    }

    @Override
    public List<BookMarkDTO> queryByUserId(Long userId) {
        BookMarkDTO bookMarkDTO = new BookMarkDTO();
        bookMarkDTO.setUserId(userId);
        return bookMarkMapper.select(bookMarkDTO);
    }

    @Override
    public void delete(Long id) {
        validatorCurrentUser(id);
        bookMarkMapper.deleteByPrimaryKey(id);
    }

    private void validatorCurrentUser(Long id) {
        if (id == null) {
            return;
        }
        BookMarkDTO bookMarkDTO = bookMarkMapper.selectByPrimaryKey(id);
        if (bookMarkDTO == null) {
            throw new CommonException("error.bookMark.notExist");
        }
        if (!DetailsHelper.getUserDetails().getUserId().equals(bookMarkDTO.getUserId())) {
            throw new CommonException("error.bookMark.notCurrentUser");
        }
    }
}

