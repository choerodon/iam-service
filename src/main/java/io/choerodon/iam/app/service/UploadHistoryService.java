package io.choerodon.iam.app.service;

import io.choerodon.iam.api.dto.UploadHistoryDTO;

/**
 * @author superlee
 */
public interface UploadHistoryService {
    UploadHistoryDTO latestHistory(Long userId, String type, Long sourceId, String sourceType);
}
