package io.choerodon.iam.infra.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import io.choerodon.iam.infra.dataobject.PasswordHistoryDO;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author wuguokai
 */
public interface PasswordHistoryMapper extends BaseMapper<PasswordHistoryDO> {
    @Select("SELECT PASSWORD FROM oauth_password_history WHERE user_id = #{userId} ORDER BY creation_date desc LIMIT #{count}")
    List<String> selectPasswordByUser(@Param("userId") Long userId, @Param("count") Integer count);
}
