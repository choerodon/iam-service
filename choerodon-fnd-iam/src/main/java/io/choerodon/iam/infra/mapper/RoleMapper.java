//package io.choerodon.iam.infra.mapper;
//
//import io.choerodon.iam.api.controller.query.RoleQuery;
//import io.choerodon.iam.infra.dto.RoleDTO;
//import org.apache.ibatis.annotations.Param;
//import tk.mybatis.mapper.common.Mapper;
//
//import java.util.List;
//
///**
// * @author superlee
// * @since 2019-04-15
// */
//public interface RoleMapper extends Mapper<RoleDTO> {
//
//    /**
//     * 模糊查询，like
//     *
//     * @param roleQuery
//     * @return
//     */
//    List<RoleDTO> fuzzyQuery(@Param("roleQuery") RoleQuery roleQuery);
//}
