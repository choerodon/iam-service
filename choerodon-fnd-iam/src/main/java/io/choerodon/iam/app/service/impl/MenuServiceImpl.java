package io.choerodon.iam.app.service.impl;

import io.choerodon.iam.app.service.MenuService;
import io.choerodon.iam.infra.dto.MenuDTO;
import io.choerodon.mybatis.service.BaseServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class MenuServiceImpl extends BaseServiceImpl<MenuDTO> implements MenuService {

    @Override
    public MenuDTO query(Long id) {
        return mapper.selectByPrimaryKey(id);
    }

    @Override
    public MenuDTO create(MenuDTO menuDTO) {
        return null;
    }
}
