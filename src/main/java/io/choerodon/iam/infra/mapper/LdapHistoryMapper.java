package io.choerodon.iam.infra.mapper;

import java.util.List;

import io.choerodon.iam.infra.dto.LdapHistoryDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;


/**
 * @author superlee
 */
public interface LdapHistoryMapper extends Mapper<LdapHistoryDTO> {
    /**
     * 查询ldap下所有完成的记录
     * @param ldapId
     * @return
     */
    List<LdapHistoryDTO> selectAllEnd(@Param("ldapId")Long ldapId);
}
