package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dto.LdapErrorUserDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author superlee
 */
public interface LdapErrorUserMapper extends Mapper<LdapErrorUserDTO> {
    /**
     * ldap error user 详情模糊查询
     *
     * @param ldapHistoryId
     * @param ldapErrorUserDTO
     * @return
     */
    List<LdapErrorUserDTO> fuzzyQuery(@Param("ldapHistoryId") Long ldapHistoryId,
                                      @Param("ldapErrorUserDTO") LdapErrorUserDTO ldapErrorUserDTO);
}
