package io.choerodon.iam.app.service;


import io.choerodon.iam.infra.dto.UploadHistoryDTO;

/**
 * @author superlee
 */
public interface UploadHistoryService {
    UploadHistoryDTO latestHistory(Long userId, String type, Long sourceId, String sourceType);
}
