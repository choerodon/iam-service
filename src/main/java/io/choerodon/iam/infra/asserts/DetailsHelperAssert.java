package io.choerodon.iam.infra.asserts;

import io.choerodon.core.exception.CommonException;
import io.choerodon.core.oauth.CustomClientDetails;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.core.oauth.DetailsHelper;

/**
 * @author superlee
 * @since 2019-04-15
 */
public class DetailsHelperAssert {

    public static CustomUserDetails userDetailNotExisted() {
        return userDetailNotExisted("error.user.not.login");
    }

    public static CustomUserDetails userDetailNotExisted(String message) {
        CustomUserDetails userDetails = DetailsHelper.getUserDetails();
        if (userDetails == null) {
            throw new CommonException(message);
        }
        return userDetails;
    }

    public static CustomClientDetails clientDetailNotExisted() {
        return clientDetailNotExisted("error.client.not.found");
    }

    public static CustomClientDetails clientDetailNotExisted(String message) {
        CustomClientDetails client = DetailsHelper.getClientDetails();
        if (client == null) {
            throw new CommonException(message);
        }
        return client;
    }

    public static void notCurrentUser(Long userId) {
        CustomUserDetails userDetails = userDetailNotExisted();
        if (!userDetails.getUserId().equals(userId)) {
            throw new CommonException("error.bookMark.notCurrentUser");
        }
    }
}
