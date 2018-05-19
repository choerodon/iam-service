package io.choerodon.iam.domain.iam.entity;

/**
 * @author superlee
 * @data 2018/4/3
 */
public class InstanceE {

    private String status;

    private String appName;

    private String id;

    private String version;

    private String uuid;

    private String apiData;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getApiData() {
        return apiData;
    }

    public void setApiData(String apiData) {
        this.apiData = apiData;
    }
}
