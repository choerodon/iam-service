package io.choerodon.iam.app.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.iam.infra.dto.AuditDTO;
import org.springframework.stereotype.Service;

import io.choerodon.iam.app.service.AuditService;
import io.choerodon.iam.infra.mapper.AuditMapper;

/**
 * Created by Eugen on 01/03/2019.
 */
@Service
public class AuditServiceImpl implements AuditService {
    private AuditMapper auditMapper;

    public AuditServiceImpl(AuditMapper auditMapper) {
        this.auditMapper = auditMapper;
    }

    @Override
    public AuditDTO create(AuditDTO auditDTO) {
        auditMapper.insert(auditDTO);
        return auditMapper.selectByPrimaryKey(auditDTO);
    }

    @Override
    public PageInfo<AuditDTO> pagingQuery(Long userId, String businessType, String dataType, PageRequest pageRequest) {
        return PageHelper
                .startPage(pageRequest.getPage(), pageRequest.getSize())
                .doSelectPageInfo(() -> auditMapper.selectByParams(userId, businessType, dataType));
    }
}
