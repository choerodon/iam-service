package io.choerodon.iam.domain.repository;


import io.choerodon.iam.infra.dto.BookMarkDTO;

import java.util.List;

/**
 * @author dengyouquan
 **/
public interface BookMarkRepository {
    BookMarkDTO create(BookMarkDTO bookMarkDTO);

    BookMarkDTO update(BookMarkDTO bookMarkDTO);

    List<BookMarkDTO> queryByUserId(Long userId);

    void delete(Long id);
}
