package io.choerodon.iam.app.service.impl;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.SystemSettingDTO;
import io.choerodon.iam.app.service.SystemSettingService;
import io.choerodon.iam.domain.repository.SystemSettingRepository;
import io.choerodon.iam.infra.common.utils.MockMultipartFile;
import io.choerodon.iam.infra.dataobject.SystemSettingDO;
import io.choerodon.iam.infra.feign.FileFeignClient;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

/**
 * @author zmf
 * @since 2018-10-15
 */
@Service
public class SystemSettingServiceImpl implements SystemSettingService {
    private final FileFeignClient fileFeignClient;
    private final SystemSettingRepository systemSettingRepository;

    @Autowired
    public SystemSettingServiceImpl(FileFeignClient fileFeignClient, SystemSettingRepository systemSettingRepository) {
        this.fileFeignClient = fileFeignClient;
        this.systemSettingRepository = systemSettingRepository;
    }

    @Override
    public String uploadFavicon(MultipartFile file) {
        return uploadFile(file);
    }

    @Override
    public String uploadSystemLogo(MultipartFile file) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Thumbnails.of(file.getInputStream()).forceSize(80, 80).toOutputStream(outputStream);
            file = new MockMultipartFile(file.getName(), file.getOriginalFilename(), file.getContentType(), outputStream.toByteArray());
            return uploadFile(file);
        } catch (Exception e) {
            throw new CommonException("error.setting.logo.save.failure");
        }
    }

    @Override
    public SystemSettingDTO addSetting(SystemSettingDTO systemSettingDTO) {
        return systemSettingRepository.addSetting(convert(systemSettingDTO));
    }

    @Override
    public SystemSettingDTO updateSetting(SystemSettingDTO systemSettingDTO) {
        return systemSettingRepository.updateSetting(convert(systemSettingDTO));
    }

    @Override
    public void resetSetting() {
        systemSettingRepository.resetSetting();
    }

    @Override
    public SystemSettingDTO getSetting() {
        return systemSettingRepository.getSetting();
    }

    private String uploadFile(MultipartFile file) {
        return fileFeignClient.uploadFile("iam-service", file.getOriginalFilename(), file).getBody();
    }

    private SystemSettingDO convert(SystemSettingDTO systemSettingDTO) {
        SystemSettingDO systemSettingDO = new SystemSettingDO();
        BeanUtils.copyProperties(systemSettingDTO, systemSettingDO);
        return systemSettingDO;
    }
}
