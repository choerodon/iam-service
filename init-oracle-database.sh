#!/usr/bin/env bash
mkdir -p choerodon_temp
if [ ! -f temp/choerodon-tool-liquibase.jar ]
then
    curl http://nexus.choerodon.com.cn/repository/choerodon-release/io/choerodon/choerodon-tool-liquibase/0.7.0.RELEASE/choerodon-tool-liquibase-0.7.0.RELEASE.jar -L  -o choerodon_temp/choerodon-tool-liquibase.jar
fi
java -Dspring.datasource.url="jdbc:oracle:thin:@127.0.0.1:1521:xe" \
 -Dspring.datasource.username=iam_service \
 -Dspring.datasource.password=123456 \
 -Ddata.drop=false -Ddata.init=true \
 -Ddata.dir=iam-service/src/main/resources \
 -jar choerodon_temp/choerodon-tool-liquibase.jar