package io.choerodon.iam.api.controller.v1;

import io.choerodon.base.annotation.Permission;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.core.base.BaseController;
import io.choerodon.iam.api.dto.LabelDTO;
import io.choerodon.iam.app.service.LabelService;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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

    @Permission(type = ResourceType.SITE)
    @ApiOperation(value = "通过类型查询label")
    @GetMapping
    public ResponseEntity<List<LabelDTO>> listByType(LabelDTO label) {
        return new ResponseEntity<>(labelService.listByOption(label), HttpStatus.OK);
    }

}
