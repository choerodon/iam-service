package script.db

databaseChangeLog(logicalFilePath: 'script/db/iam_user_dashboard.groovy') {
    changeSet(author: 'fan@choerodon.io', id: '2018-07-23-iam-user-dashboard') {
        if(helper.dbType().isSupportSequence()){
            createSequence(sequenceName: 'iam_user_dashboard_s', startValue:"1")
        }
        createTable(tableName: "iam_user_dashboard") {
            column(name: 'id', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true)
            }
            column(name: 'user_id', type: 'BIGINT UNSIGNED', remarks: 'user id') {
                constraints(nullable: true)
            }
            column(name: 'dashboard_id', type: 'BIGINT UNSIGNED', remarks: 'dashboard id') {
                constraints(nullable: true)
            }
            column(name: 'is_visible', type: 'TINYINT UNSIGNED', defaultValue: "1", remarks: '是否可见') {
                constraints(nullable: true)
            }
            column(name: 'sort', type: 'VARCHAR(128)', remarks: '顺序') {
                constraints(nullable: true)
            }
            column(name: 'level', type: 'VARCHAR(64)', remarks: '层级：site / organization / project') {
                constraints(nullable: true)
            }
            column(name: 'source_id', type: 'BIGINT UNSIGNED', remarks: '对应项目/组织 id')

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