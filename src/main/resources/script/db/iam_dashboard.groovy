package script.db

databaseChangeLog(logicalFilePath: 'script/db/iam_dashboard.groovy') {
    changeSet(author: 'fan@choerodon.io', id: '2018-07-23-iam-dashboard') {
        createTable(tableName: "iam_dashboard") {
            column(name: 'id', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true)
            }
            column(name: 'code', type: 'VARCHAR(128)', remarks: '编码') {
                constraints(nullable: true)
            }
            column(name: 'name', type: 'VARCHAR(128)', remarks: '名称') {
                constraints(nullable: true)
            }
            column(name: 'title', type: 'VARCHAR(128)', remarks: '标题') {
                constraints(nullable: true)
            }
            column(name: 'namespace', type: 'VARCHAR(128)', remarks: '图标') {
                constraints(nullable: true)
            }
            column(name: 'level', type: 'VARCHAR(64)', remarks: '层级：site / organization / project') {
                constraints(nullable: true)
            }
            column(name: 'description', type: 'VARCHAR(255)', remarks: '描述')
            column(name: 'icon', type: 'VARCHAR(128)', remarks: '图标')
            column(name: 'sort', type: 'BIGINT UNSIGNED', remarks: 'Dashboard顺序')
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
        addUniqueConstraint(tableName: 'iam_dashboard', columnNames: 'code, namespace')
    }
    changeSet(author: 'fan@choerodon.io', id: '2018-03-29-iam-dashboard-tl') {
        createTable(tableName: "iam_dashboard_tl") {
            column(name: 'lang', type: 'VARCHAR(16)', remarks: '语言名称') {
                constraints(primaryKey: true)
            }
            column(name: 'id', type: 'BIGINT UNSIGNED', remarks: '资源ID') {
                constraints(primaryKey: true)
            }
            column(name: 'name', type: 'VARCHAR(64)', remarks: 'dashboard名')
        }
    }
}