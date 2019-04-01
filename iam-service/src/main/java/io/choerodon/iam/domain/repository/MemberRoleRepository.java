package io.choerodon.iam.domain.repository;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.ClientRoleSearchDTO;
import io.choerodon.iam.domain.iam.entity.MemberRoleE;
import io.choerodon.iam.infra.dataobject.ClientDO;
import io.choerodon.iam.infra.dataobject.MemberRoleDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

import java.util.List;

/**
 * @author superlee
 * @data 2018/3/29
 */
public interface MemberRoleRepository {

    MemberRoleE insertSelective(MemberRoleE memberRoleE);

    List<MemberRoleE> select(MemberRoleE memberRoleE);

    void deleteById(Long id);

    MemberRoleE selectByPrimaryKey(Long id);

    void insert(MemberRoleDO memberRole);

    MemberRoleDO selectOne(MemberRoleDO memberRole);

    List<Long> selectDeleteList(final List<Long> deleteList, final long memberId, final String memberType, final long sourceId, final String sourceType);

    Page<ClientDO> pagingQueryClientsWithOrganizationLevelRoles(
            PageRequest pageRequest, ClientRoleSearchDTO clientRoleSearchDTO, Long sourceId, String param);

    Page<ClientDO> pagingQueryClientsWithSiteLevelRoles(
            PageRequest pageRequest, ClientRoleSearchDTO clientRoleSearchDTO, String param);

    Page<ClientDO> pagingQueryClientsWithProjectLevelRoles(
            PageRequest pageRequest, ClientRoleSearchDTO clientRoleSearchDTO, Long sourceId, String param);
}
