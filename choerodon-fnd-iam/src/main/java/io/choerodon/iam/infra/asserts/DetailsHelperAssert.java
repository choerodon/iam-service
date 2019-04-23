//package io.choerodon.iam.infra.asserts;
//
//import io.choerodon.core.exception.CommonException;
//import io.choerodon.core.oauth.CustomClientDetails;
//import io.choerodon.core.oauth.CustomUserDetails;
//import io.choerodon.core.oauth.DetailsHelper;
//
///**
// * @author superlee
// * @since 2019-04-15
// */
//public class DetailsHelperAssert {
//
//    public static CustomUserDetails userDetailNotExisted() {
//        CustomUserDetails userDetails = DetailsHelper.getUserDetails();
//        if (userDetails == null) {
//            throw new CommonException("error.user.not.login");
//        }
//        return userDetails;
//    }
//
//    public static CustomClientDetails clientDetailNotExisted() {
//        CustomClientDetails client = DetailsHelper.getClientDetails();
//        if (client == null) {
//            throw new CommonException("error.client.not.found");
//        }
//        return client;
//    }
//}
