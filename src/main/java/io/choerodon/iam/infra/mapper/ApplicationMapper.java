package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.api.dto.ApplicationSearchDTO;
import io.choerodon.iam.infra.dataobject.ApplicationDO;
import io.choerodon.mybatis.common.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Set;

/**
 * @author superlee
 * @since 0.15.0
 */
public interface ApplicationMapper extends BaseMapper<ApplicationDO> {
    /**
     * 模糊查询
     *
     * @param applicationSearchDTO
     * @return
     */
    List fuzzyQuery(@Param("applicationSearchDTO")ApplicationSearchDTO applicationSearchDTO);

    /**
     * 传入application id集合，返回application 对象集合
     *
     * @param idSet
     * @return
     */
    List matchId(@Param("idSet") Set<Long> idSet);
}
