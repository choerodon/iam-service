package io.choerodon.iam.api.controller.v1;

import java.util.List;
import javax.validation.Valid;

import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.choerodon.core.base.BaseController;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.validator.ValidList;
import io.choerodon.iam.api.dto.MemberRoleDTO;
import io.choerodon.iam.api.dto.RoleAssignmentDeleteDTO;
import io.choerodon.iam.api.validator.MemberRoleValidator;
import io.choerodon.iam.api.validator.RoleAssignmentViewValidator;
import io.choerodon.iam.app.service.RoleMemberService;
import io.choerodon.swagger.annotation.Permission;

/**
 * @author superlee
 * @author wuguokai
 */
@RestController
@RequestMapping(value = "/v1")
public class RoleMemberController extends BaseController {

    private RoleMemberService roleMemberService;
    @Autowired
    private MemberRoleValidator memberRoleValidator;

    public RoleMemberController(RoleMemberService roleMemberService) {
        this.roleMemberService = roleMemberService;
    }

    /**
     * 在site层分配角色
     * <p>
     * is_edit 是否是编辑，如果false就表示新建角色，true表示是在是编辑角色
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "用户批量在site层分配角色")
    @PostMapping(value = "/role_members/site_level")
    public ResponseEntity<List<MemberRoleDTO>> createOrUpdateOnSiteLevel(@RequestParam(value = "is_edit", required = false) Boolean isEdit,
                                                                         @RequestParam(name = "member_ids") List<Long> memberIds,
                                                                         @RequestBody ValidList<MemberRoleDTO> memberRoleDTOList) {
        memberRoleValidator.distributionRoleValidator(ResourceLevel.SITE.value(), memberRoleDTOList);
        return new ResponseEntity<>(roleMemberService.createOrUpdateRolesByMemberIdOnSiteLevel(
                isEdit, memberIds, memberRoleDTOList), HttpStatus.OK);
    }

    /**
     * 在organization层分配角色
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "用户批量在organization层分配角色")
    @PostMapping(value = "/role_members/organization_level")
    public ResponseEntity<List<MemberRoleDTO>> createOrUpdateOnOrganizationLevel(@RequestParam(value = "is_edit", required = false) Boolean isEdit,
                                                                                 @RequestParam(name = "source_id") Long sourceId,
                                                                                 @RequestParam(name = "member_ids") List<Long> memberIds,
                                                                                 @RequestBody ValidList<MemberRoleDTO> memberRoleDTOList) {
        memberRoleValidator.distributionRoleValidator(ResourceLevel.ORGANIZATION.value(), memberRoleDTOList);
        return new ResponseEntity<>(roleMemberService.createOrUpdateRolesByMemberIdOnOrganizationLevel(
                isEdit, sourceId, memberIds, memberRoleDTOList), HttpStatus.OK);
    }

    /**
     * 在project层分配角色
     */
    @Permission(level = ResourceLevel.PROJECT)
    @ApiOperation(value = "用户批量在project层分配角色")
    @PostMapping(value = "/role_members/project_level")
    public ResponseEntity<List<MemberRoleDTO>> createOnProjectLevel(@RequestParam(value = "is_edit", required = false) Boolean isEdit,
                                                                    @RequestParam(name = "source_id") Long sourceId,
                                                                    @RequestParam(name = "member_ids") List<Long> memberIds,
                                                                    @RequestBody ValidList<MemberRoleDTO> memberRoleDTOList) {
        memberRoleValidator.distributionRoleValidator(ResourceLevel.PROJECT.value(), memberRoleDTOList);
        return new ResponseEntity<>(roleMemberService.createOrUpdateRolesByMemberIdOnProjectLevel(
                isEdit, sourceId, memberIds, memberRoleDTOList), HttpStatus.OK);
    }

    /**
     * 在site层根据成员id和角色id删除角色
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "在site层根据成员id和角色id删除角色")
    @PostMapping(value = "/role_members/site_level/delete")
    public ResponseEntity deleteOnSiteLevel(@RequestBody @Valid RoleAssignmentDeleteDTO roleAssignmentDeleteDTO) {
        RoleAssignmentViewValidator.validate(roleAssignmentDeleteDTO.getView());
        roleMemberService.deleteOnSiteLevel(roleAssignmentDeleteDTO);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    /**
     * 在organization层根据成员id和角色id删除角色
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "在organization层根据成员id和角色id删除角色")
    @PostMapping(value = "/role_members/organization_level/delete")
    public ResponseEntity deleteOnOrganizationLevel(@RequestBody @Valid RoleAssignmentDeleteDTO roleAssignmentDeleteDTO) {
        RoleAssignmentViewValidator.validate(roleAssignmentDeleteDTO.getView());
        roleMemberService.deleteOnOrganizationLevel(roleAssignmentDeleteDTO);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    /**
     * 在project层根据id删除角色
     */
    @Permission(level = ResourceLevel.PROJECT)
    @ApiOperation(value = "在project层根据id删除角色")
    @PostMapping(value = "/role_members/project_level/delete")
    public ResponseEntity deleteOnProjectLevel(@RequestBody @Valid RoleAssignmentDeleteDTO roleAssignmentDeleteDTO) {
        RoleAssignmentViewValidator.validate(roleAssignmentDeleteDTO.getView());
        roleMemberService.deleteOnProjectLevel(roleAssignmentDeleteDTO);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }


