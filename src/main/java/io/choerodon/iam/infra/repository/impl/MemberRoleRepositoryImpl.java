package io.choerodon.iam.infra.repository.impl;

import java.util.List;

import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.domain.PageInfo;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.ClientRoleSearchDTO;
import io.choerodon.iam.domain.iam.entity.MemberRoleE;
import io.choerodon.iam.domain.repository.MemberRoleRepository;
import io.choerodon.iam.infra.dataobject.ClientDO;
import io.choerodon.iam.infra.dataobject.MemberRoleDO;
import io.choerodon.iam.infra.mapper.MemberRoleMapper;
import io.choerodon.iam.infra.mapper.OrganizationMapper;
import io.choerodon.iam.infra.mapper.ProjectMapper;
import io.choerodon.iam.infra.mapper.RoleMapper;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author superlee
 * @data 2018/3/29
 */
@Component
public class MemberRoleRepositoryImpl implements MemberRoleRepository {

    private MemberRoleMapper memberRoleMapper;

    private ProjectMapper projectMapper;

    private OrganizationMapper organizationMapper;

    private RoleMapper roleMapper;

    public MemberRoleRepositoryImpl(MemberRoleMapper memberRoleMapper,
                                    ProjectMapper projectMapper,
                                    OrganizationMapper organizationMapper,
                                    RoleMapper roleMapper) {
        this.memberRoleMapper = memberRoleMapper;
        this.projectMapper = projectMapper;
        this.organizationMapper = organizationMapper;
        this.roleMapper = roleMapper;
    }

    @Override
    public MemberRoleE insertSelective(MemberRoleE memberRoleE) {
        MemberRoleDO memberRoleDO = ConvertHelper.convert(memberRoleE, MemberRoleDO.class);
        if (memberRoleDO.getMemberType() == null) {
            memberRoleDO.setMemberType("user");
        }
        if (roleMapper.selectByPrimaryKey(memberRoleDO.getRoleId()) == null) {
            throw new CommonException("error.member_role.insert.role.not.exist");
        }
        if (ResourceLevel.PROJECT.value().equals(memberRoleDO.getSourceType())
                && projectMapper.selectByPrimaryKey(memberRoleDO.getSourceId()) == null) {
            throw new CommonException("error.member_role.insert.project.not.exist");
        }
        if (ResourceLevel.ORGANIZATION.value().equals(memberRoleDO.getSourceType())
                && organizationMapper.selectByPrimaryKey(memberRoleDO.getSourceId()) == null) {
            throw new CommonException("error.member_role.insert.organization.not.exist");
        }
        if (memberRoleMapper.selectOne(memberRoleDO) != null) {
            throw new CommonException("error.member_role.has.existed");
        }
        if (memberRoleMapper.insertSelective(memberRoleDO) != 1) {
            throw new CommonException("error.member_role.create");
        }
        return ConvertHelper.convert(
                memberRoleMapper.selectByPrimaryKey(memberRoleDO.getId()), MemberRoleE.class);
    }

    @Override
    public List<MemberRoleE> select(MemberRoleE memberRoleE) {
        MemberRoleDO memberRoleDO = ConvertHelper.convert(memberRoleE, MemberRoleDO.class);
        return ConvertHelper.convertList(memberRoleMapper.select(memberRoleDO), MemberRoleE.class);
    }

    @Override
    public void deleteById(Long id) {
        memberRoleMapper.deleteByPrimaryKey(id);
    }

    @Override
    public MemberRoleE selectByPrimaryKey(Long id) {
        return ConvertHelper.convert(memberRoleMapper.selectByPrimaryKey(id), MemberRoleE.class);
    }

    @Override
    public MemberRoleDO selectOne(MemberRoleDO memberRole) {
        return memberRoleMapper.selectOne(memberRole);
    }

    @Override
    public void insert(MemberRoleDO memberRole) {
        if (memberRoleMapper.insertSelective(memberRole) != 1) {
            throw new CommonException("error.memberRole.insert.failed");
        }
    }

    @Override
    public List<Long> selectDeleteList(final List<Long> deleteList, final long memberId, final String memberType, final long sourceId, final String sourceType) {
        return memberRoleMapper.selectDeleteList(memberId, sourceId, memberType, sourceType, deleteList);
    }

    @Override
    public Page<ClientDO> pagingQueryClientsWithOrganizationLevelRoles(
            PageRequest pageRequest, ClientRoleSearchDTO clientRoleSearchDTO, Long sourceId, String param) {
        return pageQueryingClientsWithRoles(pageRequest, clientRoleSearchDTO, sourceId, param, ResourceLevel.ORGANIZATION.value());
    }

    @Override
    public Page<ClientDO> pagingQueryClientsWithSiteLevelRoles(PageRequest pageRequest, ClientRoleSearchDTO clientRoleSearchDTO, String param) {
        return pageQueryingClientsWithRoles(pageRequest, clientRoleSearchDTO, 0L, param, ResourceLevel.SITE.value());
    }

    @Override
    public Page<ClientDO> pagingQueryClientsWithProjectLevelRoles(PageRequest pageRequest, ClientRoleSearchDTO clientRoleSearchDTO, Long sourceId, String param) {
        return pageQueryingClientsWithRoles(pageRequest, clientRoleSearchDTO, sourceId, param, ResourceLevel.PROJECT.value());
    }

    private Page<ClientDO> pageQueryingClientsWithRoles(PageRequest pageRequest, ClientRoleSearchDTO clientRoleSearchDTO, Long sourceId, String param, String sourceType) {
        //TODO
        //这里的分页是写死的只支持mysql分页，暂时先实现功能，后续做优化，使用PageHelper进行分页
        int page = pageRequest.getPage();
        int size = pageRequest.getSize();
        int start = page * size;
        PageInfo pageInfo = new PageInfo(page, size);
        int count = memberRoleMapper.selectCountClients(sourceId, sourceType, clientRoleSearchDTO, param);
        List<ClientDO> clientDOS = memberRoleMapper.selectClientsWithRoles(sourceId, sourceType, clientRoleSearchDTO, param, start, size);
        //没有order by
        //TODO
        //筛选非空角色以及角色内部按id排序
        return new Page<>(clientDOS, pageInfo, count);
    }
}
