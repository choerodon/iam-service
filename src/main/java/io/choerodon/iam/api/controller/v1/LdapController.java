package io.choerodon.iam.api.controller.v1;

import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.LdapAccountDTO;
import io.choerodon.iam.api.dto.LdapConnectionDTO;
import io.choerodon.iam.api.dto.LdapDTO;
import io.choerodon.iam.api.dto.LdapHistoryDTO;
import io.choerodon.iam.app.service.LdapService;
import io.choerodon.swagger.annotation.Permission;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


/**
 * @author wuguokai
 */
@RestController
@RequestMapping("/v1/organizations/{organization_id}/ldaps")
public class LdapController {

    private LdapService ldapService;

    public LdapController(LdapService ldapService) {
        this.ldapService = ldapService;
    }

    /**
     * 添加Ldap
     *
     * @param organizationId
     * @param ldapDTO
     * @return ldapDTO
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "添加Ldap")
    @PostMapping
    public ResponseEntity<LdapDTO> create(@PathVariable("organization_id") Long organizationId,
                                          @RequestBody LdapDTO ldapDTO) {
        return new ResponseEntity<>(ldapService.create(organizationId, ldapDTO), HttpStatus.OK);
    }

    /**
     * 更新Ldap
     *
     * @param organizationId
     * @param id
     * @param ldapDTO
     * @return ldapDTO
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "更新Ldap")
    @PostMapping(value = "/{id}")
    public ResponseEntity<LdapDTO> update(@PathVariable("organization_id") Long organizationId,
                                          @PathVariable("id") Long id, @RequestBody LdapDTO ldapDTO) {
        return new ResponseEntity<>(ldapService.update(organizationId, id, ldapDTO), HttpStatus.OK);
    }

    /**
     * 根据组织id查询Ldap
     *
     * @param organizationId
     * @return ldapDTO
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "根据组织id查询Ldap")
    @GetMapping
    public ResponseEntity<LdapDTO> queryByOrgId(@PathVariable("organization_id") Long organizationId) {
        return new ResponseEntity<>(ldapService.queryByOrganizationId(organizationId), HttpStatus.OK);
    }

    /**
     * 根据组织id删除Ldap
     *
     * @param organizationId
     * @return ldapDTO
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "根据组织id删除Ldap")
    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable("organization_id") Long organizationId,
                                         @PathVariable("id") Long id) {
        return new ResponseEntity<>(ldapService.delete(organizationId, id), HttpStatus.OK);
    }

    /**
     * 测试ldap连接
     *
     * @return 是否连接成功
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "测试ldap连接")
    @PostMapping("/{id}/test_connect")
    public ResponseEntity<LdapConnectionDTO> testConnect(@PathVariable("organization_id") Long organizationId,
                                                         @PathVariable("id") Long id,
                                                         @RequestBody LdapAccountDTO ldapAccount) {
        return new ResponseEntity<>(ldapService.testConnect(organizationId, id, ldapAccount), HttpStatus.OK);
    }

    /**
     * 同步ldap用户
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "同步ldap用户")
    @PostMapping("/{id}/sync_users")
    public ResponseEntity syncUsers(@PathVariable("organization_id") Long organizationId,
                                    @PathVariable Long id) {
        ldapService.syncLdapUser(organizationId, id);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "根据ldap id查询最新一条历史记录")
    @GetMapping("/{id}/latest_history")
    public ResponseEntity<LdapHistoryDTO> latestHistory(@PathVariable("organization_id") Long organizationId,
                                                        @PathVariable Long id){
        return new ResponseEntity<>(ldapService.queryLatestHistory(id), HttpStatus.OK);
    }
}
