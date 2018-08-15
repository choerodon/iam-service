package io.choerodon.iam.api.eventhandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.choerodon.asgard.saga.annotation.Saga;
import io.choerodon.asgard.saga.annotation.SagaTask;
import io.choerodon.asgard.saga.dto.StartInstanceDTO;
import io.choerodon.asgard.saga.feign.SagaClient;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.payload.UserMemberEventPayload;
import io.choerodon.iam.domain.repository.LabelRepository;
import io.choerodon.iam.infra.common.utils.ListUtils;
import io.choerodon.iam.infra.dataobject.MemberRoleDO;
import io.choerodon.iam.infra.mapper.MemberRoleMapper;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

import static io.choerodon.iam.infra.common.utils.SagaTopic.MemberRole.MEMBER_ROLE_UPDATE;


/**
 * devops 0.8.0 -> 0.9.0平滑升级类
 *
 * @author superlee
 */
@Component
public class DevopsListener {

    private MemberRoleMapper memberRoleMapper;
    private LabelRepository labelRepository;
    private SagaClient sagaClient;
    private ObjectMapper objectMapper = new ObjectMapper();

    public DevopsListener(MemberRoleMapper memberRoleMapper,
                          LabelRepository labelRepository,
                          SagaClient sagaClient) {
        this.memberRoleMapper = memberRoleMapper;
        this.labelRepository = labelRepository;
        this.sagaClient = sagaClient;
    }

    @Saga(code = MEMBER_ROLE_UPDATE, description = "iam更新用户角色", inputSchemaClass = List.class)
    @SagaTask(code = MEMBER_ROLE_UPDATE, sagaCode = "devops-upgrade-0.8-0.9", seq = 1, description = "iam接收devops平滑升级事件")
    public void assignRolesOnProject(String messgae) {
        MemberRoleDO memberRole = new MemberRoleDO();
        memberRole.setSourceType(ResourceLevel.PROJECT.value());
        memberRole.setMemberType("user");
        List<MemberRoleDO> memberRoles = memberRoleMapper.select(memberRole);
        Map<Map<Long, Long>, List<MemberRoleDO>> map
                = memberRoles.stream().collect(Collectors.groupingBy(m->{
                        Map<Long, Long> map1 = new HashMap<>();
                        map1.put(m.getSourceId(), m.getMemberId());
                        return map1;
                    }));
        List<UserMemberEventPayload> userMemberEventPayloads = new ArrayList<>();
        for (Map.Entry<Map<Long, Long>, List<MemberRoleDO>> entry : map.entrySet()) {
            UserMemberEventPayload payload = new UserMemberEventPayload();
            List<MemberRoleDO> mrs = entry.getValue();
            Long sourceId = null;
            Long userId = null;
            List<Long> roleIds = new ArrayList<>();
            for(MemberRoleDO mr : mrs) {
                sourceId = mr.getSourceId();
                userId = mr.getMemberId();
                roleIds.add(mr.getRoleId());
            }
            payload.setResourceId(sourceId);
            payload.setResourceType("project");
            payload.setUserId(userId);
            if (!roleIds.isEmpty()) {
                payload.setRoleLabels(labelRepository.selectLabelNamesInRoleIds(roleIds));
            }
            userMemberEventPayloads.add(payload);
        }
        List<List<UserMemberEventPayload>> list = ListUtils.subList(userMemberEventPayloads, 1000);
        list.forEach(l -> {
            try {
                String input = objectMapper.writeValueAsString(l);
                String refIds = l.stream().map(t -> t.getUserId() + "").collect(Collectors.joining(","));
                sagaClient.startSaga(MEMBER_ROLE_UPDATE, new StartInstanceDTO(input, "users", refIds));
            } catch (Exception e) {
                throw new CommonException("error.iRoleMemberServiceImpl.updateMemberRole.event");
            }
        });
    }
}
