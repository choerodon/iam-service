package script.db

databaseChangeLog(logicalFilePath: 'oauth_access_token.groovy') {
    changeSet(author: 'guokai.wu.work@gmail.com', id: '2018-03-26-oauth_access_token') {
        createTable(tableName: "oauth_access_token") {
            column(name: 'token_id', type: 'VARCHAR(128)', remarks: 'Access Token ID') {
                constraints(primaryKey: true)
            }
            column(name: 'token', type: 'BLOB', remarks: 'Token对象')
            column(name: 'authentication_id', type: 'VARCHAR(255)', remarks: '授权ID，用于索引授权对象')
            column(name: 'user_name', type: 'VARCHAR(32)', remarks: '用户名')
            column(name: 'client_id', type: 'VARCHAR(32)', remarks: 'Client ID')
            column(name: 'authentication', type: 'BLOB', remarks: '授权对象')
            column(name: 'refresh_token', type: 'VARCHAR(128)', remarks: 'Refresh Token ID')
        }
    }
}