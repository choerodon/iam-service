package io.choerodon.iam.app.service;

import io.choerodon.iam.api.dto.AuditDTO;

/**
 * Created by Eugen on 01/03/2019.
 */
public interface AuditService {
    AuditDTO create(AuditDTO auditDTO);
}
