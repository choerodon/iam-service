package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dataobject.MemberRoleDO;
import io.choerodon.mybatis.common.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author carllhw
 */
public interface MemberRoleMapper extends BaseMapper<MemberRoleDO> {


    List<Long> selectDeleteList(@Param("mi") long memberId, @Param("si") long sourceId,
                                @Param("st") String sourceType, @Param("list") List<Long> deleteList);

}
