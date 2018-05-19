package io.choerodon.iam.infra.repository.impl;

import java.util.List;

import org.springframework.stereotype.Component;

import io.choerodon.iam.domain.repository.LabelRepository;
import io.choerodon.iam.infra.dataobject.LabelDO;
import io.choerodon.iam.infra.mapper.LabelMapper;

/**
 * @author superlee
 */
@Component
public class LabelRepositoryImpl implements LabelRepository {

    private LabelMapper labelMapper;

    public LabelRepositoryImpl(LabelMapper labelMapper) {
        this.labelMapper = labelMapper;
    }

    @Override
    public List<LabelDO> listByType(String type) {
        LabelDO labelDO = new LabelDO();
        labelDO.setType(type);
        return labelMapper.select(labelDO);
    }

    @Override
    public LabelDO selectByPrimaryKey(Long labelId) {
        return labelMapper.selectByPrimaryKey(labelId);
    }

    @Override
    public List<LabelDO> selectByRoleId(Long roleId) {
        return labelMapper.selectByRoleId(roleId);
    }

    @Override
    public LabelDO selectOne(LabelDO labelDO) {
        return labelMapper.selectOne(labelDO);
    }
}
