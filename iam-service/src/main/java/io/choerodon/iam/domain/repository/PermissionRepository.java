package io.choerodon.iam.domain.repository;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.domain.iam.entity.PermissionE;
import io.choerodon.iam.infra.dataobject.PermissionDO;
import io.choerodon.iam.infra.dataobject.RoleDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

import java.util.List;
import java.util.Set;

/**
 * @author wuguokai
 */
public interface PermissionRepository {
    /**
     * 根据permissionDO的值进行全匹配查询
     * @param permissionDO 查询条件
     * @return List<PermissionDO>
     */
    List<PermissionDO> select(PermissionDO permissionDO);

    boolean existByCode(String code);

    PermissionE selectByCode(String code);

    PermissionE insertSelective(PermissionE permissionE);

    PermissionE updateSelective(PermissionE permissionE);

    PermissionE selectByPrimaryKey(Object key);

    void deleteById(Long id);

    Page<PermissionDO> pagingQuery(PageRequest pageRequest, PermissionDO permissionDO, String param);

    List<PermissionDO> selectByRoleId(Long roleId);

    Set<String> checkPermission(Long memberId, String sourceType,
                                Long sourceId, Set<String> codes);

    List<PermissionE> query(String level, String serviceName, String code);

    Page<PermissionDO> pagingQuery(PageRequest pageRequest, Long id, String params);

    List<PermissionDO> selectErrorLevelPermissionByRole(RoleDO roleDO);
}
