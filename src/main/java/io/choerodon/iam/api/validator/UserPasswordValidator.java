package io.choerodon.iam.api.validator;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.PasswordPolicyDTO;
import io.choerodon.iam.api.dto.SystemSettingDTO;
import io.choerodon.iam.domain.repository.PasswordPolicyRepository;
import io.choerodon.iam.domain.repository.SystemSettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 当用户组织的密码策略未开启时，如果修改过系统设置，根据系统设置中的密码长度要求，校验用户密码
 *
 * @author zmf
 */
@Component
public class UserPasswordValidator {
    private final PasswordPolicyRepository passwordPolicyRepository;
    private final SystemSettingRepository systemSettingRepository;

    @Autowired
    public UserPasswordValidator(PasswordPolicyRepository passwordPolicyRepository, SystemSettingRepository systemSettingRepository) {
        this.passwordPolicyRepository = passwordPolicyRepository;
        this.systemSettingRepository = systemSettingRepository;
    }

    /**
     * 验证密码是否符合系统设置所配置的密码长度范围
     *
     * @param password           用户的密码
     * @param organizationId     用户所属组织 id
     * @param isToThrowException 当校验失败时是否抛出异常
     * @return 当符合校验时，返回true
     */
    public boolean validate(String password, Long organizationId, boolean isToThrowException) {
        PasswordPolicyDTO passwordPolicyDTO = passwordPolicyRepository.queryByOrgId(organizationId);
        // 组织启用密码策略时，跳过验证
        if (passwordPolicyDTO != null && Boolean.TRUE.equals(passwordPolicyDTO.getEnablePassword())) {
            return true;
        }

        SystemSettingDTO setting = systemSettingRepository.getSetting();
        // 系统设置为空时，跳过
        if (setting == null || setting.getMinPasswordLength() == null || setting.getMaxPasswordLength() == null) {
            return true;
        }

        password = password.replaceAll(" ", "");
        if (password.length() < setting.getMinPasswordLength() || password.length() > setting.getMaxPasswordLength()) {
            if (isToThrowException) {
                throw new CommonException("error.password.length.out.of.setting", setting.getMinPasswordLength(), setting.getMaxPasswordLength());
            }
            return false;
        }
        return true;
    }
}
