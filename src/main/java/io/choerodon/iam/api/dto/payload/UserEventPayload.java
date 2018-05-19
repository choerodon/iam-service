package io.choerodon.iam.api.dto.payload;

/**
 * @author flyleft
 * @date 2018/4/9
 */
public class UserEventPayload {

    public static final String EVENT_TYPE_CREATE_USER = "createUser";

    public static final String EVENT_TYPE_UPDATE_USER = "updateUser";

    public static final String EVENT_TYPE_DELETE_USER = "deleteUser";

    public static final String EVENT_TYPE_ENABLE_USER = "enableUser";

    public static final String EVENT_TYPE_DISABLE_USER = "disableUser";

    private String id;

    private String name;

    private String username;

    private String email;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

}
