package io.choerodon.iam.api.dto;

import io.choerodon.core.exception.CommonException;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.Pattern;

/**
 * @author superlee
 * @data 2018/4/13
 */
public class UserInfoDTO {

    private Long id;
    private Long organizationId;
    private String loginName;
    @Pattern(regexp = UserDTO.EMAIL_REGULAR_EXPRESSION, message = "error.user.email.illegal")
    @NotEmpty(message = "error.user.email.empty")
    private String email;
    private String realName;
    @Pattern(regexp = UserDTO.PHONE_REGULAR_EXPRESSION, message = "error.phone.illegal")
    private String phone;
    private String imageUrl;
    private String language;
    private String timeZone;
    private Boolean enabled;
    private Long objectVersionNumber;
    private Boolean admin;

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getTimeZone() {
        return timeZone;
    }

    public void setTimeZone(String timeZone) {
        this.timeZone = timeZone;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public void updateCheck() {
        if (this.id == null) {
            throw new CommonException("error.userInfo.id.null");
        }
        if (this.objectVersionNumber == null) {
            throw new CommonException("error.userInfo.objectVersionNumber.null");
        }
    }

    public Boolean getAdmin() {
        return admin;
    }

    public void setAdmin(Boolean admin) {
        this.admin = admin;
    }
}
