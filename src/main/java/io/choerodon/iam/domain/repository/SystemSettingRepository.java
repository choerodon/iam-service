package io.choerodon.iam.domain.repository;


import io.choerodon.iam.infra.dto.SystemSettingDTO;

/**
 * @author zmf
 * @since 2018-10-15
 */
public interface SystemSettingRepository {
    SystemSettingDTO addSetting(SystemSettingDTO systemSettingDTO);

    SystemSettingDTO updateSetting(SystemSettingDTO systemSettingDTO);

    void resetSetting();

    SystemSettingDTO getSetting();
}
