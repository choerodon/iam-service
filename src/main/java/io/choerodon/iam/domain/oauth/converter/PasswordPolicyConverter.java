package io.choerodon.iam.domain.oauth.converter;

import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.PasswordPolicyDTO;
import io.choerodon.iam.domain.oauth.entity.PasswordPolicyE;
import io.choerodon.iam.infra.dataobject.PasswordPolicyDO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

/**
 * @author wuguokai
 */
@Component
public class PasswordPolicyConverter implements ConvertorI<PasswordPolicyE, PasswordPolicyDO, PasswordPolicyDTO> {
    @Override
    public PasswordPolicyE dtoToEntity(PasswordPolicyDTO dto) {
        return new PasswordPolicyE(dto.getId(), dto.getCode(), dto.getName(), dto.getOrganizationId(),
                dto.getOriginalPassword(), dto.getMinLength(), dto.getMaxLength(), dto.getMaxErrorTime(),
                dto.getDigitsCount(), dto.getLowercaseCount(), dto.getUppercaseCount(),
                dto.getSpecialCharCount(), dto.getNotUsername(), dto.getRegularExpression(),
                dto.getNotRecentCount(), dto.getEnablePassword(), dto.getEnableSecurity(),
                dto.getEnableLock(), dto.getLockedExpireTime(), dto.getEnableCaptcha(),
                dto.getMaxCheckCaptcha(), dto.getObjectVersionNumber());
    }

    @Override
    public PasswordPolicyDTO entityToDto(PasswordPolicyE entity) {
        PasswordPolicyDTO passwordPolicyDTO = new PasswordPolicyDTO();
        BeanUtils.copyProperties(entity, passwordPolicyDTO);
        return passwordPolicyDTO;
    }

    @Override
    public PasswordPolicyE doToEntity(PasswordPolicyDO dataObject) {
        return new PasswordPolicyE(dataObject.getId(), dataObject.getCode(), dataObject.getName(),
                dataObject.getOrganizationId(), dataObject.getOriginalPassword(),
                dataObject.getMinLength(), dataObject.getMaxLength(),
                dataObject.getMaxErrorTime(), dataObject.getDigitsCount(),
                dataObject.getLowercaseCount(), dataObject.getUppercaseCount(),
                dataObject.getSpecialCharCount(), dataObject.getNotUsername(),
                dataObject.getRegularExpression(), dataObject.getNotRecentCount(),
                dataObject.getEnablePassword(), dataObject.getEnableSecurity(),
                dataObject.getEnableLock(), dataObject.getLockedExpireTime(),
                dataObject.getEnableCaptcha(), dataObject.getMaxCheckCaptcha(),
                dataObject.getObjectVersionNumber());
    }

    @Override
    public PasswordPolicyDO entityToDo(PasswordPolicyE entity) {
        PasswordPolicyDO passwordPolicyDO = new PasswordPolicyDO();
        BeanUtils.copyProperties(entity, passwordPolicyDO);
        return passwordPolicyDO;
    }

    @Override
    public PasswordPolicyDTO doToDto(PasswordPolicyDO dataObject) {
        PasswordPolicyDTO passwordPolicyDTO = new PasswordPolicyDTO();
        BeanUtils.copyProperties(dataObject, passwordPolicyDTO);
        return passwordPolicyDTO;
    }

    @Override
    public PasswordPolicyDO dtoToDo(PasswordPolicyDTO dto) {
        PasswordPolicyDO passwordPolicyDO = new PasswordPolicyDO();
        BeanUtils.copyProperties(dto, passwordPolicyDO);
        return passwordPolicyDO;
    }
}
