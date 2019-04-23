package io.choerodon.iam.infra.repository.impl;

import java.util.List;

import com.github.pagehelper.Page;
import io.choerodon.iam.infra.dto.ClientDTO;
import io.choerodon.iam.infra.dto.MemberRoleDTO;
import org.springframework.stereotype.Component;

import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.ClientRoleSearchDTO;
import io.choerodon.iam.domain.repository.MemberRoleRepository;
import io.choerodon.iam.infra.mapper.MemberRoleMapper;
import io.choerodon.iam.infra.mapper.OrganizationMapper;
import io.choerodon.iam.infra.mapper.ProjectMapper;
import io.choerodon.iam.infra.mapper.RoleMapper;

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
    public MemberRoleDTO insertSelective(MemberRoleDTO memberRoleDTO) {
        if (memberRoleDTO.getMemberType() == null) {
            memberRoleDTO.setMemberType("user");
        }
        if (roleMapper.selectByPrimaryKey(memberRoleDTO.getRoleId()) == null) {
            throw new CommonException("error.member_role.insert.role.not.exist");
        }
        if (ResourceLevel.PROJECT.value().equals(memberRoleDTO.getSourceType())
                && projectMapper.selectByPrimaryKey(memberRoleDTO.getSourceId()) == null) {
            throw new CommonException("error.member_role.insert.project.not.exist");
        }
        if (ResourceLevel.ORGANIZATION.value().equals(memberRoleDTO.getSourceType())
                && organizationMapper.selectByPrimaryKey(memberRoleDTO.getSourceId()) == null) {
            throw new CommonException("error.member_role.insert.organization.not.exist");
        }
        if (memberRoleMapper.selectOne(memberRoleDTO) != null) {
            throw new CommonException("error.member_role.has.existed");
        }
        if (memberRoleMapper.insertSelective(memberRoleDTO) != 1) {
            throw new CommonException("error.member_role.create");
        }
        return memberRoleMapper.selectByPrimaryKey(memberRoleDTO.getId());
    }

    @Override
    public List<MemberRoleDTO> select(MemberRoleDTO memberRoleDTO) {
        return memberRoleMapper.select(memberRoleDTO);
    }

    @Override
    public void deleteById(Long id) {
        memberRoleMapper.deleteByPrimaryKey(id);
    }

    @Override
    public MemberRoleDTO selectByPrimaryKey(Long id) {
        return memberRoleMapper.selectByPrimaryKey(id);
    }

    @Override
    public MemberRoleDTO selectOne(MemberRoleDTO memberRole) {
        return memberRoleMapper.selectOne(memberRole);
    }

    @Override
    public void insert(MemberRoleDTO memberRole) {
        if (memberRoleMapper.insertSelective(memberRole) != 1) {
            throw new CommonException("error.memberRole.insert.failed");
        }
    }

    @Override
    public List<Long> selectDeleteList(final List<Long> deleteList, final long memberId, final String memberType, final long sourceId, final String sourceType) {
        return memberRoleMapper.selectDeleteList(memberId, sourceId, memberType, sourceType, deleteList);
    }

    @Override
    public Page<ClientDTO> pagingQueryClientsWithOrganizationLevelRoles(
            int page, int size, ClientRoleSearchDTO clientRoleSearchDTO, Long sourceId, String param) {
        return pageQueryingClientsWithRoles(page,size, clientRoleSearchDTO, sourceId, param, ResourceLevel.ORGANIZATION.value());
    }

    @Override
    public Page<ClientDTO> pagingQueryClientsWithSiteLevelRoles(int page, int size, ClientRoleSearchDTO clientRoleSearchDTO, String param) {
        return pageQueryingClientsWithRoles(page,size, clientRoleSearchDTO, 0L, param, ResourceLevel.SITE.value());
    }

    @Override
    public Page<ClientDTO> pagingQueryClientsWithProjectLevelRoles(int page, int size, ClientRoleSearchDTO clientRoleSearchDTO, Long sourceId, String param) {
        return pageQueryingClientsWithRoles(page,size, clientRoleSearchDTO, sourceId, param, ResourceLevel.PROJECT.value());
    }

    private Page<ClientDTO> pageQueryingClientsWithRoles(int page, int size, ClientRoleSearchDTO clientRoleSearchDTO, Long sourceId, String param, String sourceType) {
        //这里的分页是写死的只支持mysql分页，暂时先实现功能，后续做优化，使用PageHelper进行分页
//        int page = pageRequest.getPage();
//        int size = pageRequest.getSize();
        int start = page * size;
        Page<ClientDTO> result = new Page<>(page,size,true);
//        PageInfo pageInfo = new PageInfo(page, size);
        int count = memberRoleMapper.selectCountClients(sourceId, sourceType, clientRoleSearchDTO, param);
        result.setTotal(count);
        result.addAll(memberRoleMapper.selectClientsWithRoles(sourceId, sourceType, clientRoleSearchDTO, param, start, size)) ;
        //筛选非空角色以及角色内部按id排序
        return result;
    }
}
