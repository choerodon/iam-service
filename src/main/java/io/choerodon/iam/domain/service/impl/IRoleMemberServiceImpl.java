package io.choerodon.iam.domain.service.impl;

import java.util.*;
import java.util.stream.Collectors;

import io.choerodon.event.producer.execute.EventProducerTemplate;
import io.choerodon.iam.api.dto.RoleAssignmentDeleteDTO;
import io.choerodon.iam.api.validator.RoleAssignmentViewValidator;
import io.choerodon.iam.infra.enums.RoleLabel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Service;

import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.payload.UserMemberEventPayload;
import io.choerodon.iam.domain.iam.entity.MemberRoleE;
import io.choerodon.iam.domain.iam.entity.UserE;
import io.choerodon.iam.domain.repository.LabelRepository;
import io.choerodon.iam.domain.repository.MemberRoleRepository;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.domain.service.IRoleMemberService;
import io.choerodon.iam.infra.dataobject.LabelDO;
import io.choerodon.iam.infra.dataobject.MemberRoleDO;
import io.choerodon.mybatis.service.BaseServiceImpl;

/**
 * @author superlee
 */
@Service
@RefreshScope
public class IRoleMemberServiceImpl extends BaseServiceImpl<MemberRoleDO> implements IRoleMemberService {

    private UserRepository userRepository;

    private MemberRoleRepository memberRoleRepository;

    private LabelRepository labelRepository;

    @Value("${choerodon.devops.message:false}")
    private boolean devopsMessage;

    @Value("${spring.application.name:default}")
    private String serviceName;

    private EventProducerTemplate eventProducerTemplate;

    public IRoleMemberServiceImpl(UserRepository userRepository,
                                  MemberRoleRepository memberRoleRepository,
                                  EventProducerTemplate eventProducerTemplate,
                                  LabelRepository labelRepository) {
        this.userRepository = userRepository;
        this.memberRoleRepository = memberRoleRepository;
        this.eventProducerTemplate = eventProducerTemplate;
        this.labelRepository = labelRepository;
    }

    @Override
    public List<MemberRoleE> insertOrUpdateRolesByMemberId(Boolean isEdit, Long sourceId, Long memberId, List<MemberRoleE> memberRoleEList, String sourceType) {
        UserE userE = userRepository.selectByPrimaryKey(memberId);
        if (userE == null) {
            throw new CommonException("error.user.not.exist");
        }
        List<MemberRoleE> returnList = new ArrayList<>();
        if (devopsMessage) {
            List<UserMemberEventPayload> userMemberEventPayloads = new ArrayList<>();
            UserMemberEventPayload userMemberEventMsg = new UserMemberEventPayload();
            userMemberEventMsg.setResourceId(sourceId);
            userMemberEventMsg.setResourceType(sourceType);
            userMemberEventMsg.setUsername(userE.getLoginName());
            Exception exception = eventProducerTemplate.execute("memberRole", "updateMemberRole",
                    serviceName, userMemberEventPayloads, (String uuid) -> {
                        List<Long> ownRoleIds = insertOrUpdateRolesByMemberIdExecute(
                                isEdit, sourceId, memberId, sourceType, memberRoleEList, returnList);
                        setRoleLabels(userMemberEventMsg, ownRoleIds);
                        userMemberEventPayloads.add(userMemberEventMsg);
                    });
            if (exception != null) {
                throw new CommonException(exception.getMessage());
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
    public void delete(RoleAssignmentDeleteDTO roleAssignmentDeleteDTO, String sourceType) {
        if (devopsMessage) {
            List<UserMemberEventPayload> userMemberEventPayloads = new ArrayList<>();
            Exception exception = eventProducerTemplate.execute("memberRole", "deleteMemberRole",
                    serviceName, userMemberEventPayloads, (String uuid) ->
                deleteByView(roleAssignmentDeleteDTO, sourceType, userMemberEventPayloads)
            );
            if (exception != null) {
                throw new CommonException(exception.getMessage());
            }
        } else {
            deleteByView(roleAssignmentDeleteDTO, sourceType, null);
        }
    }

    private void deleteByView(RoleAssignmentDeleteDTO roleAssignmentDeleteDTO,
                              String sourceType,
                              List<UserMemberEventPayload> userMemberEventPayloads) {
        boolean doSendEvent = !(userMemberEventPayloads == null);
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
            throw new CommonException("error.memberRole.not.exist", roleId, memberId);
        }
        memberRoleRepository.deleteById(mr.getId());
        UserMemberEventPayload userMemberEventMsg = null;
        //查询移除的role所包含的所有Label
        if (doSendEvent) {
            List<LabelDO> labels = labelRepository.selectByRoleId(mr.getRoleId());
            boolean containGitlabLabel = false;
            for (LabelDO label : labels) {
                //移除的角色label包含gitlab.owner标签或gitlab.developer标签
                if (RoleLabel.GITLAB_OWMER.value().equals(label.getName())
                        || RoleLabel.GITLAB_DEVELOPER.value().equals(label.getName())) {
                    containGitlabLabel = true;
                    break;
                }
            }
            if (containGitlabLabel) {
                userMemberEventMsg = new UserMemberEventPayload();
                userMemberEventMsg.setResourceId(sourceId);
                userMemberEventMsg.setResourceType(sourceType);
                UserE user = userRepository.selectByPrimaryKey(memberId);
                if (user == null) {
                    throw new CommonException("error.user.not.exist", memberId);
                }
                userMemberEventMsg.setUsername(user.getLoginName());
            }
        }
        return userMemberEventMsg;
    }

    private void setRoleLabels(UserMemberEventPayload userMemberEventMsg,
                               List<Long> ownRoleIds) {
        Set<String> roleLabels = new HashSet<>();
        ownRoleIds.forEach( roleId -> {
            List<LabelDO> labels = labelRepository.selectByRoleId(roleId);
            labels.forEach(label -> roleLabels.add(label.getName()));
        });
        userMemberEventMsg.setRoleLabels(roleLabels);
    }

    @Override
    public void deleteByIdOnSiteLevel(Long id) {
        memberRoleRepository.deleteById(id);
    }

    @Override
    public void deleteByIdOnOrganizationLevel(Long id, Long organizationId) {
        MemberRoleE memberRoleE = memberRoleRepository.selectByPrimaryKey(id);
        if (memberRoleE == null) {
            throw new CommonException("error.memberRole.not.exist");
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
            throw new CommonException("error.memberRole.not.exist");
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
        List<Long> intersection = existingRoleIds.stream().filter(item ->
                newRoleIds.contains(item)).collect(Collectors.toList());
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
        if (isEdit != null && isEdit) {
            deleteList.forEach(item -> {
                MemberRoleE mr = new MemberRoleE(null, item, memberId, "user", sourceId, sourceType);
                mr = memberRoleRepository.selectOne(mr);
                if (mr != null) {
                    memberRoleRepository.deleteById(mr.getId());
                    exceptDelete(returnList, mr);
                }
            });
        }
        List<Long> ownRoleIds = new ArrayList<>();
        List<Long> ids = existingRoleIds.stream().filter(item ->
                !deleteList.contains(item)).collect(Collectors.toList());
        ownRoleIds.addAll(insertList);
        ownRoleIds.addAll(intersection);
        ownRoleIds.addAll(ids);
        return ownRoleIds;
    }

    private void exceptDelete(List<MemberRoleE> memberRoleES, MemberRoleE memberRoleE) {
        for (int i = 0; i < memberRoleES.size(); i++) {
            if (memberRoleES.get(i).getId() == memberRoleE.getId()) {
                memberRoleES.remove(i);
            }
        }
    }
}
