package io.choerodon.iam.app.service;


import io.choerodon.iam.infra.dto.BookMarkDTO;

import java.util.List;

/**
 * @author dengyouquan
 **/
public interface BookMarkService {
    BookMarkDTO create(BookMarkDTO bookMarkDTO);

    /**
     * 更新传入书签列表
     *
     * @param bookMarkDTOS
     * @return
     */
    List<BookMarkDTO> updateAll(List<BookMarkDTO> bookMarkDTOS);

    /**
     * 查询用户下所有书签
     *
     * @return
     */
    List<BookMarkDTO> list();

    void delete(Long id);
}
