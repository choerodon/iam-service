package io.choerodon.iam.infra.asserts;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.dto.BookMarkDTO;
import io.choerodon.iam.infra.mapper.BookMarkMapper;
import org.springframework.stereotype.Component;

/**
 * @author superlee
 * @since 2019-05-13
 */
@Component
public class BookMarkAssertHelper extends AssertHelper {

    private BookMarkMapper bookMarkMapper;

    public BookMarkAssertHelper(BookMarkMapper bookMarkMapper) {
        this.bookMarkMapper = bookMarkMapper;
    }

    public BookMarkDTO bookMarkNotExisted(Long id) {
        return bookMarkNotExisted(id, "error.bookMark.notExist");
    }

    public BookMarkDTO bookMarkNotExisted(Long id, String message) {
        BookMarkDTO dto = bookMarkMapper.selectByPrimaryKey(id);
        if (dto == null) {
            throw new CommonException(message);
        }
        return dto;
    }
}
