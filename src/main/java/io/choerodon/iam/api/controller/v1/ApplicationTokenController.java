package io.choerodon.iam.api.controller.v1;

import io.choerodon.base.annotation.Permission;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.iam.app.service.ApplicationService;
import io.choerodon.iam.infra.dto.ApplicationDTO;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author jiameng.cao
 * @date 2019/6/18
 */
@RestController
@RequestMapping(value = "/v1/applications")
public class ApplicationTokenController {
    private ApplicationService applicationService;

    public ApplicationTokenController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }


    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "获取application的token")
    @GetMapping(value = "/{id}/token")
    public ResponseEntity<String> getToken(@PathVariable("id") Long id) {
        return new ResponseEntity<>(applicationService.getToken(id), HttpStatus.OK);

    }

    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "创建application的token")
    @PostMapping(value = "/{id}/token")
    public ResponseEntity<String> createToken(@PathVariable("id") Long id) {
        return new ResponseEntity<>(applicationService.createToken(id), HttpStatus.OK);

    }

    @Permission(type = ResourceType.SITE, permissionPublic = true)
    @ApiOperation(value = "根据token查询应用接口")
    @GetMapping(value = "/token")
    public ResponseEntity<ApplicationDTO> getApplicationByToken(@RequestBody ApplicationDTO applicationDTO) {
        return new ResponseEntity<>(applicationService.getApplicationByToken(applicationDTO.getApplicationToken()), HttpStatus.OK);

    }
}
