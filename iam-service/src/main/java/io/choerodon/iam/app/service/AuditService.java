package io.choerodon.iam.app.service;


import com.github.pagehelper.Page;
import io.choerodon.iam.infra.dto.AuditDTO;

/**
 * Created by Eugen on 01/03/2019.
 */
public interface AuditService {
    /**
     * 创建审计记录
     *
     * @param auditDTO 审计记录dto
     * @return 创建结果
     */
    AuditDTO create(AuditDTO auditDTO);

    /**
     * 分页查询审计记录
     *
     * @param userId       用户Id
     * @param businessType 业务类型
     * @param dataType     数据类型
     * @param pageRequest  分页请求
     * @return 分页结果
     */
    Page<AuditDTO> pagingQuery(Long userId, String businessType, String dataType, int page, int size);
}
