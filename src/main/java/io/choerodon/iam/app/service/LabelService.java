package io.choerodon.iam.app.service;

import java.util.List;

import io.choerodon.iam.api.dto.LabelDTO;

/**
 * @author superlee
 */
public interface LabelService {
    List<LabelDTO> listByType(String type);
}
