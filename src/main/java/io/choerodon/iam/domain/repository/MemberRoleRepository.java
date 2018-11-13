package io.choerodon.iam.domain.repository;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.ClientRoleSearchDTO;
import io.choerodon.iam.domain.iam.entity.MemberRoleE;
import io.choerodon.iam.infra.dataobject.ClientDO;
import io.choerodon.iam.infra.dataobject.MemberRoleDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

import java.util.List;
import java.util.Set;

/**
 * @author superlee
 * @data 2018/3/29
 */
public interface MemberRoleRepository {

    MemberRoleE insertSelective(MemberRoleE memberRoleE);

    List<MemberRoleE> select(MemberRoleE memberRoleE);

    void deleteById(Long id);

    /**
     * 只用于保持member和role之间关系修改的时间，当删除某个member的role时调用，会将操作时间
     * 更新到剩余的member-role关系中的一个的last_update_date上
     * @param memberId memberId
     * @param memberType member类型，(user, client)
     * @param sourceId sourceId
     * @param sourceType sourceType
     */
    void updateMemberRoleDatetime(Long memberId, String memberType, Long sourceId, String sourceType);

    /**
     * 只用于保持member和role之间关系修改的时间，当删除某个member的role时调用，会将操作时间
     * 更新到剩余的member-role关系中的一个的last_update_date上
     * @param memberIds 多个 member id
     * @param memberType member类型，(user, client)
     * @param sourceId sourceId
     * @param sourceType sourceType
     */
    void updateMemberRoleDatetime(Set<Long> memberIds, String memberType, Long sourceId, String sourceType);

    MemberRoleE selectByPrimaryKey(Long id);

    MemberRoleDO selectOne(MemberRoleDO memberRole);

    List<Long> selectDeleteList(final List<Long> deleteList, final long memberId, final String memberType, final long sourceId, final String sourceType);

    Page<ClientDO> pagingQueryClientsWithOrganizationLevelRoles(
            PageRequest pageRequest, ClientRoleSearchDTO clientRoleSearchDTO, Long sourceId, String param);

    Page<ClientDO> pagingQueryClientsWithSiteLevelRoles(
            PageRequest pageRequest, ClientRoleSearchDTO clientRoleSearchDTO, String param);

    Page<ClientDO> pagingQueryClientsWithProjectLevelRoles(
            PageRequest pageRequest, ClientRoleSearchDTO clientRoleSearchDTO, Long sourceId, String param);
}
