package io.choerodon.iam.api.dto;

import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

/**
 * @author superlee
 */
public class RoleAssignmentDeleteDTO {

    @ApiModelProperty(value = "成员类型/必填")
    private String memberType;

    @ApiModelProperty(value = "来源ID/必填")
    @NotNull(message = "error.memberRole.sourceId.null")
    private Long sourceId;

    /**
     * view = "userView", key表示userId, value表示roleIds
     * view = "roleView", key表示roleId, value表示userIds
     */
    @ApiModelProperty(value = "视图类型，userView（key表示userId, value表示roleIds）、roleView（key表示roleId, value表示userIds）/必填")
    @NotEmpty(message = "error.memberRole.view.empty")
    private String view;

    @ApiModelProperty(value = "角色分配数据/必填")
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
