package io.choerodon.iam.app.service.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
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
    public PageInfo<AuditDTO> pagingQuery(Long userId, String businessType, String dataType, int page, int size) {
        return PageHelper.startPage(page, size).doSelectPageInfo(() -> auditMapper.selectByParams(userId, businessType, dataType));
    }
}
