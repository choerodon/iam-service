package io.choerodon.iam.app.service;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.IconDTO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author superlee
 */
public interface IconService {

    IconDTO create(IconDTO iconDTO);

    void deleteById(Long id);

    Page<IconDTO> pagingQuery(PageRequest pageRequest, String code);
}
