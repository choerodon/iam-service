package io.choerodon.iam.api.controller.v1;

import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.PasswordPolicyDTO;
import io.choerodon.iam.api.validator.PasswordPolicyValidator;
import io.choerodon.iam.app.service.PasswordPolicyService;
import io.choerodon.iam.app.service.UserService;
import io.choerodon.swagger.annotation.Permission;

/**
 * @author wuguokai
 */
@RestController
@RequestMapping("/v1/organizations/{organization_id}/password_policies")
public class PasswordPolicyController {

    private PasswordPolicyService passwordPolicyService;
    private PasswordPolicyValidator passwordPolicyValidator;
    @Autowired
    private UserService userService;

    public PasswordPolicyController(PasswordPolicyService passwordPolicyService, PasswordPolicyValidator passwordPolicyValidator) {
        this.passwordPolicyService = passwordPolicyService;
        this.passwordPolicyValidator = passwordPolicyValidator;
    }

    /**
     * 查询目标组织密码策略
     *
     * @return 目标组织密码策略
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
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
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "修改组织的密码策略")
    @PostMapping("/{id}")
    public ResponseEntity<PasswordPolicyDTO> update(@PathVariable("organization_id") Long organizationId,
                                                    @PathVariable("id") Long id,
                                                    @RequestBody @Validated PasswordPolicyDTO passwordPolicyDTO) {
        passwordPolicyValidator.update(organizationId, id, passwordPolicyDTO);
        return new ResponseEntity<>(passwordPolicyService.update(organizationId, id, passwordPolicyDTO), HttpStatus.OK);
    }

    /**
     * 根据用户邮箱查询对应组织下的密码策略
     *
     * @return 目标组织密码策略
     */
    @Permission(permissionPublic = true)
    @ApiOperation(value = "根据用户邮箱查询对应组织下的密码策略")
    @GetMapping("/email")
    public ResponseEntity<PasswordPolicyDTO> queryByUserEmail(@PathVariable("email") String email) {
        Long organizationId = userService.queryOrgIdByEmail(email);
        return new ResponseEntity<>(passwordPolicyService.queryByOrgId(organizationId), HttpStatus.OK);
    }

}
