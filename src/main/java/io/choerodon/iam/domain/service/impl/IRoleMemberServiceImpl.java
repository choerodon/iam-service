package io.choerodon.iam.domain.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.choerodon.asgard.saga.annotation.Saga;
import io.choerodon.asgard.saga.dto.StartInstanceDTO;
import io.choerodon.asgard.saga.feign.SagaClient;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.RoleAssignmentDeleteDTO;
import io.choerodon.iam.api.dto.payload.UserMemberEventPayload;
import io.choerodon.iam.api.validator.RoleAssignmentViewValidator;
import io.choerodon.iam.domain.iam.entity.MemberRoleE;
import io.choerodon.iam.domain.iam.entity.UserE;
import io.choerodon.iam.domain.repository.LabelRepository;
import io.choerodon.iam.domain.repository.MemberRoleRepository;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.domain.service.IRoleMemberService;
import io.choerodon.iam.infra.dataobject.MemberRoleDO;
import io.choerodon.mybatis.service.BaseServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static io.choerodon.iam.infra.common.utils.SagaTopic.MemberRole.MEMBER_ROLE_DELETE;
import static io.choerodon.iam.infra.common.utils.SagaTopic.MemberRole.MEMBER_ROLE_UPDATE;

/**
 * @author superlee
 */
@Service
@RefreshScope
public class IRoleMemberServiceImpl extends BaseServiceImpl<MemberRoleDO> implements IRoleMemberService {

    private static final String MEMBER_ROLE_NOT_EXIST_EXCEPTION = "error.memberRole.not.exist";


    private UserRepository userRepository;

    private MemberRoleRepository memberRoleRepository;

    private LabelRepository labelRepository;

    private SagaClient sagaClient;

    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${choerodon.devops.message:false}")
    private boolean devopsMessage;

    @Value("${spring.application.name:default}")
    private String serviceName;

    public IRoleMemberServiceImpl(UserRepository userRepository,
                                  MemberRoleRepository memberRoleRepository,
                                  LabelRepository labelRepository,
                                  SagaClient sagaClient) {
        this.userRepository = userRepository;
        this.memberRoleRepository = memberRoleRepository;
        this.labelRepository = labelRepository;
        this.sagaClient = sagaClient;
    }

    @Override
    @Saga(code = MEMBER_ROLE_UPDATE, description = "iam更新用户角色", inputSchemaClass = List.class)
    @Transactional
    public List<MemberRoleE> insertOrUpdateRolesByMemberId(Boolean isEdit, Long sourceId,
                                                           Long memberId, List<MemberRoleE> memberRoleEList,
                                                           String sourceType) {
        UserE userE = userRepository.selectByPrimaryKey(memberId);
        if (userE == null) {
            throw new CommonException("error.user.not.exist");
        }
        List<MemberRoleE> returnList = new ArrayList<>();
        if (devopsMessage) {
            List<UserMemberEventPayload> userMemberEventPayloads = new ArrayList<>();
            UserMemberEventPayload userMemberEventMsg = new UserMemberEventPayload();
            userMemberEventMsg.setResourceId(sourceId);
            userMemberEventMsg.setUserId(memberId);
            userMemberEventMsg.setResourceType(sourceType);
            userMemberEventMsg.setUsername(userE.getLoginName());

            List<Long> ownRoleIds = insertOrUpdateRolesByMemberIdExecute(
                    isEdit, sourceId, memberId, sourceType, memberRoleEList, returnList);
            if (!ownRoleIds.isEmpty()) {
                userMemberEventMsg.setRoleLabels(labelRepository.selectLabelNamesInRoleIds(ownRoleIds));
            }
            userMemberEventPayloads.add(userMemberEventMsg);

            try {
                String input = mapper.writeValueAsString(userMemberEventPayloads);
                String refIds = userMemberEventPayloads.stream().map(t -> t.getUserId() + "").collect(Collectors.joining(","));
                sagaClient.startSaga(MEMBER_ROLE_UPDATE, new StartInstanceDTO(input, "users", refIds));
            } catch (Exception e) {
                throw new CommonException("error.iRoleMemberServiceImpl.updateMemberRole.event", e);
            }

            return returnList;
        } else {
            insertOrUpdateRolesByMemberIdExecute(isEdit,
                    sourceId,
                    memberId,
                    sourceType,
                    memberRoleEList,
                    returnList);
            return returnList;
        }
    }

