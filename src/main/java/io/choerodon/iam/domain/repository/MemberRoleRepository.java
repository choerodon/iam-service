package io.choerodon.iam.domain.repository;

import java.util.List;

import io.choerodon.iam.domain.iam.entity.MemberRoleE;

/**
 * @author superlee
 * @data 2018/3/29
 */
public interface MemberRoleRepository {
    MemberRoleE insertSelective(MemberRoleE memberRoleE);

    List<MemberRoleE> select(MemberRoleE memberRoleE);

    void deleteById(Long id);

    MemberRoleE selectByPrimaryKey(Long id);

    MemberRoleE selectOne(MemberRoleE memberRole);
}
