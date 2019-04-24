package io.choerodon.iam.api.controller.v1;

import io.choerodon.base.annotation.Permission;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.iam.infra.dto.PasswordPolicyDTO;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import io.choerodon.iam.api.validator.PasswordPolicyValidator;
import io.choerodon.iam.app.service.PasswordPolicyService;

/**
 * @author wuguokai
 */
@RestController
@RequestMapping("/v1/organizations/{organization_id}/password_policies")
public class PasswordPolicyController {

    private PasswordPolicyService passwordPolicyService;
    private PasswordPolicyValidator passwordPolicyValidator;

    public PasswordPolicyController(PasswordPolicyService passwordPolicyService, PasswordPolicyValidator passwordPolicyValidator) {
        this.passwordPolicyService = passwordPolicyService;
        this.passwordPolicyValidator = passwordPolicyValidator;
    }

    /**
     * 查询目标组织密码策略
     *
     * @return 目标组织密码策略
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "查询组织的密码策略")
    @GetMapping
    public ResponseEntity<PasswordPolicyDTO> queryByOrganizationId(@PathVariable("organization_id") Long organizationId) {
        return new ResponseEntity<>(passwordPolicyService.queryByOrgId(organizationId), HttpStatus.OK);
    }

    /**
     * 查询密码策略
     *
     * @return 密码策略
     */

    /**
     * 更新当前选择的组织密码策略
     *
     * @param passwordPolicyDTO 要更新的密码策略
     * @return 更新后的密码策略
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "修改组织的密码策略")
    @PostMapping("/{id}")
    public ResponseEntity<PasswordPolicyDTO> update(@PathVariable("organization_id") Long organizationId,
                                                    @PathVariable("id") Long id,
                                                    @RequestBody @Validated PasswordPolicyDTO passwordPolicyDTO) {
        passwordPolicyValidator.update(organizationId, id, passwordPolicyDTO);
        return new ResponseEntity<>(passwordPolicyService.update(organizationId, id, passwordPolicyDTO), HttpStatus.OK);
    }

}
