package io.choerodon.iam.domain.repository;

import io.choerodon.iam.infra.dataobject.UploadHistoryDO;

/**
 * @author superlee
 */
public interface UploadHistoryRepository {

    UploadHistoryDO insertSelective(UploadHistoryDO uploadHistoryDO);

    UploadHistoryDO selectByPrimaryKey(Object primaryKey);

    UploadHistoryDO updateByPrimaryKeySelective(UploadHistoryDO history);
}
