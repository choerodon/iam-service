package io.choerodon.iam.domain.iam.factory;

import java.util.Date;

import io.choerodon.iam.domain.iam.entity.UserE;

/**
 * @author superlee
 * @data 2018/3/29
 */
public class UserEFactory {

    public static UserE createUserE(Long id, String loginName, String email, Long organizationId,
                                    String password, String realName,
                                    String phone, String imageUrl, String profilePhoto,
                                    String language, String timeZone, Date lastPasswordUpdatedAt,
                                    Date lastLoginAt, Boolean isEnabled, Boolean isLocked,
                                    Boolean isLdap, Date lockedUntilAt, Integer passwordAttempt,
                                    Long objectVersionNumber) {
        return new UserE(id, loginName, email, organizationId, password, realName,
                phone, imageUrl, profilePhoto, language, timeZone,
                lastPasswordUpdatedAt, lastLoginAt, isEnabled, isLocked,
                isLdap, lockedUntilAt, passwordAttempt, objectVersionNumber);
    }
}
