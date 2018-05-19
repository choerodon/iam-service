package io.choerodon.iam.infra.repository.impl;

import java.util.List;

import org.springframework.stereotype.Component;

import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.repository.IconRepository;
import io.choerodon.iam.infra.dataobject.IconDO;
import io.choerodon.iam.infra.mapper.IconMapper;
import io.choerodon.mybatis.pagehelper.PageHelper;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author superlee
 * @data 2018-04-11
 */
@Component
public class IconRepositoryImpl implements IconRepository {


    private IconMapper iconMapper;

    public IconRepositoryImpl(IconMapper iconMapper) {
        this.iconMapper = iconMapper;
    }

    @Override
    public Page<IconDO> pagingQuery(PageRequest pageRequest, String code) {
        return PageHelper.doPageAndSort(pageRequest, () -> iconMapper.fulltextSearch(code));
    }

    @Override
    public IconDO create(IconDO iconDO) {
        List<IconDO> iconDOList = iconMapper.select(iconDO);
        if (!iconDOList.isEmpty()) {
            throw new CommonException("error.repo.create.icon.exist");
        }
        if (iconMapper.insertSelective(iconDO) != 1) {
            throw new CommonException("error.repo.create.icon.failed");
        }
        return iconMapper.selectByPrimaryKey(iconDO.getId());
    }

    @Override
    public void delete(IconDO iconDO) {
        if (iconMapper.delete(iconDO) != 1) {
            throw new CommonException("error.repo.delete.icon.failed");
        }
    }
}
