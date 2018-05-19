package script.db

databaseChangeLog(logicalFilePath: 'oauth_code.groovy') {
    changeSet(author: 'guokai.wu.work@gmail.com', id: '2018-03-26-oauth_code') {
        createTable(tableName: "oauth_code") {
            column(name: 'code', type: 'VARCHAR(32)', remarks: 'Code') {
                constraints(primaryKey: true)
            }
            column(name: 'authentication', type: 'BLOB', remarks: '授权对象')
        }
    }
}