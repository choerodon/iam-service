package io.choerodon.iam.api.controller.v1;

import javax.validation.Valid;

import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.AuditDTO;
import io.choerodon.iam.app.service.AuditService;
import io.choerodon.mybatis.pagehelper.annotation.SortDefault;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import io.choerodon.mybatis.pagehelper.domain.Sort;
import io.choerodon.swagger.annotation.CustomPageRequest;
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
        return new ResponseEntity<>(auditService.create(auditDTO), HttpStatus.OK);
    }


    @Permission(permissionWithin = true)
    @ApiOperation(value = "分页查询审计记录")
    @CustomPageRequest
    @GetMapping
    public ResponseEntity<Page<AuditDTO>> pagingQuery(@ApiIgnore
                                                      @SortDefault(value = "id", direction = Sort.Direction.ASC) PageRequest pageRequest,
                                                      @RequestParam(name = "userId", required = false) Long userId,
                                                      @RequestParam(value = "dataType", required = false) String dataType,
                                                      @RequestParam(value = "businessType", required = false) String businessType) {
        return new ResponseEntity<>(auditService.pagingQuery(userId, businessType, dataType, pageRequest), HttpStatus.OK);
    }
}
