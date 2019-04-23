package io.choerodon.iam.infra.repository.impl;

import java.util.List;
import java.util.Set;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import io.choerodon.iam.infra.dto.OrganizationDTO;
import org.springframework.stereotype.Component;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.OrganizationSimplifyDTO;
import io.choerodon.iam.domain.repository.OrganizationRepository;
import io.choerodon.iam.infra.mapper.MemberRoleMapper;
import io.choerodon.iam.infra.mapper.OrganizationMapper;

/**
 * @author wuguokai
 */
@Component
public class OrganizationRepositoryImpl implements OrganizationRepository {

    private OrganizationMapper organizationMapper;
    private MemberRoleMapper memberRoleMapper;

    public OrganizationRepositoryImpl(OrganizationMapper organizationMapper,
                                      MemberRoleMapper memberRoleMapper) {
        this.organizationMapper = organizationMapper;
        this.memberRoleMapper = memberRoleMapper;
    }

    @Override
    public OrganizationDTO create(OrganizationDTO organizationDTO) {
        int isInsert = organizationMapper.insertSelective(organizationDTO);
        if (isInsert != 1) {
            throw new CommonException("error.organization.create");
        }
        return organizationMapper.selectByPrimaryKey(organizationDTO);
    }

    @Override
    public OrganizationDTO update(OrganizationDTO organizationDTO) {
        int isUpdate = organizationMapper.updateByPrimaryKey(organizationDTO);
        if (isUpdate != 1) {
            throw new CommonException("error.organization.update");
        }
        return organizationMapper.selectByPrimaryKey(organizationDTO.getId());
    }

    @Override
    public OrganizationDTO selectByPrimaryKey(Long organizationId) {
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
    public Page<OrganizationDTO> pagingQuery(OrganizationDTO organizationDTO, int page, int size, String param) {
        return PageHelper.startPage(page, size).doSelectPage(() -> organizationMapper.fulltextSearch(organizationDTO, param));
    }

    @Override
    public List<OrganizationDTO> selectFromMemberRoleByMemberId(Long userId, Boolean includedDisabled) {
        return organizationMapper.selectFromMemberRoleByMemberId(userId, includedDisabled);
    }

    @Override
    public List<OrganizationDTO> selectOrgByUserAndPros(Long userId, Boolean includedDisabled) {
        return organizationMapper.selectOrgByUserAndPros(userId, includedDisabled);
    }

    @Override
    public List<OrganizationDTO> selectAll() {
        return organizationMapper.selectAll();
    }

    @Override
    public List<OrganizationDTO> selectAllOrganizationsWithEnabledProjects() {
        return organizationMapper.selectAllWithEnabledProjects();
    }

    @Override
    public List<OrganizationDTO> select(OrganizationDTO organizationDTO) {
        return organizationMapper.select(organizationDTO);
    }

    @Override
    public OrganizationDTO selectOne(OrganizationDTO organizationDTO) {
        return organizationMapper.selectOne(organizationDTO);
    }

    @Override
    public Page<OrganizationDTO> pagingQueryOrganizationAndRoleById(int page, int size, Long id, String params) {
        Page<OrganizationDTO> result = new Page<>(page, size, true);
        int start = page * size;
        int count = memberRoleMapper.selectCountBySourceId(id, "organization");
        result.setTotal(count);
        result.addAll(organizationMapper.selectOrganizationsWithRoles(id, start, size, params));
        return result;
    }

    @Override
    public Page<OrganizationDTO> pagingQueryByUserId(Long userId, OrganizationDTO organizationDTO, int page,int size, String param) {
        return PageHelper.startPage(page,size).doSelectPage(()->organizationMapper.selectOrganizationsByUserId(userId, organizationDTO, param));
    }

    @Override
    public List<Long> listMemberIds(Long organizationId) {
        return organizationMapper.listMemberIds(organizationId, "organization");
    }

    @Override
    public List<OrganizationDTO> queryByIds(Set<Long> ids) {
        return organizationMapper.selectByIds(ids);
    }

    @Override
    public Page<OrganizationSimplifyDTO> selectAllOrgIdAndName(int page, int size) {
        return PageHelper.startPage(page,size).doSelectPage(() ->organizationMapper.selectAllOrgIdAndName());
    }
}
