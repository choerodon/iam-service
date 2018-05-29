package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dataobject.PasswordPolicyDO;
import io.choerodon.mybatis.common.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

/**
 * @author wuguokai
 */
public interface PasswordPolicyMapper extends BaseMapper<PasswordPolicyDO> {
    @Select("select * from oauth_password_policy where organization_id = #{orgId} limit 1")
    PasswordPolicyDO queryByOrgId(@Param("orgId") Long orgId);
}
