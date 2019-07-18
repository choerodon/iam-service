package script.db

databaseChangeLog(logicalFilePath: 'script/db/oauth_ldap_error_user.groovy') {
    changeSet(author: 'superleader8@gmail.com', id: '2019-01-22-oauth-ldap-error-user') {
        if(helper.dbType().isSupportSequence()){
            createSequence(sequenceName: 'OAUTH_LDAP_ERROR_USER_S', startValue:"1")
        }
        createTable(tableName: "OAUTH_LDAP_ERROR_USER") {
            column(name: 'ID', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true, primaryKeyName: 'PK_OAUTH_LDAP_ERROR_USER')
            }
            column(name: 'LDAP_HISTORY_ID', type: 'BIGINT UNSIGNED', remarks: 'ldap同步历史id') {
                constraints(nullable: false)
            }
            column(name: 'UUID', type: "VARCHAR(128)", remarks: 'ldap对象的唯一标识，可以根据此标识到ldap server查询详细信息') {
                constraints(nullable: false)
            }
            column(name: 'LOGIN_NAME', type: "VARCHAR(128)", remarks: '用户登录名')
            column(name: 'EMAIL', type: "VARCHAR(128)", remarks: '用户邮箱')
            column(name: 'REAL_NAME', type: "VARCHAR(128)", remarks: '真实姓名')
            column(name: "PHONE", type: "VARCHAR(128)", remarks: '手机号')
            column(name: "CAUSE", type: "VARCHAR(128)", remarks: '失败原因')

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

    changeSet(author: 'superlee', id: '2019-07-18-oauth-ldap-error-user-add-remark') {
        setTableRemarks(tableName:"OAUTH_LDAP_ERROR_USER",remarks: "ldap同步失败用户详情表")
    }
}