package io.choerodon.iam.infra.repository.impl;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.repository.UploadHistoryRepository;
import io.choerodon.iam.infra.dto.UploadHistoryDTO;
import io.choerodon.iam.infra.mapper.UploadHistoryMapper;
import org.springframework.stereotype.Component;

/**
 * @author superlee
 */
@Component
public class UploadHistoryRepositoryImpl implements UploadHistoryRepository {

    private UploadHistoryMapper uploadHistoryMapper;

    public UploadHistoryRepositoryImpl(UploadHistoryMapper uploadHistoryMapper) {
        this.uploadHistoryMapper = uploadHistoryMapper;
    }

    @Override
    public UploadHistoryDTO insertSelective(UploadHistoryDTO uploadHistoryDTO) {
        if (uploadHistoryMapper.insertSelective(uploadHistoryDTO) != 1) {
            throw new CommonException("error.uploadHistory.insert");
        }
        return uploadHistoryMapper.selectByPrimaryKey(uploadHistoryDTO.getId());
    }

    @Override
    public UploadHistoryDTO selectByPrimaryKey(Object primaryKey) {
        return uploadHistoryMapper.selectByPrimaryKey(primaryKey);
    }

    @Override
    public UploadHistoryDTO updateByPrimaryKeySelective(UploadHistoryDTO history) {
        if (history.getId() == null) {
            throw new CommonException("error.update.dataObject.id.null");
        }
        if (history.getObjectVersionNumber() == null) {
            throw new CommonException("error.update.dataObject.objectVersionNumber.null");
        }
        Long objectVersionNumber = uploadHistoryMapper.selectByPrimaryKey(history.getId()).getObjectVersionNumber();
        if (!objectVersionNumber.equals(history.getObjectVersionNumber())) {
            throw new CommonException("error.update.dataObject.objectVersionNumber.not.equal");
        }
        if (uploadHistoryMapper.updateByPrimaryKeySelective(history) != 1) {
            throw new CommonException("error.uploadHistory.update");
        }
        return uploadHistoryMapper.selectByPrimaryKey(history.getId());
    }
}
