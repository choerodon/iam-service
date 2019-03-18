package io.choerodon.iam.infra.common.utils;

public final class SagaTopic {

    private SagaTopic() {
    }

    public static class User {
        private User() {
        }

        //创建用户
        public static final String USER_CREATE = "iam-create-user";
        //iam接收创建组织事件的SagaTaskCode
        public static final String TASK_USER_CREATE = "task-create-user";
        //批量创建用户
        public static final String USER_CREATE_BATCH = "iam-create-user";
        //更新用户
        public static final String USER_UPDATE = "iam-update-user";
        //删除用户
        public static final String USER_DELETE = "iam-delete-user";
        //启用用户
        public static final String USER_ENABLE = "iam-enable-user";
        //停用用户
        public static final String USER_DISABLE = "iam-disable-user";
    }

    public static class Project {
        private Project() {
        }

        //创建项目
        public static final String PROJECT_CREATE = "iam-create-project";
        //更新项目
        public static final String PROJECT_UPDATE = "iam-update-project";
        //停用项目
        public static final String PROJECT_DISABLE = "iam-disable-project";
        //启用项目
        public static final String PROJECT_ENABLE = "iam-enable-project";

    }

    public static class MemberRole {
        private MemberRole() {
        }

        //更新用户角色
        public static final String MEMBER_ROLE_UPDATE = "iam-update-memberRole";

        //删除用户角色
        public static final String MEMBER_ROLE_DELETE = "iam-delete-memberRole";
    }

    public static class Organization {
        private Organization() {
        }

        //组织服务创建组织
        public static final String ORG_CREATE = "org-create-organization";

        //组织服务注册组织
        public static final String ORG_REGISTER = "register-org";

        //iam接收创建组织事件的SagaTaskCode
        public static final String TASK_ORG_CREATE = "iam-create-organization";

        //iam接受注册组织:创建默认密码策略，创建默认ldap配置
        public static final String TASK_ORG_REGISTER_INIT_ORG = "register-iam-init-org";

        //iam接受注册组织:创建项目
        public static final String TASK_ORG_REGISTER_INIT_PROJ = "register-iam-init-project";

        //启用组织
        public static final String ORG_ENABLE = "iam-enable-organization";

        //停用组织
        public static final String ORG_DISABLE = "iam-disable-organization";

        //更新组织
        public static final String ORG_UPDATE = "iam-update-organization";

    }

    public static class SystemSetting {
        private SystemSetting() {
        }

        // iam 系统设置发生改变时（增加，更新，重置），触发 Saga 流程时的 code
        public static final String SYSTEM_SETTING_UPDATE = "iam-update-system-setting";
    }

    public static class Application {
        private Application() {
        }

        public static final String APP_CREATE = "iam-create-application";
        public static final String APP_UPDATE = "iam-update-application";
        public static final String APP_DISABLE = "iam-disable-application";
        public static final String APP_ENABLE = "iam-enable-application";
    }

    public static class ProjectRelationship {
        private ProjectRelationship() {
        }

        // iam新增项目关系
        public static final String PROJECT_RELATIONSHIP_ADD = "iam-add-project-relationships";
    }
}
