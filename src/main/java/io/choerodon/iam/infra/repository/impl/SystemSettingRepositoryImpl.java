package io.choerodon.iam.infra.repository.impl;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.SystemSettingDTO;
import io.choerodon.iam.domain.repository.SystemSettingRepository;
import io.choerodon.iam.infra.dataobject.SystemSettingDO;
import io.choerodon.iam.infra.mapper.SystemSettingMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author zmf
 * @since 2018-10-15
 */
@Component
public class SystemSettingRepositoryImpl implements SystemSettingRepository {
    private final SystemSettingMapper systemSettingMapper;

    @Autowired
    public SystemSettingRepositoryImpl(SystemSettingMapper systemSettingMapper) {
        this.systemSettingMapper = systemSettingMapper;
    }


    @Override
    public SystemSettingDTO addSetting(SystemSettingDO systemSettingDO) {
        if (systemSettingMapper.insertSelective(systemSettingDO) != 1) {
            throw new CommonException("error.setting.insert.failed");
        }
        return convert(systemSettingMapper.selectByPrimaryKey(systemSettingDO.getId()));
    }

    @Override
    public SystemSettingDTO updateSetting(SystemSettingDO systemSettingDO) {
        List<SystemSettingDO> records = queryAll();
        if (records.isEmpty()) {
            throw new CommonException("error.setting.update.invalid");
        }
        systemSettingDO.setId(records.get(0).getId());
        systemSettingMapper.updateByPrimaryKeySelective(systemSettingDO);
        return convert(systemSettingMapper.selectByPrimaryKey(systemSettingDO.getId()));
    }

    @Override
    public void resetSetting() {
        List<SystemSettingDO> records = systemSettingMapper.selectAll();
        for (SystemSettingDO domain : records) {
            systemSettingMapper.deleteByPrimaryKey(domain.getId());
        }
    }

    @Override
    public SystemSettingDTO getSetting() {
        List<SystemSettingDO> records = queryAll();
        return records.size() == 0 ? null : convert(records.get(0));
    }

    private List<SystemSettingDO> queryAll() {
        return systemSettingMapper.selectAll();
    }

    private SystemSettingDTO convert(SystemSettingDO record) {
        SystemSettingDTO dto = new SystemSettingDTO();
        BeanUtils.copyProperties(record, dto);
        return dto;
    }
}