    @Override
    @Saga(code = MEMBER_ROLE_DELETE, description = "iam删除用户角色")
    @Transactional
    public void delete(RoleAssignmentDeleteDTO roleAssignmentDeleteDTO, String sourceType) {
        if (devopsMessage) {
            List<UserMemberEventPayload> userMemberEventPayloads = new ArrayList<>();
            deleteByView(roleAssignmentDeleteDTO, sourceType, userMemberEventPayloads);
            try {
                String input = mapper.writeValueAsString(userMemberEventPayloads);
                String refIds = userMemberEventPayloads.stream().map(t -> t.getUserId() + "").collect(Collectors.joining(","));
                sagaClient.startSaga(MEMBER_ROLE_DELETE, new StartInstanceDTO(input, "users", refIds));
            } catch (Exception e) {
                throw new CommonException("error.iRoleMemberServiceImpl.deleteMemberRole.event", e);
            }
        } else {
            deleteByView(roleAssignmentDeleteDTO, sourceType, null);
        }
    }

    private void deleteByView(RoleAssignmentDeleteDTO roleAssignmentDeleteDTO,
                              String sourceType,
                              List<UserMemberEventPayload> userMemberEventPayloads) {
        boolean doSendEvent = userMemberEventPayloads != null;
        String memberType =
                roleAssignmentDeleteDTO.getMemberType() == null ? "user" : roleAssignmentDeleteDTO.getMemberType();
        String view = roleAssignmentDeleteDTO.getView();
        Long sourceId = roleAssignmentDeleteDTO.getSourceId();
        Map<Long, List<Long>> data = roleAssignmentDeleteDTO.getData();
        if (RoleAssignmentViewValidator.USER_VIEW.equalsIgnoreCase(view)) {
            for (Map.Entry<Long, List<Long>> entry : data.entrySet()) {
                Long userId = entry.getKey();
                List<Long> roleIds = entry.getValue();
                if (roleIds != null && !roleIds.isEmpty()) {
                    roleIds.forEach(roleId -> {
                        UserMemberEventPayload userMemberEventPayload =
                                delete(roleId, userId, memberType, sourceId, sourceType, doSendEvent);
                        if (userMemberEventPayload != null) {
                            userMemberEventPayloads.add(userMemberEventPayload);
                        }
                    });
                }
            }
        } else if (RoleAssignmentViewValidator.ROLE_VIEW.equalsIgnoreCase(view)) {
            for (Map.Entry<Long, List<Long>> entry : data.entrySet()) {
                Long roleId = entry.getKey();
                List<Long> userIds = entry.getValue();
                if (userIds != null && !userIds.isEmpty()) {
                    userIds.forEach(userId -> {
                        UserMemberEventPayload payload =
                                delete(roleId, userId, memberType, sourceId, sourceType, doSendEvent);
                        if (payload != null) {
                            userMemberEventPayloads.add(payload);
                        }
                    });
                }
            }
        }
    }

    private UserMemberEventPayload delete(Long roleId, Long memberId, String memberType,
                                          Long sourceId, String sourceType, boolean doSendEvent) {
        MemberRoleE memberRole =
                new MemberRoleE(null, roleId, memberId, memberType, sourceId, sourceType);
        MemberRoleE mr = memberRoleRepository.selectOne(memberRole);
        if (mr == null) {
            throw new CommonException(MEMBER_ROLE_NOT_EXIST_EXCEPTION, roleId, memberId);
        }
        memberRoleRepository.deleteById(mr.getId());
        UserMemberEventPayload userMemberEventMsg = null;
        //查询移除的role所包含的所有Label
        if (doSendEvent) {
            userMemberEventMsg = new UserMemberEventPayload();
            userMemberEventMsg.setResourceId(sourceId);
            userMemberEventMsg.setResourceType(sourceType);
            UserE user = userRepository.selectByPrimaryKey(memberId);
            if (user == null) {
                throw new CommonException("error.user.not.exist", memberId);
            }
            userMemberEventMsg.setUsername(user.getLoginName());
            userMemberEventMsg.setUserId(memberId);
        }
        return userMemberEventMsg;
    }

