package io.choerodon.iam.app.service;

import io.choerodon.iam.api.dto.SystemSettingDTO;
import org.springframework.web.multipart.MultipartFile;

/**
 * 对系统设置进行增删改查
 *
 * @author zmf
 * @since 2018-10-15
 */
public interface SystemSettingService {
    /**
     * 上传平台徽标(支持裁剪，旋转，并保存)
     *
     * @param file 徽标图片
     * @return 图片的地址
     */
    String uploadFavicon(MultipartFile file, Double rotate, Integer axisX, Integer axisY, Integer width, Integer height);

    /**
     * 上传平台导航栏图形标(支持裁剪，旋转，并保存)
     *
     * @param file 图片
     * @return 图片的地址
     */
    String uploadSystemLogo(MultipartFile file, Double rotate, Integer axisX, Integer axisY, Integer width, Integer height);

    /**
     * 增加系统设置
     *
     * @param systemSettingDTO 系统设置数据
     * @return 返回增加的系统设置
     */
    SystemSettingDTO addSetting(SystemSettingDTO systemSettingDTO);


    /**
     * 更新系统设置
     *
     * @param systemSettingDTO 系统设置数据
     * @return 返回改变后的系统设置
     */
    SystemSettingDTO updateSetting(SystemSettingDTO systemSettingDTO);

    /**
     * 重置系统设置
     */
    void resetSetting();

    /**
     * 获取系统设置
     *
     * @return ，如果存在返回数据，否则返回 null
     */
    SystemSettingDTO getSetting();
}
