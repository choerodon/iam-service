package script.db

databaseChangeLog(logicalFilePath: 'oauth_refresh_token.groovy') {
    changeSet(author: 'guokai.wu.work@gmail.com', id: '2018-03-26-oauth_refresh_token') {
        createTable(tableName: "OAUTH_REFRESH_TOKEN") {
            column(name: 'TOKEN_ID', type: 'VARCHAR(128)', remarks: 'Refresh Token ID') {
                constraints(primaryKey: true, primaryKeyName: 'TOKEN_ID')
            }
            column(name: 'TOKEN', type: 'BLOB', remarks: 'Token对象')
            column(name: 'AUTHENTICATION', type: 'BLOB', remarks: '授权对象')
        }
    }

    changeSet(author: 'superlee', id: '2019-04-24-oauth-refresh-token-add-column') {
        addColumn(tableName: 'OAUTH_REFRESH_TOKEN') {
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

    changeSet(author: 'superlee', id: '2019-07-18-oauth-refresh-token-add-remark') {
        setTableRemarks(tableName:"OAUTH_REFRESH_TOKEN",remarks: "oauth的refresh token表")
    }
}