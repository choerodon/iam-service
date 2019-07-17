package io.choerodon.iam.app.service.impl;

import io.choerodon.iam.app.service.LabelService;
import io.choerodon.iam.infra.dto.LabelDTO;
import io.choerodon.iam.infra.mapper.LabelMapper;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author superlee
 */
@Service
public class LabelServiceImpl implements LabelService {

    private LabelMapper labelMapper;

    public LabelServiceImpl(LabelMapper labelMapper) {
        this.labelMapper = labelMapper;
    }

    @Override
    public List<LabelDTO> listByOption(LabelDTO label) {
        return labelMapper.listByOption(label);
    }
}
