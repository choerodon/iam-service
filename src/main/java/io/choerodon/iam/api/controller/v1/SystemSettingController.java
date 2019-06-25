package io.choerodon.iam.api.controller.v1;

import io.choerodon.base.annotation.Permission;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.core.base.BaseController;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.InitRoleCode;
import io.choerodon.iam.api.dto.ResetPasswordDTO;
import io.choerodon.iam.app.service.SystemSettingService;
import io.choerodon.iam.infra.dto.SystemSettingDTO;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;

/**
 * @author zmf
 * @since 2018-10-15
 */
@RestController
@RequestMapping(value = "/v1/system/setting")
public class SystemSettingController extends BaseController {
    private final SystemSettingService systemSettingService;

    public SystemSettingController(SystemSettingService systemSettingService) {
        this.systemSettingService = systemSettingService;
    }

    @PostMapping
    @ApiOperation(value = "保存系统设置")
    @Permission(type = ResourceType.SITE, roles = InitRoleCode.SITE_ADMINISTRATOR)
    public ResponseEntity<SystemSettingDTO> addSetting(@Valid @RequestBody SystemSettingDTO systemSettingDTO, BindingResult result) {
        if (result.hasErrors()) {
            throw new CommonException(result.getAllErrors().get(0).getDefaultMessage());
        }
        return new ResponseEntity<>(systemSettingService.addSetting(systemSettingDTO), HttpStatus.OK);
    }

    @PutMapping
    @ApiOperation(value = "更新系统设置")
    @Permission(type = ResourceType.SITE, roles = InitRoleCode.SITE_ADMINISTRATOR)
    public ResponseEntity<SystemSettingDTO> updateSetting(@Valid @RequestBody SystemSettingDTO systemSettingDTO, BindingResult result) {
        if (result.hasErrors()) {
            throw new CommonException(result.getAllErrors().get(0).getDefaultMessage());
        }
        return new ResponseEntity<>(systemSettingService.updateSetting(systemSettingDTO), HttpStatus.OK);
    }

    @DeleteMapping
    @ApiOperation(value = "重置系统设置")
    @Permission(type = ResourceType.SITE, roles = InitRoleCode.SITE_ADMINISTRATOR)
    public ResponseEntity resetSetting() {
        systemSettingService.resetSetting();
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping
    @ApiOperation(value = "获取系统设置")
    @Permission(type = ResourceType.SITE, permissionPublic = true)
    public ResponseEntity<Object> getSetting() {
        SystemSettingDTO systemSettingDTO = systemSettingService.getSetting();
        Object result;
        result = systemSettingDTO == null ? "{}" : systemSettingDTO;
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping(value = "/upload/favicon")
    @ApiOperation(value = "上传平台徽标")
    @Permission(type = ResourceType.SITE, roles = InitRoleCode.SITE_ADMINISTRATOR)
    public ResponseEntity<String> uploadFavicon(@RequestPart MultipartFile file,
                                                @ApiParam(name = "rotate", value = "顺时针旋转的角度", example = "90")
                                                @RequestParam(required = false) Double rotate,
                                                @ApiParam(name = "startX", value = "裁剪的X轴", example = "100")
                                                @RequestParam(required = false, name = "startX") Integer axisX,
                                                @ApiParam(name = "startY", value = "裁剪的Y轴", example = "100")
                                                @RequestParam(required = false, name = "startY") Integer axisY,
                                                @ApiParam(name = "endX", value = "裁剪的宽度", example = "200")
                                                @RequestParam(required = false, name = "endX") Integer width,
                                                @ApiParam(name = "endY", value = "裁剪的高度", example = "200")
                                                @RequestParam(required = false, name = "endY") Integer height) {
        return new ResponseEntity<>(systemSettingService.uploadFavicon(file, rotate, axisX, axisY, width, height), HttpStatus.OK);
    }

    @PostMapping(value = "/upload/logo")
    @ApiOperation(value = "上传平台logo")
    @Permission(type = ResourceType.SITE, roles = InitRoleCode.SITE_ADMINISTRATOR)
    public ResponseEntity<String> uploadLogo(@RequestPart MultipartFile file,
                                             @ApiParam(name = "rotate", value = "顺时针旋转的角度", example = "90")
                                             @RequestParam(required = false) Double rotate,
                                             @ApiParam(name = "startX", value = "裁剪的X轴", example = "100")
                                             @RequestParam(required = false, name = "startX") Integer axisX,
                                             @ApiParam(name = "startY", value = "裁剪的Y轴", example = "100")
                                             @RequestParam(required = false, name = "startY") Integer axisY,
                                             @ApiParam(name = "endX", value = "裁剪的宽度", example = "200")
                                             @RequestParam(required = false, name = "endX") Integer width,
                                             @ApiParam(name = "endY", value = "裁剪的高度", example = "200")
                                             @RequestParam(required = false, name = "endY") Integer height) {
        return new ResponseEntity<>(systemSettingService.uploadSystemLogo(file, rotate, axisX, axisY, width, height), HttpStatus.OK);
    }

    @GetMapping(value = "/enable_resetPassword")
    @ApiOperation(value = "是否允许修改仓库密码")
    @Permission(type = ResourceType.SITE, roles = InitRoleCode.SITE_ADMINISTRATOR)
    public ResponseEntity<ResetPasswordDTO> enableResetPassword() {
        SystemSettingDTO systemSettingDTO = systemSettingService.getSetting();
        Boolean result;
        result = (systemSettingDTO.getResetGitlabPasswordUrl() == null || systemSettingDTO.getResetGitlabPasswordUrl().equals("")) ? false : true;
        ResetPasswordDTO resetPasswordDTO = new ResetPasswordDTO();
        if (result) {
            resetPasswordDTO.setEnable_reset(result);
            resetPasswordDTO.setResetGitlabPasswordUrl(systemSettingDTO.getResetGitlabPasswordUrl());
        } else {
            resetPasswordDTO.setEnable_reset(false);
        }
        return new ResponseEntity<>(resetPasswordDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/enable_category")
    @Permission(type = ResourceType.SITE, permissionLogin = true)
    @ApiOperation("是否开启项目/组织类型控制")
    public ResponseEntity<Boolean> getEnabledStateOfTheCategory() {
        return new ResponseEntity<>(systemSettingService.getEnabledStateOfTheCategory(), HttpStatus.OK);
    }
}
