package io.choerodon.iam.app.service.impl;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.iam.api.dto.LabelDTO;
import io.choerodon.iam.app.service.LabelService;
import io.choerodon.iam.domain.repository.LabelRepository;
import io.choerodon.iam.infra.dataobject.LabelDO;
import org.springframework.stereotype.Component;

import java.util.List;

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
    public List<LabelDTO> listByOption(LabelDTO label) {
        return ConvertHelper.convertList(
                labelRepository.listByOption(
                        ConvertHelper.convert(label, LabelDO.class)), LabelDTO.class);
    }
}
