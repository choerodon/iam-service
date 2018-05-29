package io.choerodon.iam.app.service;

import io.choerodon.iam.api.dto.LabelDTO;

import java.util.List;

/**
 * @author superlee
 */
public interface LabelService {
    List<LabelDTO> listByType(String type);
}
