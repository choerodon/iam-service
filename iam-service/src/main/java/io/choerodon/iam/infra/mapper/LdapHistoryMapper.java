package io.choerodon.iam.infra.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.infra.dataobject.LdapHistoryDO;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author superlee
 */
public interface LdapHistoryMapper extends BaseMapper<LdapHistoryDO>{
    /**
     * 查询ldap下所有完成的记录
     * @param ldapId
     * @return
     */
    List<LdapHistoryDO> selectAllEnd(@Param("ldapId")Long ldapId);
}
