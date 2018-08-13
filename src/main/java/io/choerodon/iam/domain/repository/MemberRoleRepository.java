package io.choerodon.iam.domain.repository;

import io.choerodon.iam.domain.iam.entity.MemberRoleE;
import io.choerodon.iam.infra.dataobject.MemberRoleDO;

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

    MemberRoleDO selectOne(MemberRoleDO memberRole);

    List<Long> selectDeleteList(List<Long> deleteList, long memberId,
                                long sourceId, String sourceType);
}
