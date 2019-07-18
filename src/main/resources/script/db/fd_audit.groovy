package script.db

databaseChangeLog(logicalFilePath: 'script/db/fd_audit.groovy') {
    changeSet(author: 'longhe1996@icloud.com', id: '2019-01-03-fd-audit') {
        if (helper.dbType().isSupportSequence()) {
            createSequence(sequenceName: 'FD_AUDIT_S', startValue: "1")
        }
        createTable(tableName: "FD_AUDIT") {
            column(name: 'ID', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1。') {
                constraints(primaryKey: true, primaryKeyName: 'PK_FD_AUDIT')
            }
            column(name: 'USER_ID', type: 'BIGINT UNSIGNED', remarks: '用户ID。') {
                constraints(nullable: false)
            }
            column(name: 'TYPE', type: 'VARCHAR(128)', remarks: '操作类型。create，update，delete，unknown.') {
                constraints(nullable: false)
            }
            column(name: 'BUSINESS_TYPE', type: 'VARCHAR(128)', remarks: '业务类型。登录、登出、更新环境等，可为空。')

            column(name: 'DATA_TYPE', type: 'VARCHAR(128)', remarks: '数据类型。服务名+数据，eg.: iam-service.user。')

            column(name: 'MESSAGE', type: 'VARCHAR(255)', remarks: '操作数据。')

            column(name: "LAST_UPDATE_DATE", type: "DATETIME", defaultValueComputed: "CURRENT_TIMESTAMP", remarks: "更新时间")

            column(name: "OBJECT_VERSION_NUMBER", type: "BIGINT UNSIGNED", defaultValue: "1")
            column(name: "CREATED_BY", type: "BIGINT UNSIGNED", defaultValue: "0")
            column(name: "CREATION_DATE", type: "DATETIME", defaultValueComputed: "CURRENT_TIMESTAMP")
            column(name: "LAST_UPDATED_BY", type: "BIGINT UNSIGNED", defaultValue: "0")
        }
    }

    changeSet(author: 'superlee', id: '2019-07-18-fd-audit-add-remark') {
        setTableRemarks(tableName:"FD_AUDIT",remarks: "审计记录表")
    }
}