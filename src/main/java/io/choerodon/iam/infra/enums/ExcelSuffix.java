package io.choerodon.iam.infra.enums;

/**
 * @author superlee
 */
public enum ExcelSuffix {

    /**
     * excel2003文件后缀
     */
    XLS("xls"),
    /**
     * excel2007文件后缀
     */
    XLSX("xlsx");

    private String value;

    ExcelSuffix(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }
}
