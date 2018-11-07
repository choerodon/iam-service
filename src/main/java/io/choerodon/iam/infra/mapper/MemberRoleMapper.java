package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.api.dto.ClientRoleSearchDTO;
import io.choerodon.iam.infra.dataobject.ClientDO;
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

    int deleteMemberRoleByMemberIdAndMemberType(@Param("memberId") Long memberId,
                                                @Param("memberType") String memberType);

    int selectCountBySourceId(@Param("id") Long id, @Param("type") String type);

    int selectCountClients(@Param("sourceId") Long sourceId,
                           @Param("sourceType") String sourceType,
                           @Param("clientRoleSearchDTO") ClientRoleSearchDTO clientRoleSearchDTO,
                           @Param("param") String param);

    List<ClientDO> selectClientsWithRoles(
            @Param("sourceId") Long sourceId,
            @Param("sourceType") String sourceType,
            @Param("clientRoleSearchDTO") ClientRoleSearchDTO clientRoleSearchDTO,
            @Param("param") String param,
            @Param("start") Integer start,
            @Param("size") Integer size);
}
