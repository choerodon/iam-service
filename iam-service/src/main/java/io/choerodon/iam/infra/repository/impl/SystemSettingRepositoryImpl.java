package io.choerodon.iam.infra.repository.impl;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.repository.SystemSettingRepository;
import io.choerodon.iam.infra.dto.SystemSettingDTO;
import io.choerodon.iam.infra.mapper.SystemSettingMapper;
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
    public SystemSettingDTO addSetting(SystemSettingDTO systemSettingDTO) {
        List<SystemSettingDTO> records = queryAll();
        if (!records.isEmpty()) {
            throw new CommonException("error.setting.already.one");
        }
        if (systemSettingMapper.insertSelective(systemSettingDTO) != 1) {
            throw new CommonException("error.setting.insert.failed");
        }
        return systemSettingMapper.selectByPrimaryKey(systemSettingDTO.getId());
    }

    @Override
    public SystemSettingDTO updateSetting(SystemSettingDTO systemSettingDTO) {
        List<SystemSettingDTO> records = queryAll();
        if (records.isEmpty()) {
            throw new CommonException("error.setting.update.invalid");
        }
        systemSettingDTO.setId(records.get(0).getId());
        systemSettingMapper.updateByPrimaryKeySelective(systemSettingDTO);
        return systemSettingMapper.selectByPrimaryKey(systemSettingDTO.getId());
    }

    @Override
    public void resetSetting() {
        List<SystemSettingDTO> records = systemSettingMapper.selectAll();
        for (SystemSettingDTO domain : records) {
            systemSettingMapper.deleteByPrimaryKey(domain.getId());
        }
    }

    @Override
    public SystemSettingDTO getSetting() {
        List<SystemSettingDTO> records = queryAll();
        return records.isEmpty() ? null : records.get(0);
    }

    private List<SystemSettingDTO> queryAll() {
        return systemSettingMapper.selectAll();
    }
}
