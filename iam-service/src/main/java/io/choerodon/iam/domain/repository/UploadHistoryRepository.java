package io.choerodon.iam.domain.repository;

import io.choerodon.iam.infra.dto.UploadHistoryDTO;

/**
 * @author superlee
 */
public interface UploadHistoryRepository {

    UploadHistoryDTO insertSelective(UploadHistoryDTO uploadHistoryDTO);

    UploadHistoryDTO selectByPrimaryKey(Object primaryKey);

    UploadHistoryDTO updateByPrimaryKeySelective(UploadHistoryDTO history);
}
