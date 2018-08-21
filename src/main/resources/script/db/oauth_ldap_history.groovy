package script.db

databaseChangeLog(logicalFilePath: 'script/db/oauth_ldap_history.groovy') {
    changeSet(author: 'superleader8@gmail.com', id: '2018-06-06-oauth-ldap-history') {
        if(helper.dbType().isSupportSequence()){
            createSequence(sequenceName: 'oauth_ldap_history_s', startValue:"1")
        }
        createTable(tableName: "oauth_ldap_history") {
            column(name: 'id', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true)
            }
            column(name: 'ldap_id', type: 'BIGINT UNSIGNED', remarks: 'ldap id') {
                constraints(nullable: false)
            }
            column(name: 'new_user_count', type: "INTEGER UNSIGNED", remarks: '同步用户新增数量')
            column(name: 'update_user_count', type: "INTEGER UNSIGNED", remarks: '同步用户更新数量')
            column(name: 'error_user_count', type: "INTEGER UNSIGNED", remarks: '同步用户失败数量')
            column(name: "sync_begin_time", type: "DATETIME", remarks: '同步开始时间')
            column(name: "sync_end_time", type: "DATETIME", remarks: '同步结束时间')

            column(name: "object_version_number", type: "BIGINT UNSIGNED", defaultValue: "1") {
                constraints(nullable: true)
            }
            column(name: "created_by", type: "BIGINT UNSIGNED", defaultValue: "0") {
                constraints(nullable: true)
            }
            column(name: "creation_date", type: "DATETIME", defaultValueComputed: "CURRENT_TIMESTAMP")
            column(name: "last_updated_by", type: "BIGINT UNSIGNED", defaultValue: "0") {
                constraints(nullable: true)
            }
            column(name: "last_update_date", type: "DATETIME", defaultValueComputed: "CURRENT_TIMESTAMP")
        }
    }
}