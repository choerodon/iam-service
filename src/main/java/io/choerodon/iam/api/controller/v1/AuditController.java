package io.choerodon.iam.api.controller.v1;

import javax.validation.Valid;

import com.github.pagehelper.PageInfo;
import io.choerodon.base.annotation.Permission;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.base.domain.Sort;
import io.choerodon.iam.infra.dto.AuditDTO;
import io.choerodon.mybatis.annotation.SortDefault;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.choerodon.iam.app.service.AuditService;
import io.choerodon.swagger.annotation.CustomPageRequest;
import springfox.documentation.annotations.ApiIgnore;

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
    public ResponseEntity<PageInfo<AuditDTO>> pagingQuery(@ApiIgnore
                                                          @SortDefault(value = "id", direction = Sort.Direction.DESC) PageRequest pageRequest,
                                                          @RequestParam(name = "userId", required = false) Long userId,
                                                          @RequestParam(value = "dataType", required = false) String dataType,
                                                          @RequestParam(value = "businessType", required = false) String businessType) {
        return new ResponseEntity<>(auditService.pagingQuery(userId, businessType, dataType,pageRequest), HttpStatus.OK);
    }
}
