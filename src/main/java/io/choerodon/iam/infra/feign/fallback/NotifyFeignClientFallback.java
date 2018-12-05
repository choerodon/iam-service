package io.choerodon.iam.infra.feign.fallback;

import io.choerodon.core.notify.NoticeSendDTO;
import io.choerodon.iam.api.dto.SystemAnnouncementDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.feign.NotifyFeignClient;


@Component
public class NotifyFeignClientFallback implements NotifyFeignClient {

    private static final String FEIGN_ERROR = "notify.error";

    @Override
    public void postNotice(NoticeSendDTO dto) {
        throw new CommonException(FEIGN_ERROR);
    }

    @Override
    public ResponseEntity<SystemAnnouncementDTO> create(SystemAnnouncementDTO dto) {
        throw new CommonException(FEIGN_ERROR);
    }
}
