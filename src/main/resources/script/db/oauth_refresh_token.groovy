package script.db

databaseChangeLog(logicalFilePath: 'oauth_refresh_token.groovy') {
    changeSet(author: 'guokai.wu.work@gmail.com', id: '2018-03-26-oauth_refresh_token') {
        createTable(tableName: "oauth_refresh_token") {
            column(name: 'token_id', type: 'VARCHAR(128)', remarks: 'Refresh Token ID') {
                constraints(primaryKey: true)
            }
            column(name: 'token', type: 'BLOB', remarks: 'Token对象')
            column(name: 'authentication', type: 'BLOB', remarks: '授权对象')
        }
    }
}