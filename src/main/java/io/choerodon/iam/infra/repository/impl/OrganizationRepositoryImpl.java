package io.choerodon.iam.infra.repository.impl;

import java.util.List;

import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.iam.entity.OrganizationE;
import io.choerodon.iam.domain.repository.OrganizationRepository;
import io.choerodon.iam.infra.dataobject.OrganizationDO;
import io.choerodon.iam.infra.mapper.OrganizationMapper;
import io.choerodon.mybatis.pagehelper.PageHelper;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author wuguokai
 */
@Component
public class OrganizationRepositoryImpl implements OrganizationRepository {

    private OrganizationMapper organizationMapper;

    public OrganizationRepositoryImpl(OrganizationMapper organizationMapper) {
        this.organizationMapper = organizationMapper;
    }

    @Override
    public OrganizationE create(OrganizationE organizationE) {
        OrganizationDO organizationDO = ConvertHelper.convert(organizationE, OrganizationDO.class);
        int isInsert = organizationMapper.insertSelective(organizationDO);
        if (isInsert != 1) {
            int count = organizationMapper.selectCount(new OrganizationDO(organizationDO.getName()));
            if (count > 0) {
                throw new CommonException("error.organization.existed");
            }
            throw new CommonException("error.organization.create");
        }
        return ConvertHelper.convert(organizationMapper.selectByPrimaryKey(
                organizationDO.getId()), OrganizationE.class);
    }

    @Override
    public OrganizationE update(OrganizationE organizationE) {
        OrganizationDO organizationDO = ConvertHelper.convert(organizationE, OrganizationDO.class);
        int isUpdate = organizationMapper.updateByPrimaryKeySelective(organizationDO);
        if (isUpdate != 1) {
            throw new CommonException("error.organization.update");
        }
        return ConvertHelper.convert(organizationMapper.selectByPrimaryKey(
                organizationDO.getId()), OrganizationE.class);
    }

    @Override
    public OrganizationDO selectByPrimaryKey(Long organizationId) {
        return organizationMapper.selectByPrimaryKey(organizationId);
    }

    @Override
    public Boolean deleteByKey(Long organizationId) {
        int isDelete = organizationMapper.deleteByPrimaryKey(organizationId);
        if (isDelete != 1) {
            throw new CommonException("error.organization.delete");
        }
        return true;
    }

    @Override
    public Page<OrganizationDO> pagingQuery(OrganizationDO organizationDO, PageRequest pageRequest, String[] params) {
        return PageHelper.doPageAndSort(pageRequest, () -> organizationMapper.fulltextSearch(organizationDO, params));
    }

    @Override
    public List<OrganizationDO> selectFromMemberRoleByMemberId(Long userId, Boolean includedDisabled) {
        return organizationMapper.selectFromMemberRoleByMemberId(userId, includedDisabled);
    }

    @Override
    public List<OrganizationDO> selectOrgByUserAndPros(Long userId, Boolean includedDisabled) {
        return organizationMapper.selectOrgByUserAndPros(userId, includedDisabled);
    }

    @Override
    public List<OrganizationDO> selectAll() {
        return organizationMapper.selectAll();
    }

    @Override
    public List<OrganizationDO> selectAllOrganizationsWithEnabledProjects() {
        return organizationMapper.selectAllOrganizationsWithEnabledProjects();
    }

    @Override
    public List<OrganizationDO> select(OrganizationDO organizationDO) {
        return organizationMapper.select(organizationDO);
    }

    @Override
    public OrganizationDO selectOne(OrganizationDO organizationDO) {
        return organizationMapper.selectOne(organizationDO);
    }
}
