package io.choerodon.iam.infra.common.utils;

/**
 * 根据page, size参数获取数据库start的行
 */
public class PageUtils {

    public static int getBegin(int page, int size) {
        page = page <= 1 ? 1 : page;
        return (page - 1) * size;
    }
}
