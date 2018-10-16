package io.choerodon.iam.api.controller.v1;

import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.InitRoleCode;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.SystemSettingDTO;
import io.choerodon.iam.app.service.SystemSettingService;
import io.choerodon.swagger.annotation.Permission;
import io.swagger.annotations.ApiOperation;
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
public class SystemSettingController {
    private final SystemSettingService systemSettingService;

    @Autowired
    public SystemSettingController(SystemSettingService systemSettingService) {
        this.systemSettingService = systemSettingService;
    }

    @PostMapping
    @ApiOperation(value = "保存系统设置")
    @Permission(level = ResourceLevel.SITE, roles = InitRoleCode.SITE_ADMINISTRATOR)
    public ResponseEntity<SystemSettingDTO> addSetting(@Valid @RequestBody SystemSettingDTO systemSettingDTO, BindingResult result) {
        if (result.hasErrors()) {
            throw new CommonException(result.getAllErrors().get(0).getDefaultMessage());
        }
        return new ResponseEntity<>(systemSettingService.addSetting(systemSettingDTO), HttpStatus.OK);
    }

    @PutMapping
    @ApiOperation(value = "更新系统设置")
    @Permission(level = ResourceLevel.SITE, roles = InitRoleCode.SITE_ADMINISTRATOR)
    public ResponseEntity<SystemSettingDTO> updateSetting(@Valid @RequestBody SystemSettingDTO systemSettingDTO, BindingResult result) {
        if (result.hasErrors()) {
            throw new CommonException(result.getAllErrors().get(0).getDefaultMessage());
        }
        return new ResponseEntity<>(systemSettingService.updateSetting(systemSettingDTO), HttpStatus.OK);
    }

    @DeleteMapping
    @ApiOperation(value = "重置系统设置")
    @Permission(level = ResourceLevel.SITE, roles = InitRoleCode.SITE_ADMINISTRATOR)
    public ResponseEntity resetSetting() {
        systemSettingService.resetSetting();
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping
    @ApiOperation(value = "获取系统设置")
    @Permission(level = ResourceLevel.SITE, roles = InitRoleCode.SITE_ADMINISTRATOR)
    public ResponseEntity<SystemSettingDTO> getSetting() {
        return new ResponseEntity<>(systemSettingService.getSetting(), HttpStatus.OK);
    }

    @PostMapping(value = "/upload/favicon")
    @ApiOperation(value = "上传平台徽标")
    @Permission(level = ResourceLevel.SITE, roles = InitRoleCode.SITE_ADMINISTRATOR)
    public ResponseEntity<String> uploadFavicon(@RequestPart MultipartFile file) {
        return new ResponseEntity<>(systemSettingService.uploadFavicon(file), HttpStatus.OK);
    }

    @PostMapping(value = "/upload/logo")
    @ApiOperation(value = "上传平台logo")
    @Permission(level = ResourceLevel.SITE, roles = InitRoleCode.SITE_ADMINISTRATOR)
    public ResponseEntity<String> uploadLogo(@RequestPart MultipartFile file) {
        return new ResponseEntity<>(systemSettingService.uploadSystemLogo(file), HttpStatus.OK);
    }
}
