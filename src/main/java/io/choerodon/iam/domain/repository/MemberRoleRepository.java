package io.choerodon.iam.domain.repository;

import com.github.pagehelper.PageInfo;
import io.choerodon.iam.api.dto.ClientRoleSearchDTO;
import io.choerodon.iam.infra.dto.ClientDTO;
import io.choerodon.iam.infra.dto.MemberRoleDTO;

import java.util.List;

/**
 * @author superlee
 * @data 2018/3/29
 */
public interface MemberRoleRepository {

    MemberRoleDTO insertSelective(MemberRoleDTO memberRoleDTO);

    List<MemberRoleDTO> select(MemberRoleDTO memberRoleDTO);

    void deleteById(Long id);

    MemberRoleDTO selectByPrimaryKey(Long id);

    void insert(MemberRoleDTO memberRole);

    MemberRoleDTO selectOne(MemberRoleDTO memberRole);

    List<Long> selectDeleteList(final List<Long> deleteList, final long memberId, final String memberType, final long sourceId, final String sourceType);

    PageInfo<ClientDTO> pagingQueryClientsWithOrganizationLevelRoles(
            int page, int size, ClientRoleSearchDTO clientRoleSearchDTO, Long sourceId, String param);

    PageInfo<ClientDTO> pagingQueryClientsWithSiteLevelRoles(
            int page,int size, ClientRoleSearchDTO clientRoleSearchDTO, String param);

    PageInfo<ClientDTO> pagingQueryClientsWithProjectLevelRoles(
            int page, int size, ClientRoleSearchDTO clientRoleSearchDTO, Long sourceId, String param);
}
