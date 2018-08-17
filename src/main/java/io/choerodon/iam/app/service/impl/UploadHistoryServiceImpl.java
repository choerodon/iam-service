package io.choerodon.iam.app.service.impl;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.iam.api.dto.UploadHistoryDTO;
import io.choerodon.iam.app.service.UploadHistoryService;
import io.choerodon.iam.infra.mapper.UploadHistoryMapper;
import org.springframework.stereotype.Service;

/**
 * @author superlee
 */
@Service
public class UploadHistoryServiceImpl implements UploadHistoryService {
    private UploadHistoryMapper uploadHistoryMapper;
    public UploadHistoryServiceImpl(UploadHistoryMapper uploadHistoryMapper) {
        this.uploadHistoryMapper = uploadHistoryMapper;
    }

    @Override
    public UploadHistoryDTO latestHistory(Long userId, String type, Long sourceId, String sourceType) {
        return ConvertHelper.convert(uploadHistoryMapper.latestHistory(userId, type, sourceId, sourceType), UploadHistoryDTO.class);
    }
}
