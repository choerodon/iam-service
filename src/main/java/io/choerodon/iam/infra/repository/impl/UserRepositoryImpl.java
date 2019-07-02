package io.choerodon.iam.infra.repository.impl;

import java.text.SimpleDateFormat;
import java.util.*;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.iam.api.dto.*;
import io.choerodon.iam.infra.common.utils.PageUtils;
import io.choerodon.iam.infra.dto.UserDTO;
import io.choerodon.iam.infra.mapper.ProjectMapper;
import org.springframework.stereotype.Component;

import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.infra.common.utils.ParamUtils;
import io.choerodon.iam.infra.mapper.UserMapper;

/**
 * @author superlee
 * @data 2018/3/26
 */
@Component
public class UserRepositoryImpl implements UserRepository {

    public static final String ERROR_USER_UPDATE = "error.user.update";
    private UserMapper mapper;
    private ProjectMapper projectMapper;

    public UserRepositoryImpl(UserMapper mapper, ProjectMapper projectMapper) {
        this.mapper = mapper;
        this.projectMapper = projectMapper;
    }

    @Override
    public UserDTO selectByLoginName(String loginName) {
        UserDTO userDTO = new UserDTO();
        userDTO.setLoginName(loginName);
        return mapper.selectOne(userDTO);
    }

    @Override
    public UserDTO insertSelective(UserDTO user) {
        if (mapper.insertSelective(user) != 1) {
            throw new CommonException("error.user.create");
        }
        return mapper.selectByPrimaryKey(user.getId());
    }

    @Override
    public PageInfo<UserDTO> pagingQuery(int page, int size, UserSearchDTO userSearchDTO, String param) {
        return PageHelper.startPage(page, size).doSelectPageInfo(() -> mapper.fulltextSearch(userSearchDTO, param));
    }

    @Override
    public UserDTO selectByPrimaryKey(Long id) {
        return mapper.selectByPrimaryKey(id);
    }

    @Override
    public void updatePhoto(Long userId, String photoUrl) {
        UserDTO userDTO = mapper.selectByPrimaryKey(userId);
        userDTO.setImageUrl(photoUrl);
        if (mapper.updateByPrimaryKeySelective(userDTO) != 1) {
            throw new CommonException(ERROR_USER_UPDATE);
        }
    }

    @Override
    public UserDTO updateSelective(UserDTO userDTO) {
        if (userDTO.getObjectVersionNumber() == null) {
            throw new CommonException("error.user.objectVersionNumber.empty");
        }
        if (mapper.updateByPrimaryKeySelective(userDTO) != 1) {
            throw new CommonException(ERROR_USER_UPDATE);
        }
        return mapper.selectByPrimaryKey(userDTO.getId());
    }

