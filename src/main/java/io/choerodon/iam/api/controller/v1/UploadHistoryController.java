package io.choerodon.iam.api.controller.v1;

import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.UploadHistoryDTO;
import io.choerodon.iam.app.service.UploadHistoryService;
import io.choerodon.swagger.annotation.Permission;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * @author superlee
 */
@RestController
@RequestMapping(value = "/v1/upload/history")
public class UploadHistoryController {

    private UploadHistoryService uploadHistoryService;
    public UploadHistoryController(UploadHistoryService uploadHistoryService) {
        this.uploadHistoryService = uploadHistoryService;
    }

    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation("查询最新的导入历史")
    @GetMapping
    public ResponseEntity<UploadHistoryDTO> latestHistory(@RequestParam(value = "user_id") Long userId,
                                                          @RequestParam(value = "type") String type) {
        return new ResponseEntity<>(uploadHistoryService.latestHistory(userId, type), HttpStatus.OK);
    }
}