    /**------------------>分割线-------------------->分割线------------------>分割线-------------------->*/

    /**
     * 在site层分配角色
     * <p>
     * is_edit 是否是编辑，如果false就表示新建角色，true表示是在是编辑角色
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "用户批量在site层分配角色")
    @PostMapping(value = "/site/role_members")
    public ResponseEntity<List<MemberRoleDTO>> createOrUpdateOnSiteLevel1(@RequestParam(value = "is_edit", required = false) Boolean isEdit,
                                                                         @RequestParam(name = "member_ids") List<Long> memberIds,
                                                                         @RequestBody ValidList<MemberRoleDTO> memberRoleDTOList) {
        memberRoleValidator.distributionRoleValidator(ResourceLevel.SITE.value(), memberRoleDTOList);
        return new ResponseEntity<>(roleMemberService.createOrUpdateRolesByMemberIdOnSiteLevel(
                isEdit, memberIds, memberRoleDTOList), HttpStatus.OK);
    }

    /**
     * 在organization层分配角色
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "用户批量在organization层分配角色")
    @PostMapping(value = "/organizations/{organization_id}/role_members")
    public ResponseEntity<List<MemberRoleDTO>> createOrUpdateOnOrganizationLevel1(@RequestParam(value = "is_edit", required = false) Boolean isEdit,
                                                                                 @PathVariable(name = "organization_id") Long sourceId,
                                                                                 @RequestParam(name = "member_ids") List<Long> memberIds,
                                                                                 @RequestBody ValidList<MemberRoleDTO> memberRoleDTOList) {
        memberRoleValidator.distributionRoleValidator(ResourceLevel.ORGANIZATION.value(), memberRoleDTOList);
        return new ResponseEntity<>(roleMemberService.createOrUpdateRolesByMemberIdOnOrganizationLevel(
                isEdit, sourceId, memberIds, memberRoleDTOList), HttpStatus.OK);
    }

    /**
     * 在project层分配角色
     */
    @Permission(level = ResourceLevel.PROJECT)
    @ApiOperation(value = "用户批量在project层分配角色")
    @PostMapping(value = "/projects/{project_id}/role_members")
    public ResponseEntity<List<MemberRoleDTO>> createOnProjectLevel1(@RequestParam(value = "is_edit", required = false) Boolean isEdit,
                                                                    @PathVariable(name = "project_id") Long sourceId,
                                                                    @RequestParam(name = "member_ids") List<Long> memberIds,
                                                                    @RequestBody ValidList<MemberRoleDTO> memberRoleDTOList) {
        memberRoleValidator.distributionRoleValidator(ResourceLevel.PROJECT.value(), memberRoleDTOList);
        return new ResponseEntity<>(roleMemberService.createOrUpdateRolesByMemberIdOnProjectLevel(
                isEdit, sourceId, memberIds, memberRoleDTOList), HttpStatus.OK);
    }

    /**
     * 在site层根据成员id和角色id删除角色
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "在site层根据成员id和角色id删除角色")
    @PostMapping(value = "/site/role_members/delete")
    public ResponseEntity deleteOnSiteLevel1(@RequestBody @Valid RoleAssignmentDeleteDTO roleAssignmentDeleteDTO) {
        RoleAssignmentViewValidator.validate(roleAssignmentDeleteDTO.getView());
        roleAssignmentDeleteDTO.setSourceId(0L);
        roleMemberService.deleteOnSiteLevel(roleAssignmentDeleteDTO);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    /**
     * 在organization层根据成员id和角色id删除角色
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "在organization层根据成员id和角色id删除角色")
    @PostMapping(value = "/organizations/{organization_id}/role_members/delete")
    public ResponseEntity deleteOnOrganizationLevel1(@PathVariable(name = "organization_id") Long sourceId,
                                                    @RequestBody @Valid RoleAssignmentDeleteDTO roleAssignmentDeleteDTO) {
        RoleAssignmentViewValidator.validate(roleAssignmentDeleteDTO.getView());
        roleAssignmentDeleteDTO.setSourceId(sourceId);
        roleMemberService.deleteOnOrganizationLevel(roleAssignmentDeleteDTO);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    /**
     * 在project层根据id删除角色
     */
    @Permission(level = ResourceLevel.PROJECT)
    @ApiOperation(value = "在project层根据id删除角色")
    @PostMapping(value = "/projects/{project_id}/role_members/delete")
    public ResponseEntity deleteOnProjectLevel1(@PathVariable(name = "project_id") Long sourceId,
                                               @RequestBody @Valid RoleAssignmentDeleteDTO roleAssignmentDeleteDTO) {
        RoleAssignmentViewValidator.validate(roleAssignmentDeleteDTO.getView());
        roleAssignmentDeleteDTO.setSourceId(sourceId);
        roleMemberService.deleteOnProjectLevel(roleAssignmentDeleteDTO);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }
}
