package io.choerodon.iam.domain.iam.converter;

import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.BookMarkDTO;
import io.choerodon.iam.domain.iam.entity.BookMarkE;
import io.choerodon.iam.infra.dataobject.BookMarkDO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

/**
 * @author dengyouquan
 **/
@Component
public class BookMarkConverter implements ConvertorI<BookMarkE, BookMarkDO, BookMarkDTO> {
    @Override
    public BookMarkE dtoToEntity(BookMarkDTO dto) {
        BookMarkE bookMarkE = new BookMarkE();
        BeanUtils.copyProperties(dto, bookMarkE);
        return bookMarkE;
    }

    @Override
    public BookMarkDTO entityToDto(BookMarkE entity) {
        BookMarkDTO bookMarkDTO = new BookMarkDTO();
        BeanUtils.copyProperties(entity, bookMarkDTO);
        return bookMarkDTO;
    }

    @Override
    public BookMarkE doToEntity(BookMarkDO dataObject) {
        BookMarkE bookMarkE = new BookMarkE();
        BeanUtils.copyProperties(dataObject, bookMarkE);
        return bookMarkE;
    }

    @Override
    public BookMarkDO entityToDo(BookMarkE entity) {
        BookMarkDO bookMarkDO = new BookMarkDO();
        BeanUtils.copyProperties(entity, bookMarkDO);
        return bookMarkDO;
    }

    @Override
    public BookMarkDTO doToDto(BookMarkDO dataObject) {
        BookMarkDTO bookMarkDTO = new BookMarkDTO();
        BeanUtils.copyProperties(dataObject, bookMarkDTO);
        return bookMarkDTO;
    }

    @Override
    public BookMarkDO dtoToDo(BookMarkDTO dto) {
        BookMarkDO bookMarkDO = new BookMarkDO();
        BeanUtils.copyProperties(dto, bookMarkDO);
        return bookMarkDO;
    }
}
