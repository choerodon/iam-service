package io.choerodon.iam.app.service;


import io.choerodon.iam.infra.dto.LabelDTO;

import java.util.List;

/**
 * @author superlee
 */
public interface LabelService {
    List<LabelDTO> listByOption(LabelDTO label);
}
