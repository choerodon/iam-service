package io.choerodon.iam.infra.repository.impl;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.repository.RoleLabelRepository;
import io.choerodon.iam.infra.dataobject.RoleLabelDO;
import io.choerodon.iam.infra.mapper.RoleLabelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author superlee
 */
@Component
public class RoleLabelRepositoryImpl implements RoleLabelRepository {

    private RoleLabelMapper roleLabelMapper;

    public RoleLabelRepositoryImpl(RoleLabelMapper roleLabelMapper) {
        this.roleLabelMapper = roleLabelMapper;
    }

    @Override
    public void insert(RoleLabelDO roleLabelDO) {
        if (roleLabelMapper.insertSelective(roleLabelDO) != 1) {
            throw new CommonException("error.roleLabel.create");
        }
    }

    @Override
    public List<RoleLabelDO> select(RoleLabelDO roleLabelDO) {
        return roleLabelMapper.select(roleLabelDO);
    }

    @Override
    public void delete(RoleLabelDO rl) {
        roleLabelMapper.delete(rl);
    }
}
