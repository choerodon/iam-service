package io.choerodon.iam.infra.repository.impl;

import io.choerodon.core.exception.CommonException;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.domain.repository.BookMarkRepository;
import io.choerodon.iam.infra.dataobject.BookMarkDO;
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
    public BookMarkDO create(BookMarkDO bookMarkDO) {
        bookMarkMapper.insert(bookMarkDO);
        return bookMarkDO;
    }

    @Override
    public BookMarkDO update(BookMarkDO bookMarkDO) {
        validatorCurrentUser(bookMarkDO.getId());
        bookMarkDO.setUserId(DetailsHelper.getUserDetails().getUserId());
        if (bookMarkMapper.updateByPrimaryKey(bookMarkDO) != 1) {
            throw new CommonException("error.bookMark.update");
        }
        return bookMarkDO;
    }

    @Override
    public List<BookMarkDO> queryAll() {
        return bookMarkMapper.selectAll();
    }

    @Override
    public void delete(Long id) {
        validatorCurrentUser(id);
        bookMarkMapper.deleteByPrimaryKey(id);
    }

    private void validatorCurrentUser(Long id) {
        if (id == null) return;
        BookMarkDO bookMarkDO = bookMarkMapper.selectByPrimaryKey(id);
        if (bookMarkDO == null) {
            throw new CommonException("error.bookMark.notExist");
        }
        if (!DetailsHelper.getUserDetails().getUserId().equals(bookMarkDO.getUserId())) {
            throw new CommonException("error.bookMark.notCurrentUser");
        }
    }
}

