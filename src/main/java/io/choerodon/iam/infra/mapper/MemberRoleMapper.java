package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.api.dto.ClientRoleSearchDTO;
import io.choerodon.iam.infra.dto.ClientDTO;
import io.choerodon.iam.infra.dto.MemberRoleDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author carllhw
 */
public interface MemberRoleMapper extends Mapper<MemberRoleDTO> {


    List<Long> selectDeleteList(@Param("memberId") long memberId, @Param("sourceId") long sourceId, @Param("memberType") String memberType, @Param("sourceType") String sourceType, @Param("list") List<Long> deleteList);

    int deleteMemberRoleByMemberIdAndMemberType(@Param("memberId") Long memberId,
                                                @Param("memberType") String memberType);

    int selectCountBySourceId(@Param("id") Long id, @Param("type") String type);

    int selectCountClients(@Param("sourceId") Long sourceId,
                           @Param("sourceType") String sourceType,
                           @Param("clientRoleSearchDTO") ClientRoleSearchDTO clientRoleSearchDTO,
                           @Param("param") String param);

    List<ClientDTO> selectClientsWithRoles(
            @Param("sourceId") Long sourceId,
            @Param("sourceType") String sourceType,
            @Param("clientRoleSearchDTO") ClientRoleSearchDTO clientRoleSearchDTO,
            @Param("param") String param,
            @Param("start") Integer start,
            @Param("size") Integer size);
}
