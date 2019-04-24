package io.choerodon.iam.infra.common.utils;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;

/**
 * @author dengyouquan
 **/
public class ImageUtils {
    private ImageUtils(){
        throw new IllegalStateException("cann`t instantiation class");
    }
    public static MultipartFile cutImage(MultipartFile file, Double rotate, Integer axisX, Integer axisY, Integer width, Integer height) throws java.io.IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        if (rotate != null) {
            Thumbnails.of(file.getInputStream()).scale(1.0, 1.0).rotate(rotate).toOutputStream(outputStream);
        }
        if (axisX != null && axisY != null && width != null && height != null) {
            if (outputStream.size() > 0) {
                final InputStream rotateInputStream = new ByteArrayInputStream(outputStream.toByteArray());
                outputStream.reset();
                Thumbnails.of(rotateInputStream).scale(1.0, 1.0).sourceRegion(axisX, axisY, width, height).toOutputStream(outputStream);
            } else {
                Thumbnails.of(file.getInputStream()).scale(1.0, 1.0).sourceRegion(axisX, axisY, width, height).toOutputStream(outputStream);
            }
        }
        if (outputStream.size() > 0) {
            file = new MockMultipartFile(file.getName(), file.getOriginalFilename(),
                    file.getContentType(), outputStream.toByteArray());
        }
        return file;
    }
}
