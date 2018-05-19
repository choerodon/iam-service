package io.choerodon.iam.app.service.impl;

import java.util.List;

import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.iam.api.dto.LabelDTO;
import io.choerodon.iam.app.service.LabelService;
import io.choerodon.iam.domain.repository.LabelRepository;

/**
 * @author superlee
 */
@Component
public class LabelServiceImpl implements LabelService {

    private LabelRepository labelRepository;

    public LabelServiceImpl(LabelRepository labelRepository) {
        this.labelRepository = labelRepository;
    }

    @Override
    public List<LabelDTO> listByType(String type) {
        return ConvertHelper.convertList(labelRepository.listByType(type), LabelDTO.class);
    }
}
