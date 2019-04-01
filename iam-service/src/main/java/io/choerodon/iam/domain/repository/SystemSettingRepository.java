package io.choerodon.iam.domain.repository;

import io.choerodon.iam.api.dto.SystemSettingDTO;
import io.choerodon.iam.infra.dataobject.SystemSettingDO;

/**
 * @author zmf
 * @since 2018-10-15
 */
public interface SystemSettingRepository {
    SystemSettingDTO addSetting(SystemSettingDO systemSettingDO);

    SystemSettingDTO updateSetting(SystemSettingDO systemSettingDO);

    void resetSetting();

    SystemSettingDTO getSetting();
}
