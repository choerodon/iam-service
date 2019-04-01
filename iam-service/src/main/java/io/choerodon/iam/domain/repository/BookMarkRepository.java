package io.choerodon.iam.domain.repository;

import io.choerodon.iam.infra.dataobject.BookMarkDO;

import java.util.List;

/**
 * @author dengyouquan
 **/
public interface BookMarkRepository {
    BookMarkDO create(BookMarkDO bookMarkDO);

    BookMarkDO update(BookMarkDO bookMarkDO);

    List<BookMarkDO> queryByUserId(Long userId);

    void delete(Long id);
}
