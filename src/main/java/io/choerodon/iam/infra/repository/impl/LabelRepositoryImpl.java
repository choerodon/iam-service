package io.choerodon.iam.infra.repository.impl;

import io.choerodon.iam.domain.repository.LabelRepository;
import io.choerodon.iam.infra.dataobject.LabelDO;
import io.choerodon.iam.infra.mapper.LabelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

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
    public List<LabelDO> listByOption(LabelDO label) {
        return labelMapper.listByOption(label);
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

    @Override
    public List<LabelDO> selectByUserId(Long id) {
        return labelMapper.selectByUserId(id);
    }

    @Override
    public Set<String> selectLabelNamesInRoleIds(List<Long> roleIds) {
        return labelMapper.selectLabelNamesInRoleIds(roleIds);
    }
}
