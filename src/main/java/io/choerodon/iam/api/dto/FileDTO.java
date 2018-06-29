package io.choerodon.iam.api.dto;

public class FileDTO {

    private String endPoint;
    private String originFileName;
    private String fileName;

    public String getEndPoint() {
        return endPoint;
    }

    public void setEndPoint(String endPoint) {
        this.endPoint = endPoint;
    }

    public String getOriginFileName() {
        return originFileName;
    }

    public void setOriginFileName(String originFileName) {
        this.originFileName = originFileName;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
