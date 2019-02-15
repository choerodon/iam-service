package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.api.dto.LdapErrorUserDTO;
import io.choerodon.iam.infra.dataobject.LdapErrorUserDO;
import io.choerodon.mybatis.common.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author superlee
 */
public interface LdapErrorUserMapper extends BaseMapper<LdapErrorUserDO> {
    /**
     * ldap error user 详情模糊查询
     * @param ldapHistoryId
     * @param ldapErrorUserDTO
     * @return
     */
    List fuzzyQuery(@Param("ldapHistoryId") Long ldapHistoryId,
                    @Param("ldapErrorUserDTO") LdapErrorUserDTO ldapErrorUserDTO);
}
