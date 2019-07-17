package io.choerodon.iam.api.controller.v1;

import com.github.pagehelper.PageInfo;
import io.choerodon.base.annotation.Permission;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.base.domain.Sort;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.iam.api.dto.LdapAccountDTO;
import io.choerodon.iam.api.dto.LdapConnectionDTO;
import io.choerodon.iam.app.service.LdapService;
import io.choerodon.iam.infra.dto.LdapDTO;
import io.choerodon.iam.infra.dto.LdapErrorUserDTO;
import io.choerodon.iam.infra.dto.LdapHistoryDTO;
import io.choerodon.mybatis.annotation.SortDefault;
import io.choerodon.swagger.annotation.CustomPageRequest;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author wuguokai
 */
@RestController
@RequestMapping("/v1/organizations/{organization_id}")
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
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "创建Ldap")
    @PostMapping(value = "/ldaps")
    public ResponseEntity<LdapDTO> create(@PathVariable("organization_id") Long organizationId,
                                          @RequestBody @Validated LdapDTO ldapDTO) {
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
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "修改Ldap")
    @PostMapping(value = "/ldaps/{id}")
    public ResponseEntity<LdapDTO> update(@PathVariable("organization_id") Long organizationId,
                                          @PathVariable("id") Long id, @RequestBody @Validated LdapDTO ldapDTO) {
        return new ResponseEntity<>(ldapService.update(organizationId, id, ldapDTO), HttpStatus.OK);
    }

    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "启用ldap")
    @PutMapping(value = "/ldaps/{id}/enable")
    public ResponseEntity<LdapDTO> enableLdap(@PathVariable(name = "organization_id") Long organizationId,
                                              @PathVariable Long id) {
        return new ResponseEntity<>(ldapService.enableLdap(organizationId, id), HttpStatus.OK);
    }

    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "禁用ldap")
    @PutMapping(value = "/ldaps/{id}/disable")
    public ResponseEntity<LdapDTO> disableLdap(@PathVariable(name = "organization_id") Long organizationId,
                                               @PathVariable Long id) {
        return new ResponseEntity<>(ldapService.disableLdap(organizationId, id), HttpStatus.OK);
    }

    /**
     * 根据组织id查询Ldap
     *
     * @param organizationId
     * @return ldapDTO
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "查询组织下的Ldap")
    @GetMapping(value = "/ldaps")
    public ResponseEntity<LdapDTO> queryByOrgId(@PathVariable("organization_id") Long organizationId) {
        return new ResponseEntity<>(ldapService.queryByOrganizationId(organizationId), HttpStatus.OK);
    }

    /**
     * 根据组织id删除Ldap
     *
     * @param organizationId
     * @return ldapDTO
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "删除组织下的Ldap")
    @DeleteMapping("/ldaps/{id}")
    public ResponseEntity delete(@PathVariable("organization_id") Long organizationId,
                       @PathVariable("id") Long id) {
        ldapService.delete(organizationId, id);
        return new ResponseEntity(HttpStatus.OK);
    }

    /**
     * 测试ldap连接
     *
     * @return 是否连接成功
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "测试ldap连接")
    @PostMapping("/ldaps/{id}/test_connect")
    public ResponseEntity<LdapConnectionDTO> testConnect(@PathVariable("organization_id") Long organizationId,
                                                         @PathVariable("id") Long id,
                                                         @RequestBody LdapAccountDTO ldapAccount) {
        return new ResponseEntity<>(ldapService.testConnect(organizationId, id, ldapAccount), HttpStatus.OK);
    }

    /**
     * 同步ldap用户
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "同步ldap用户")
    @PostMapping("/ldaps/{id}/sync_users")
    public ResponseEntity syncUsers(@PathVariable("organization_id") Long organizationId,
                                    @PathVariable Long id) {
        ldapService.syncLdapUser(organizationId, id);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "根据ldap id查询最新一条历史记录")
    @GetMapping("/ldaps/{id}/latest_history")
    public ResponseEntity<LdapHistoryDTO> latestHistory(@PathVariable("organization_id") Long organizationId,
                                                        @PathVariable Long id) {
        return new ResponseEntity<>(ldapService.queryLatestHistory(id), HttpStatus.OK);
    }

    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "根据ldap id查询历史记录")
    @GetMapping("/ldaps/{id}/history")
    @CustomPageRequest
    public ResponseEntity<PageInfo<LdapHistoryDTO>> pagingQueryHistories(@ApiIgnore
                                                                         @SortDefault(value = "id", direction = Sort.Direction.DESC) PageRequest pageRequest,
                                                                         @PathVariable("organization_id") Long organizationId,
                                                                         @PathVariable Long id) {
        return new ResponseEntity<>(ldapService.pagingQueryHistories(pageRequest, id), HttpStatus.OK);
    }

    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "根据ldap history id查询同步用户错误详情")
    @GetMapping("/ldap_histories/{id}/error_users")
    @CustomPageRequest
    public ResponseEntity<PageInfo<LdapErrorUserDTO>> pagingQueryErrorUsers(@ApiIgnore
                                                                            @SortDefault(value = "id", direction = Sort.Direction.DESC) PageRequest pageRequest,
                                                                            @PathVariable("organization_id") Long organizationId,
                                                                            @PathVariable Long id,
                                                                            LdapErrorUserDTO ldapErrorUserDTO) {
        return new ResponseEntity<>(ldapService.pagingQueryErrorUsers(pageRequest, id, ldapErrorUserDTO), HttpStatus.OK);
    }


    /**
     * 用于ldap同步过程中，因为不可控因素（iam服务挂掉）导致endTime为空一直在同步中的问题，该接口只是更新下endTime
     *
     * @param organizationId 组织id
     * @param id             ldap id
     * @return
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "根据ldap id更新历史记录的endTime")
    @PutMapping("/ldaps/{id}/stop")
    public ResponseEntity<LdapHistoryDTO> stop(@PathVariable("organization_id") Long organizationId, @PathVariable Long id) {
        return new ResponseEntity<>(ldapService.stop(id), HttpStatus.OK);
    }
}
