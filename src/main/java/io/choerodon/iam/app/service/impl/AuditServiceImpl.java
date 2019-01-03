package io.choerodon.iam.app.service.impl;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import io.choerodon.iam.api.dto.AuditDTO;
import io.choerodon.iam.app.service.AuditService;
import io.choerodon.iam.infra.dataobject.AuditDO;
import io.choerodon.iam.infra.mapper.AuditMapper;

/**
 * Created by Eugen on 01/03/2019.
 */
@Service
public class AuditServiceImpl implements AuditService {
    AuditMapper auditMapper;
    private final ModelMapper modelMapper = new ModelMapper();

    public AuditServiceImpl(AuditMapper auditMapper) {
        this.auditMapper = auditMapper;
    }

    @Override
    public AuditDTO create(AuditDTO auditDTO) {
        AuditDO auditDO = modelMapper.map(auditDTO, AuditDO.class);
        auditMapper.insert(auditDO);
        return modelMapper.map(auditDO, AuditDTO.class);
    }
}
