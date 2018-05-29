package io.choerodon.iam.infra.repository.impl;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.domain.PageInfo;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.RoleAssignmentSearchDTO;
import io.choerodon.iam.domain.iam.entity.UserE;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.infra.dataobject.UserDO;
import io.choerodon.iam.infra.mapper.UserMapper;
import io.choerodon.mybatis.pagehelper.PageHelper;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author superlee
 * @data 2018/3/26
 */
@Component
public class UserRepositoryImpl implements UserRepository {

    private UserMapper mapper;

    public UserRepositoryImpl(UserMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public UserE selectByLoginName(String loginName) {
        UserDO userDO = new UserDO();
        userDO.setLoginName(loginName);
        return ConvertHelper.convert(mapper.selectOne(userDO), UserE.class);
    }

    @Override
    public UserE insertSelective(UserE userE) {
        UserDO userDO = ConvertHelper.convert(userE, UserDO.class);
        if (mapper.insertSelective(userDO) != 1) {
            throw new CommonException("error.user.create");
        }
        return ConvertHelper.convert(mapper.selectByPrimaryKey(userDO.getId()), UserE.class);
    }

    @Override
    public Page<UserDO> pagingQuery(PageRequest pageRequest, UserDO userDO, String[] params) {
        //TODO
        //language code 转描述
        return PageHelper.doPageAndSort(pageRequest, () -> mapper.fulltextSearch(userDO, params));
    }

    @Override
    public UserE selectByPrimaryKey(Long id) {
        return ConvertHelper.convert(mapper.selectByPrimaryKey(id), UserE.class);
    }

    @Override
    public UserE updateSelective(UserE userE) {
        UserDO userDO = ConvertHelper.convert(userE, UserDO.class);
        if (userDO.getObjectVersionNumber() == null) {
            throw new CommonException("error.user.objectVersionNumber.empty");
        }
        if (mapper.updateByPrimaryKeySelective(userDO) != 1) {
            throw new CommonException("error.user.update");
        }
        return ConvertHelper.convert(mapper.selectByPrimaryKey(userDO.getId()), UserE.class);
    }

    @Override
    public void deleteById(Long id) {
        UserDO userDO = new UserDO();
        userDO.setId(id);
        if (mapper.deleteByPrimaryKey(userDO) != 1) {
            throw new CommonException("error.user.delete");
        }
    }

    @Override
    public Page<UserDO> pagingQueryUsersWithSiteLevelRoles(PageRequest pageRequest,
                                                           RoleAssignmentSearchDTO roleAssignmentSearchDTO) {
        //TODO
        //这里的分页是写死的只支持mysql分页，暂时先实现功能，后续做优化，使用PageHelper进行分页
        int page = pageRequest.getPage();
        int size = pageRequest.getSize();
        int start = page * size;
        PageInfo pageInfo = new PageInfo(page, size);
        int count = mapper.selectCountUsers(roleAssignmentSearchDTO, 0L, ResourceLevel.SITE.value(),
                roleAssignmentSearchDTO.getParam());
        List<UserDO> userDOList =
                mapper.selectUserWithRolesBySourceIdAndType(
                        roleAssignmentSearchDTO, 0L, ResourceLevel.SITE.value(), start, size,
                        roleAssignmentSearchDTO.getParam());
        //没有order by
        //TODO
        //筛选非空角色以及角色内部按id排序
        return new Page<>(userDOList, pageInfo, count);
    }

    @Override
    public Page<UserDO> pagingQueryUsersWithOrganizationLevelRoles(PageRequest pageRequest,
                                                                   RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                                   Long sourceId) {
        //TODO
        //这里的分页是写死的只支持mysql分页，暂时先实现功能，后续做优化，使用PageHelper进行分页
        int page = pageRequest.getPage();
        int size = pageRequest.getSize();
        int start = page * size;
        PageInfo pageInfo = new PageInfo(page, size);
        int count = mapper.selectCountUsers(roleAssignmentSearchDTO, sourceId, ResourceLevel.ORGANIZATION.value(),
                roleAssignmentSearchDTO.getParam());
        List<UserDO> userDOList =
                mapper.selectUserWithRolesBySourceIdAndType(
                        roleAssignmentSearchDTO, sourceId, ResourceLevel.ORGANIZATION.value(), start, size,
                        roleAssignmentSearchDTO.getParam());
        //没有order by
        //TODO
        //筛选非空角色以及角色内部按id排序
        return new Page<>(userDOList, pageInfo, count);
    }

    @Override
    public Page<UserDO> pagingQueryUsersWithProjectLevelRoles(PageRequest pageRequest,
                                                              RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                              Long sourceId) {
        //TODO
        //这里的分页是写死的只支持mysql分页，暂时先实现功能，后续做优化，使用PageHelper进行分页
        int page = pageRequest.getPage();
        int size = pageRequest.getSize();
        int start = page * size;
        PageInfo pageInfo = new PageInfo(page, size);
        int count = mapper.selectCountUsers(roleAssignmentSearchDTO, sourceId, ResourceLevel.PROJECT.value(),
                roleAssignmentSearchDTO.getParam());
        List<UserDO> userDOList =
                mapper.selectUserWithRolesBySourceIdAndType(
                        roleAssignmentSearchDTO, sourceId, ResourceLevel.PROJECT.value(), start, size,
                        roleAssignmentSearchDTO.getParam());
        //没有order by
        //TODO
        //筛选非空角色以及角色内部按id排序
        return new Page<>(userDOList, pageInfo, count);
    }

    @Override
    public UserE updateUserInfo(UserE userE) {
        UserDO user = ConvertHelper.convert(userE, UserDO.class);
        if (mapper.updateByPrimaryKeySelective(user) != 1) {
            throw new CommonException("error.user.update");
        }
        return ConvertHelper.convert(mapper.selectByPrimaryKey(user.getId()), UserE.class);
    }

    @Override
    public UserDO selectOne(UserDO user) {
        return mapper.selectOne(user);
    }

    @Override
    public Page<UserDO> pagingQueryWhoBelongsToTheProject(Long projectId, PageRequest pageRequest, String param) {
        return PageHelper.doPageAndSort(pageRequest,
                () -> mapper.selectTheUsersOfProjectByParamAndProjectId(projectId, param));
    }

    @Override
    public Integer selectUserCountFromMemberRoleByOptions(Long roleId, String memberType, Long sourceId, String sourceType,
                                                          RoleAssignmentSearchDTO roleAssignmentSearchDTO) {
        return mapper.selectUserCountFromMemberRoleByOptions(roleId,
                memberType, sourceId, sourceType, roleAssignmentSearchDTO);
    }

    @Override
    public Page<UserDO> pagingQueryUsersByRoleIdOnSiteLevel(PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId) {
        return PageHelper.doPageAndSort(pageRequest,
                () -> mapper.selectUsersFromMemberRoleByOptions(roleId, "user",
                        0L, ResourceLevel.SITE.value(), roleAssignmentSearchDTO));
    }

    @Override
    public List<UserDO> listUsersByRoleIdOnSiteLevel(Long roleId) {
        return mapper.selectUsersFromMemberRoleByOptions(roleId, "user", 0L,
                ResourceLevel.SITE.value(), null);
    }

    @Override
    public List<UserDO> listUsersByRoleIdOnOrganizationLevel(Long orgId, Long roleId) {
        return mapper.selectUsersFromMemberRoleByOptions(roleId, "user",
                orgId, ResourceLevel.ORGANIZATION.value(), null);
    }

    @Override
    public List<UserDO> listUsersByRoleIdOnProjectLevel(Long proId, Long roleId) {
        return mapper.selectUsersFromMemberRoleByOptions(roleId, "user",
                proId, ResourceLevel.PROJECT.value(), null);
    }

    @Override
    public Page<UserDO> pagingQueryUsersByRoleIdOnOrganizationLevel(PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId, Long sourceId) {
        return PageHelper.doPageAndSort(pageRequest,
                () -> mapper.selectUsersFromMemberRoleByOptions(roleId, "user", sourceId,
                        ResourceLevel.ORGANIZATION.value(), roleAssignmentSearchDTO));
    }

    @Override
    public Page<UserDO> pagingQueryUsersByRoleIdOnProjectLevel(PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId, Long sourceId) {
        return PageHelper.doPageAndSort(pageRequest,
                () -> mapper.selectUsersFromMemberRoleByOptions(roleId, "user", sourceId,
                        ResourceLevel.PROJECT.value(), roleAssignmentSearchDTO));
    }

    @Override
    public List<UserDO> listUsersByRoleId(Long roleId, String memberType, String sourceType) {
        return mapper.selectUsersFromMemberRoleByOptions(roleId, memberType, null, sourceType, null);
    }

    @Override
    public Page<UserDO> pagingQueryAdminUsers(PageRequest pageRequest, UserDO userDO) {
        return PageHelper.doPageAndSort(pageRequest, () -> {
            userDO.setAdmin(true);
            return mapper.selectAdminUserPage(userDO);
        });
    }

    @Override
    public List<UserDO> listUsersByIds(Long[] ids) {
        return mapper.listUsersByIds(ids);
    }

    @Override
    public int selectCount(UserDO user) {
        return mapper.selectCount(user);
    }
}
