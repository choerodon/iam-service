package io.choerodon.iam.api.validator;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.dto.PasswordPolicyDTO;
import io.choerodon.iam.infra.dto.SystemSettingDTO;
import io.choerodon.iam.infra.mapper.PasswordPolicyMapper;
import io.choerodon.iam.infra.mapper.SystemSettingMapper;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 当用户组织的密码策略未开启时，如果修改过系统设置，根据系统设置中的密码长度要求，校验用户密码
 *
 * @author zmf
 */
@Component
public class UserPasswordValidator {

    private final PasswordPolicyMapper passwordPolicyMapper;

    private final SystemSettingMapper systemSettingMapper;

    public UserPasswordValidator(PasswordPolicyMapper passwordPolicyMapper,
                                 SystemSettingMapper systemSettingMapper) {
        this.passwordPolicyMapper = passwordPolicyMapper;
        this.systemSettingMapper = systemSettingMapper;
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
        PasswordPolicyDTO dto = new PasswordPolicyDTO();
        dto.setOrganizationId(organizationId);
        PasswordPolicyDTO passwordPolicyDTO = passwordPolicyMapper.selectOne(dto);
        // 组织启用密码策略时，跳过验证
        if (passwordPolicyDTO != null && Boolean.TRUE.equals(passwordPolicyDTO.getEnablePassword())) {
            return true;
        }
        List<SystemSettingDTO> records = systemSettingMapper.selectAll();
        SystemSettingDTO setting = records.isEmpty() ? null : records.get(0);
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
