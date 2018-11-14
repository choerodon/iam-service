FROM registry.cn-hangzhou.aliyuncs.com/choerodon-tools/javabase:0.7.0
COPY app.jar /iam-service.jar
ENTRYPOINT exec java $JAVA_OPTS  -jar /iam-service.jar
