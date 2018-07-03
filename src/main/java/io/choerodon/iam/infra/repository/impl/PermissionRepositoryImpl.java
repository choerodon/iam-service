package io.choerodon.iam.infra.repository.impl;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.iam.entity.PermissionE;
import io.choerodon.iam.domain.repository.PermissionRepository;
import io.choerodon.iam.infra.dataobject.PermissionDO;
import io.choerodon.iam.infra.mapper.PermissionMapper;
import io.choerodon.mybatis.pagehelper.PageHelper;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import io.choerodon.mybatis.pagehelper.domain.Sort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

/**
 * @author wuguokai
 */
@Component
public class PermissionRepositoryImpl implements PermissionRepository {

    private PermissionMapper permissionMapper;

    public PermissionRepositoryImpl(PermissionMapper permissionMapper) {
        this.permissionMapper = permissionMapper;
    }

    @Override
    public boolean existByCode(String code) {
        return permissionMapper.selectOne(new PermissionDO(code)) != null;
    }

    @Override
    public void deleteById(Long id) {
        permissionMapper.deleteByPrimaryKey(id);
    }

    @Override
    public Page<PermissionDO> pagingQuery(PageRequest pageRequest, PermissionDO permissionDO, String param) {
        return
                PageHelper.doPageAndSort(
                        pageRequest, () -> permissionMapper.fulltextSearch(permissionDO, param));
    }

    @Override
    public List<PermissionDO> selectByRoleId(Long roleId) {
        return permissionMapper.selectByRoleId(roleId);
    }

    @Override
    public PermissionE selectByCode(String code) {
        PermissionDO permissionDO = new PermissionDO();
        permissionDO.setCode(code);
        return ConvertHelper.convert(permissionMapper.selectOne(permissionDO), PermissionE.class);
    }

    @Override
    public PermissionE insertSelective(PermissionE permissionE) {
        PermissionDO permissionDO = ConvertHelper.convert(permissionE, PermissionDO.class);
        if (permissionMapper.insertSelective(permissionDO) != 1) {
            throw new CommonException("error.permission.insert");
        }
        permissionDO = permissionMapper.selectByPrimaryKey(permissionDO.getId());
        return ConvertHelper.convert(permissionMapper.selectByPrimaryKey(permissionDO.getId()), PermissionE.class);
    }

    @Override
    public PermissionE updateSelective(PermissionE permissionE) {
        PermissionDO permissionDO = ConvertHelper.convert(permissionE, PermissionDO.class);
        if (permissionMapper.updateByPrimaryKeySelective(permissionDO) != 1) {
            throw new CommonException("error.permission.update");
        }
        permissionDO = permissionMapper.selectByPrimaryKey(permissionDO.getId());
        return ConvertHelper.convert(permissionMapper.selectByPrimaryKey(permissionDO.getId()), PermissionE.class);
    }

    @Override
    public PermissionE selectByPrimaryKey(Object key) {
        return ConvertHelper.convert(permissionMapper.selectByPrimaryKey(key), PermissionE.class);
    }

    @Override
    public Set<String> checkPermission(Long memberId, String sourceType, Long sourceId, Set<String> codes) {
        return permissionMapper.checkPermission(memberId, sourceType, sourceId, codes);
    }

    @Override
    public List<PermissionE> query(String level, String serviceName, String code) {
        PermissionDO permissionDO = new PermissionDO();
        permissionDO.setLevel(level);
        permissionDO.setServiceName(serviceName);
        permissionDO.setCode(code);
        Sort sort = PageHelper.getLocalSort();
        return ConvertHelper.convertList(PageHelper.doSort(sort, () -> permissionMapper.select(permissionDO)), PermissionE.class);
    }

    @Override
    public Page<PermissionDO> pagingQuery(PageRequest pageRequest, Long id) {
        return PageHelper.doPageAndSort(pageRequest,
                () -> permissionMapper.selectByRoleId(id));
    }
}
