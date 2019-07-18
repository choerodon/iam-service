package script.db

databaseChangeLog(logicalFilePath: 'oauth_access_token.groovy') {
    changeSet(author: 'guokai.wu.work@gmail.com', id: '2018-03-26-oauth_access_token') {
        createTable(tableName: "OAUTH_ACCESS_TOKEN") {
            column(name: 'TOKEN_ID', type: 'VARCHAR(128)', remarks: 'Access Token ID') {
                constraints(primaryKey: true, primaryKeyName: 'PK_OAUTH_ACCESS_TOKEN')
            }
            column(name: 'TOKEN', type: 'BLOB', remarks: 'Token对象')
            column(name: 'AUTHENTICATION_ID', type: 'VARCHAR(255)', remarks: '授权ID，用于索引授权对象')
            column(name: 'USER_NAME', type: 'VARCHAR(32)', remarks: '用户名')
            column(name: 'CLIENT_ID', type: 'VARCHAR(32)', remarks: 'Client ID')
            column(name: 'AUTHENTICATION', type: 'BLOB', remarks: '授权对象')
            column(name: 'REFRESH_TOKEN', type: 'VARCHAR(128)', remarks: 'Refresh Token ID')
        }
    }

    changeSet(author: 'superlee', id: '2019-04-24-oauth-access-token-add-column') {
        addColumn(tableName: 'OAUTH_ACCESS_TOKEN') {
            column(name: "OBJECT_VERSION_NUMBER", type: "BIGINT UNSIGNED", defaultValue: "1") {
                constraints(nullable: true)
            }
            column(name: "CREATED_BY", type: "BIGINT UNSIGNED", defaultValue: "0") {
                constraints(nullable: true)
            }
            column(name: "CREATION_DATE", type: "DATETIME", defaultValueComputed: "CURRENT_TIMESTAMP")
            column(name: "LAST_UPDATED_BY", type: "BIGINT UNSIGNED", defaultValue: "0") {
                constraints(nullable: true)
            }
            column(name: "LAST_UPDATE_DATE", type: "DATETIME", defaultValueComputed: "CURRENT_TIMESTAMP")
        }
    }

    changeSet(author: 'superlee', id: '2019-07-18-oauth-access-token-add-remark') {
        setTableRemarks(tableName:"OAUTH_ACCESS_TOKEN",remarks: "oauth认证access token表")
    }
}