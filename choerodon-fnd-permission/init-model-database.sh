#!/usr/bin/env bash
mkdir -p choerodon_temp
if [ ! -f choerodon_temp/choerodon-tool-liquibase.jar ]
then
    curl http://nexus.choerodon.com.cn/repository/choerodon-release/io/choerodon/choerodon-tool-liquibase/0.9.2.RELEASE/choerodon-tool-liquibase-0.9.2.RELEASE.jar -L  -o choerodon_temp/choerodon-tool-liquibase.jar
fi
#java -Dspring.datasource.url="jdbc:sqlserver://localhost:1433;databaseName=iam_service" \
java -Dspring.datasource.url="jdbc:mysql://localhost/iam_service?useUnicode=true&characterEncoding=utf-8&useSSL=false" \
 -Dspring.datasource.username=root \
 -Dspring.datasource.password=root \
 -Ddata.drop=true -Ddata.init=true \
 -Ddata.dir=src/main/resources \
 -jar choerodon_temp/choerodon-tool-liquibase.jar