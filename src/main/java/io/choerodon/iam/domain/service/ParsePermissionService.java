package io.choerodon.iam.domain.service;

/**
 * @author superlee
 * @data 2018/4/3
 */
public interface ParsePermissionService {

    /**
     * 解析swagger的文档树
     *
     * @param message 接受的消息
     */
    void parser(String message);

}
