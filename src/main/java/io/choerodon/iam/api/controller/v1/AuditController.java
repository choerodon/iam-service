package io.choerodon.iam.api.controller.v1;

import javax.validation.Valid;

import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.api.dto.AuditDTO;
import io.choerodon.iam.app.service.AuditService;
import io.choerodon.swagger.annotation.Permission;

/**
 * @author Eugen
 **/
@RestController
@RequestMapping(value = "/v1/audit")
public class AuditController {

    private AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @Permission(permissionWithin = true)
    @ApiOperation(value = "创建审计记录")
    @PostMapping(value = "/insert")
    public ResponseEntity<AuditDTO> create(@RequestBody @Valid AuditDTO auditDTO) {
        auditDTO.setUserId(DetailsHelper.getUserDetails().getUserId());
        return new ResponseEntity<>(auditService.create(auditDTO), HttpStatus.OK);
    }
}
