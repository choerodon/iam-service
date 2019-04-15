//package io.choerodon.iam.app.service.impl;
//
//
//import io.choerodon.core.exception.CommonException;
//import io.choerodon.core.oauth.CustomUserDetails;
//import io.choerodon.core.oauth.DetailsHelper;
//import io.choerodon.iam.app.service.UserService;
//import io.choerodon.iam.infra.dto.UserDTO;
//import io.choerodon.iam.infra.utils.MenuAssertHelper;
//import io.choerodon.mybatis.service.BaseServiceImpl;
//import org.springframework.stereotype.Service;
//
//@Service
//public class UserServiceImpl extends BaseServiceImpl<UserDTO> implements UserService {
//
//    private MenuAssertHelper assertHelper;
//
//    public UserServiceImpl(MenuAssertHelper assertHelper) {
//        this.assertHelper = assertHelper;
//    }
//
//    @Override
//    public UserDTO querySelf() {
//        CustomUserDetails details = DetailsHelper.getUserDetails();
//        if (details == null) {
//            throw new CommonException("error.user.not.login");
//        }
//        Long userId = details.getUserId();
//        UserDTO dto = assertHelper.userNotExisted(userId);
//
//
//        return null;
//    }
//}
