package io.choerodon.iam.domain.iam.entity;


import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.oauth.core.password.record.PasswordRecord;

/**
 * @author wuguokai
 * @author superlee
 */
public class OrganizationE {

    private Long id;

    private String name;

    private String code;

    private Long objectVersionNumber;

    private Boolean enabled;

    private UserRepository userRepository;

    private PasswordRecord passwordRecord;

    public OrganizationE(Long id, String name, String code,
                         Long objectVersionNumber,
                         UserRepository userRepository, Boolean enabled, PasswordRecord passwordRecord) {
        this.id = id;
        this.name = name;
        this.objectVersionNumber = objectVersionNumber;
        this.userRepository = userRepository;
        this.code = code;
        this.enabled = enabled;
        this.passwordRecord = passwordRecord;
    }

    public OrganizationE created() {
        return null;
    }

    public Boolean deleted() {
        return false;
    }

    public OrganizationE editInfo() {
        return null;
    }

    /***
     * 组织里添加用户
     * @return
     */
    public UserE addUser(UserE userE) {
        if (userRepository.selectByLoginName(userE.getLoginName()) != null) {
            throw new CommonException("error.entity.organization.user.exists");
        }
        //TODO
        //密码策略待添加
        //默认添加用户未锁定,启用
        userE.unlocked();
        userE.enable();
        userE.encodePassword();
        userE = userRepository.insertSelective(userE);
        passwordRecord.updatePassword(userE.getId(), userE.getPassword());
        return userE.hiddenPassword();
        //TODO
        //初始化角色
        //用户创建成功发事件
    }

    public UserE updateUser(UserE userE) {
        if (userE.getPassword() != null) {
            //TODO
            //检查密码策略，待添加
            userE.encodePassword();
        }
        return userRepository.updateSelective(userE).hiddenPassword();
    }

    public void removeUserById(Long id) {
        userRepository.deleteById(id);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }

    public String getCode() {
        return code;
    }

    public UserE queryById(Long id) {
        return userRepository.selectByPrimaryKey(id);
    }

    public UserE unlock(Long userId) {
        UserE userE = userRepository.selectByPrimaryKey(userId);
        if (userE == null) {
            throw new CommonException("error.user.not.exist");
        }
        if (!userE.getLocked()) {
            throw new CommonException("error.user.{" + userId + "}.isn't.locked");
        }
        userE.unlocked();
        userE = userRepository.updateSelective(userE).hiddenPassword();
        passwordRecord.unLockUser(userE.getId());
        return userE;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void enable() {
        this.enabled = true;
    }

    public void disable() {
        this.enabled = false;
    }
}