    @Override
    public void deleteById(Long id) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(id);
        if (mapper.deleteByPrimaryKey(userDTO) != 1) {
            throw new CommonException(ERROR_USER_UPDATE);
        }
    }

    @Override
    public PageInfo<UserDTO> pagingQueryUsersWithSiteLevelRoles(int page, int size,
                                                                RoleAssignmentSearchDTO roleAssignmentSearchDTO) {
        int start = PageUtils.getBegin(page, size);
        int count = mapper.selectCountUsers(roleAssignmentSearchDTO, 0L, ResourceLevel.SITE.value(),
                ParamUtils.arrToStr(roleAssignmentSearchDTO.getParam()));
        List<UserDTO> userDOList =
                mapper.selectUserWithRolesByOption(
                        roleAssignmentSearchDTO, 0L, ResourceType.SITE.value(), start, size,
                        ParamUtils.arrToStr(roleAssignmentSearchDTO.getParam()));
        Page<UserDTO> result = new Page<>(page, size);
        result.addAll(userDOList);
        result.setTotal(count);
        //没有order by
        //筛选非空角色以及角色内部按id排序
        return result.toPageInfo();
    }

    @Override
    public PageInfo<UserDTO> pagingQueryUsersWithOrganizationLevelRoles(int page, int size,
                                                                        RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                                        Long sourceId) {
        int start = PageUtils.getBegin(page, size);
        Page<UserDTO> result = new Page<>(page, size);
        int count = mapper.selectCountUsers(roleAssignmentSearchDTO, sourceId, ResourceLevel.ORGANIZATION.value(),
                ParamUtils.arrToStr(roleAssignmentSearchDTO.getParam()));
        result.setTotal(count);
        List<UserDTO> userDOList =
                mapper.selectUserWithRolesByOption(
                        roleAssignmentSearchDTO, sourceId, ResourceLevel.ORGANIZATION.value(), start, size,
                        ParamUtils.arrToStr(roleAssignmentSearchDTO.getParam()));
        result.addAll(userDOList);
        //没有order by
        //筛选非空角色以及角色内部按id排序
        return result.toPageInfo();
    }

    @Override
    public PageInfo<UserDTO> pagingQueryUsersWithProjectLevelRoles(int page, int size,
                                                                   RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                                   Long sourceId, boolean doPage) {
        if (doPage) {
            int start = PageUtils.getBegin(page, size);
            Page<UserDTO> result = new Page<>(page, size);
            int count = mapper.selectCountUsers(roleAssignmentSearchDTO, sourceId, ResourceLevel.PROJECT.value(),
                    ParamUtils.arrToStr(roleAssignmentSearchDTO.getParam()));
            result.setTotal(count);
            List<UserDTO> userDOList =
                    mapper.selectUserWithRolesByOption(
                            roleAssignmentSearchDTO, sourceId, ResourceLevel.PROJECT.value(), start, size,
                            ParamUtils.arrToStr(roleAssignmentSearchDTO.getParam()));
            result.addAll(userDOList);
            return result.toPageInfo();
            //没有order by
            //筛选非空角色以及角色内部按id排序
        } else {
            List<UserDTO> users =
                    mapper.selectUserWithRolesByOption(roleAssignmentSearchDTO, sourceId, ResourceLevel.PROJECT.value(), null, null,
                            ParamUtils.arrToStr(roleAssignmentSearchDTO.getParam()));
            Page<UserDTO> result = new Page<>();
            result.addAll(users);
            return result.toPageInfo();
        }
    }

    @Override
    public UserDTO updateUserInfo(UserDTO userDTO) {
        if (mapper.updateByPrimaryKeySelective(userDTO) != 1) {
            throw new CommonException(ERROR_USER_UPDATE);
        }
        return mapper.selectByPrimaryKey(userDTO.getId());
    }

    @Override
    public UserDTO selectOne(UserDTO user) {
        return mapper.selectOne(user);
    }

    @Override
    public PageInfo<UserDTO> pagingQueryUsersByProjectId(Long projectId, Long userId, String email, int page, int size, String param) {
        return PageHelper.startPage(page, size).doSelectPageInfo(() -> mapper.selectUsersByLevelAndOptions(ResourceLevel.PROJECT.value(), projectId, userId, email, param));
    }

    @Override
    public PageInfo<UserDTO> pagingQueryUsersByOrganizationId(Long organizationId, Long userId, String email, int page, int size, String param) {
        return PageHelper.startPage(page, size).doSelectPageInfo(() -> mapper.selectUsersByLevelAndOptions(ResourceLevel.ORGANIZATION.value(), organizationId, userId, email, param));
    }

    @Override
    public PageInfo<UserDTO> pagingQueryUsersOnSiteLevel(Long userId, String email, int page, int size, String param) {
        return PageHelper.startPage(page, size).doSelectPageInfo(() -> mapper.selectUsersByLevelAndOptions(ResourceLevel.SITE.value(), 0L, userId, email, param));
    }

    @Override
    public Integer selectUserCountFromMemberRoleByOptions(Long roleId, String memberType, Long sourceId, String sourceType,
                                                          RoleAssignmentSearchDTO roleAssignmentSearchDTO, String param) {
        return mapper.selectUserCountFromMemberRoleByOptions(roleId,
                memberType, sourceId, sourceType, roleAssignmentSearchDTO, param);
    }

    @Override
    public List<UserDTO> listUsersByRoleIdOnSiteLevel(Long roleId) {
        return mapper.selectUsersFromMemberRoleByOptions(roleId, "user", 0L,
                ResourceLevel.SITE.value(), null, null);
    }

    @Override
    public List<UserDTO> listUsersByRoleIdOnOrganizationLevel(Long orgId, Long roleId) {
        return mapper.selectUsersFromMemberRoleByOptions(roleId, "user",
                orgId, ResourceLevel.ORGANIZATION.value(), null, null);
    }

    @Override
    public List<UserDTO> listUsersByRoleIdOnProjectLevel(Long proId, Long roleId) {
        return mapper.selectUsersFromMemberRoleByOptions(roleId, "user",
                proId, ResourceLevel.PROJECT.value(), null, null);
    }

    @Override
    public PageInfo<UserDTO> pagingQueryUsersByRoleIdAndLevel(int page, int size, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId, Long sourceId, String level, boolean doPage) {
        String param = Optional.ofNullable(roleAssignmentSearchDTO).map(dto -> ParamUtils.arrToStr(dto.getParam())).orElse(null);
        if (!doPage) {
            List<UserDTO> users =
                    mapper.selectUsersFromMemberRoleByOptions(roleId, "user", sourceId,
                            level, roleAssignmentSearchDTO, param);
            Page<UserDTO> result = new Page<>();
            result.addAll(users);
            return result.toPageInfo();
        }
        return PageHelper.startPage(page, size).doSelectPageInfo(() -> mapper.selectUsersFromMemberRoleByOptions(roleId, "user", sourceId,
                level, roleAssignmentSearchDTO, param));
    }

    @Override
    public List<UserDTO> listUsersByRoleId(Long roleId, String memberType, String sourceType) {
        return mapper.selectUsersFromMemberRoleByOptions(roleId, memberType, null, sourceType, null, null);
    }

    @Override
    public PageInfo<UserDTO> pagingQueryAdminUsers(int page, int size, UserDTO userDTO, String params) {
        userDTO.setAdmin(true);
        return PageHelper.startPage(page, size).doSelectPageInfo(() -> mapper.selectAdminUserPage(userDTO, params));
    }

    @Override
    public List<UserDTO> insertList(List<UserDTO> insertUsers) {
        insertUsers.forEach(u -> {
            if (mapper.insertSelective(u) != 1) {
                throw new CommonException("error.batch.insert.user");
            }
        });
        return insertUsers;
    }

    @Override
    public Set<String> matchLoginName(Set<String> nameSet) {
        return mapper.matchLoginName(nameSet);
    }


    @Override
    public Set<Long> getIdsByMatchLoginName(Set<String> nameSet) {
        return mapper.getIdsByMatchLoginName(nameSet);
    }

    @Override
    public void disableByIdList(Set<Long> ids) {
        mapper.disableListByIds(ids);
    }

    @Override
    public Set<String> matchEmail(Set<String> emailSet) {
        return mapper.matchEmail(emailSet);
    }

    @Override
    public Long[] listUserIds() {
        return mapper.listUserIds();
    }

    @Override
    public List<UserDTO> listUsersByIds(Long[] ids, Boolean onlyEnabled) {
        return mapper.listUsersByIds(ids, onlyEnabled);
    }

    @Override
    public List<UserDTO> listUsersByEmails(String[] emails) {
        return mapper.listUsersByEmails(emails);
    }

    @Override
    public List<UserDTO> listUsersByLoginNames(String[] loginNames, Boolean onlyEnabled) {
        return mapper.listUsersByLoginNames(loginNames, onlyEnabled);
    }

    @Override
    public int selectCount(UserDTO user) {
        return mapper.selectCount(user);
    }


    @Override
    public PageInfo<SimplifiedUserDTO> pagingAllUsersByParams(int page, int size, String param, Long organizationId) {
        if (organizationId.equals(0L)) {
            return PageHelper.startPage(page, size).doSelectPageInfo(() -> mapper.selectAllUsersSimplifiedInfo(param));
        } else {
            return PageHelper.startPage(page, size).doSelectPageInfo(() -> mapper.selectUsersOptional(param, organizationId));
        }
    }

    @Override
    public Integer totalNumberOfUsers() {
        return mapper.totalNumberOfUsers();
    }

    @Override
    public Integer newUsersToday() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        String begin = dateFormat.format(calendar.getTime());
        calendar.add(Calendar.DATE, 1);
        String end = dateFormat.format(calendar.getTime());
        return mapper.newUsersByDate(begin, end);
    }

    @Override
    public PageInfo<UserRoleDTO> pagingQueryRole(int page, int size, String param, Long userId, Long organizationId) {
        PageInfo<UserRoleDTO> result = PageHelper.startPage(page, size).doSelectPageInfo(() -> mapper.selectRoles(userId, param, organizationId));
        result.getList().forEach(i -> {
            String[] roles = i.getRoleNames().split(",");
            List<RoleNameAndEnabledDTO> list = new ArrayList<>(roles.length);
            for (int j = 0; j < roles.length; j++) {
                String[] nameAndEnabled = roles[j].split("\\|");
                boolean roleEnabled = true;
                if (nameAndEnabled[2].equals("0")) {
                    roleEnabled = false;
                }
                list.add(new RoleNameAndEnabledDTO(nameAndEnabled[0], nameAndEnabled[1], roleEnabled));
            }
            i.setRoles(list);
            if (ResourceLevel.PROJECT.value().equals(i.getLevel())) {
                i.setOrganizationId(projectMapper.selectByPrimaryKey(i.getId()).getOrganizationId());
            }
        });
        return result;
    }

    @Override
    public List<UserDTO> select(UserDTO example) {
        return mapper.select(example);
    }
}
