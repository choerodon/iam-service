package io.choerodon.iam.app.service.impl;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.IconDTO;
import io.choerodon.iam.app.service.IconService;
import io.choerodon.iam.domain.repository.IconRepository;
import io.choerodon.iam.infra.dataobject.IconDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author superlee
 * @data 2018-04-11
 */
@Component
public class IconServiceImpl implements IconService {

    private IconRepository iconRepository;

    public IconServiceImpl(IconRepository iconRepository) {
        this.iconRepository = iconRepository;
    }

    @Override
    @Transactional(rollbackFor = CommonException.class)
    public IconDTO create(IconDTO iconDTO) {
        return ConvertHelper.convert(
                iconRepository.create(
                        ConvertHelper.convert(iconDTO, IconDO.class)), IconDTO.class);
    }

    @Override
    @Transactional(rollbackFor = CommonException.class)
    public void deleteById(Long id) {
        IconDO iconDO = new IconDO();
        iconDO.setId(id);
        iconRepository.delete(iconDO);
    }

    @Override
    public Page<IconDTO> pagingQuery(PageRequest pageRequest, String code) {
        return ConvertPageHelper.convertPage(iconRepository.pagingQuery(pageRequest, code), IconDTO.class);
    }
}
