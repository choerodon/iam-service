package io.choerodon.iam.api.controller.v1;

import io.choerodon.core.base.BaseController;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.LabelDTO;
import io.choerodon.iam.api.validator.LabelTypeValidator;
import io.choerodon.iam.app.service.LabelService;
import io.choerodon.swagger.annotation.Permission;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author superlee
 */
@RestController
@RequestMapping(value = "/v1/labels")
public class LabelController extends BaseController {

    private LabelService labelService;

    public LabelController(LabelService labelService) {
        this.labelService = labelService;
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "根据label的type查询name列表")
    @GetMapping
    public ResponseEntity<List<LabelDTO>> listByType(@RequestParam String type) {
        LabelTypeValidator.validate(type);
        return new ResponseEntity<>(labelService.listByType(type), HttpStatus.OK);
    }

}
