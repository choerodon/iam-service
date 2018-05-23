package io.choerodon.iam.api.dto;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * @author superlee
 */
public class RoleAssignmentDeleteDTO {

    private String memberType;

    @NotNull(message = "error.memberRole.sourceId.null")
    private Long sourceId;

    /**
     * view = "userView", key表示userId, value表示roleIds
     * view = "roleView", key表示roleId, value表示userIds
     */
    @NotEmpty(message = "error.memberRole.view.empty")
    private String view;

    @NotNull(message = "error.memberRole.data.null")
    private Map<Long, List<Long>> data;

    public String getMemberType() {
        return memberType;
    }

    public void setMemberType(String memberType) {
        this.memberType = memberType;
    }

    public Map<Long, List<Long>> getData() {
        return data;
    }

    public void setData(Map<Long, List<Long>> data) {
        this.data = data;
    }

    public String getView() {
        return view;
    }

    public void setView(String view) {
        this.view = view;
    }

    public Long getSourceId() {
        return sourceId;
    }

    public void setSourceId(Long sourceId) {
        this.sourceId = sourceId;
    }
}
