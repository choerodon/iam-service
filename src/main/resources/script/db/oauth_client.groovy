package script.db

databaseChangeLog(logicalFilePath: 'script/db/oauth_client.groovy') {
    changeSet(author: 'guokai.wu.work@gmail.com', id: '2018-03-23-oauth_client') {
        if(helper.dbType().isSupportSequence()){
            createSequence(sequenceName: 'oauth_client_s', startValue:"1")
        }
        createTable(tableName: "oauth_client") {
            column(name: 'id', type: 'BIGINT UNSIGNED', remarks: '客户端ID', autoIncrement: true) {
                constraints(primaryKey: true)
            }
            column(name: 'name', type: 'VARCHAR(32)', remarks: '客户端名称') {
                constraints(nullable: false)
                constraints(unique: true)
            }
            column(name: 'organization_id', type: 'BIGINT UNSIGNED', remarks: '组织ID') {
                constraints(nullable: false)
            }
            column(name: 'resource_ids', type: 'VARCHAR(32)', defaultValue: "default", remarks: '资源ID列表，目前只使用default')
            column(name: 'secret', type: 'VARCHAR(255)', remarks: '客户端秘钥')
            column(name: 'scope', type: 'VARCHAR(32)', defaultValue: "default", remarks: 'Oauth授权范围')
            column(name: 'authorized_grant_types', type: 'VARCHAR(255)', remarks: '支持的授权类型列表')
            column(name: 'web_server_redirect_uri', type: 'VARCHAR(128)', remarks: '授权重定向URL')
            column(name: 'access_token_validity', type: 'BIGINT UNSIGNED', remarks: '客户端特定的AccessToken超时时间')
            column(name: 'refresh_token_validity', type: 'BIGINT UNSIGNED', remarks: '客户端特定的RefreshToken超时时间')
            column(name: 'additional_information', type: 'VARCHAR(1024)', remarks: '客户端附加信息')
            column(name: 'auto_approve', type: 'VARCHAR(32)', defaultValue: "default", remarks: '自动授权范围列表')

            column(name: "object_version_number", type: "BIGINT UNSIGNED", defaultValue: "1")
            column(name: "created_by", type: "BIGINT UNSIGNED", defaultValue: "0")
            column(name: "creation_date", type: "DATETIME", defaultValueComputed: "CURRENT_TIMESTAMP")
            column(name: "last_updated_by", type: "BIGINT UNSIGNED", defaultValue: "0")
            column(name: "last_update_date", type: "DATETIME", defaultValueComputed: "CURRENT_TIMESTAMP")
        }
    }
}