package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dto.MenuPermissionDTO;
import io.choerodon.mybatis.common.Mapper;

/**
 * @author wuguokai
 */
public interface MenuPermissionMapper extends Mapper<MenuPermissionDTO> {

    /**
     * 删除menu_id在menu表中已经不存在的在那个数据
     */
    void deleteDirtyData();
}
