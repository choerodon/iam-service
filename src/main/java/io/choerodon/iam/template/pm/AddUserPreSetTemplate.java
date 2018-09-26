package io.choerodon.iam.template.pm;

import io.choerodon.swagger.notify.PmTemplate;
import org.springframework.stereotype.Component;

/**
 * @author dengyouquan
 **/
@Component
public class AddUserPreSetTemplate implements PmTemplate {
    @Override
    public String businessTypeCode() {
        return "addUser";
    }

    @Override
    public String code() {
        return "addUser-preset";
    }

    @Override
    public String name() {
        return "添加新用户";
    }

    @Override
    public String title() {
        return "添加新用户";
    }

    @Override
    public String content() {
        return "classpath://templates/addUserPreset.html";
    }
}
