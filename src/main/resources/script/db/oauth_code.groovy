package script.db

databaseChangeLog(logicalFilePath: 'oauth_code.groovy') {
    changeSet(author: 'guokai.wu.work@gmail.com', id: '2018-03-26-oauth_code') {
        createTable(tableName: "OAUTH_CODE") {
            column(name: 'CODE', type: 'VARCHAR(32)', remarks: 'Code') {
                constraints(primaryKey: true, primaryKeyName: 'PK_OAUTH_CODE')
            }
            column(name: 'AUTHENTICATION', type: 'BLOB', remarks: '授权对象')
        }
    }

    changeSet(author: 'superlee', id: '2019-04-24-oauth-code-add-column') {
        addColumn(tableName: 'OAUTH_CODE') {
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

    changeSet(author: 'superlee', id: '2019-07-18-oauth-code-add-remark') {
        setTableRemarks(tableName:"OAUTH_CODE",remarks: "oauth授权码表")
    }
}