    @Override
    public void deleteByIdOnSiteLevel(Long id) {
        memberRoleRepository.deleteById(id);
    }

    @Override
    public void deleteByIdOnOrganizationLevel(Long id, Long organizationId) {
        MemberRoleE memberRoleE = memberRoleRepository.selectByPrimaryKey(id);
        if (memberRoleE == null) {
            throw new CommonException(MEMBER_ROLE_NOT_EXIST_EXCEPTION);
        }
        if (organizationId.equals(memberRoleE.getSourceId())
                && ResourceLevel.ORGANIZATION.value().equals(memberRoleE.getSourceType())) {
            memberRoleRepository.deleteById(id);
        } else {
            throw new CommonException("error.delete.access.denied");
        }
    }

    @Override
    public void deleteByIdOnProjectLevel(Long id, Long projectId) {
        MemberRoleE memberRoleE = memberRoleRepository.selectByPrimaryKey(id);
        if (memberRoleE == null) {
            throw new CommonException(MEMBER_ROLE_NOT_EXIST_EXCEPTION);
        }
        if (projectId.equals(memberRoleE.getSourceId())
                && ResourceLevel.PROJECT.value().equals(memberRoleE.getSourceType())) {
            memberRoleRepository.deleteById(id);
        } else {
            throw new CommonException("error.delete.access.denied");
        }
    }

    private List<Long> insertOrUpdateRolesByMemberIdExecute(Boolean isEdit, Long sourceId,
                                                            Long memberId, String sourceType,
                                                            List<MemberRoleE> memberRoleEList,
                                                            List<MemberRoleE> returnList) {
        MemberRoleE memberRoleE =
                new MemberRoleE(null, null, memberId, "user", sourceId, sourceType);
        List<MemberRoleE> existingMemberRoleEList = memberRoleRepository.select(memberRoleE);
        List<Long> existingRoleIds =
                existingMemberRoleEList.stream().map(MemberRoleE::getRoleId).collect(Collectors.toList());
        List<Long> newRoleIds = memberRoleEList.stream().map(MemberRoleE::getRoleId).collect(Collectors.toList());
        //交集，传入的roleId与数据库里存在的roleId相交
        List<Long> intersection = existingRoleIds.stream().filter(newRoleIds::contains).collect(Collectors.toList());
        //传入的roleId与交集的差集为要插入的roleId
        List<Long> insertList = newRoleIds.stream().filter(item ->
                !intersection.contains(item)).collect(Collectors.toList());
        //数据库存在的roleId与交集的差集为要删除的roleId
        List<Long> deleteList = existingRoleIds.stream().filter(item ->
                !intersection.contains(item)).collect(Collectors.toList());
        returnList.addAll(existingMemberRoleEList);
        insertList.forEach(item -> {
            MemberRoleE mr = new MemberRoleE(null, item, memberId, "user", sourceId, sourceType);
            returnList.add(memberRoleRepository.insertSelective(mr));
        });
        if (isEdit != null && isEdit && !deleteList.isEmpty()) {
            memberRoleRepository.selectDeleteList(deleteList, memberId, sourceId, sourceType)
                    .forEach(t -> {
                        if (t != null) {
                            memberRoleRepository.deleteById(t);
                            exceptDelete(returnList, t);
                        }
                    });
        }
        //查当前用户有那些角色
        return memberRoleRepository.select(memberRoleE)
                .stream().map(MemberRoleE::getRoleId).collect(Collectors.toList());
    }

    private void exceptDelete(List<MemberRoleE> memberRoleES, Long memberRoleId) {
        for (int i = 0; i < memberRoleES.size(); i++) {
            if (memberRoleES.get(i).getId().equals(memberRoleId)) {
                memberRoleES.remove(i);
            }
        }
    }
}
