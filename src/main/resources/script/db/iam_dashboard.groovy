package script.db

databaseChangeLog(logicalFilePath: 'script/db/iam_dashboard.groovy') {
    changeSet(author: 'fan@choerodon.io', id: '2018-07-23-iam-dashboard') {
        if(helper.dbType().isSupportSequence()){
            createSequence(sequenceName: 'IAM_DASHBOARD_S', startValue:"1")
        }
        createTable(tableName: "IAM_DASHBOARD") {
            column(name: 'ID', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true)
            }
            column(name: 'CODE', type: 'VARCHAR(128)', remarks: '编码') {
                constraints(nullable: true)
            }
            column(name: 'NAME', type: 'VARCHAR(128)', remarks: '名称') {
                constraints(nullable: true)
            }
            column(name: 'TITLE', type: 'VARCHAR(128)', remarks: '标题') {
                constraints(nullable: true)
            }
            column(name: 'NAMESPACE', type: 'VARCHAR(128)', remarks: '图标') {
                constraints(nullable: true)
            }
            column(name: 'LEVEL', type: 'VARCHAR(64)', remarks: '层级：site / organization / project') {
                constraints(nullable: true)
            }
            column(name: 'DESCRIPTION', type: 'VARCHAR(255)', remarks: '描述')
            column(name: 'ICON', type: 'VARCHAR(128)', remarks: '图标')
            column(name: 'SORT', type: 'BIGINT UNSIGNED', remarks: 'Dashboard顺序')
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
        addUniqueConstraint(tableName: 'IAM_DASHBOARD', columnNames: 'CODE, NAMESPACE')
    }
    changeSet(author: 'fan@choerodon.io', id: '2018-03-29-iam-dashboard-tl') {
        createTable(tableName: "IAM_DASHBOARD_TL") {
            column(name: 'LANG', type: 'VARCHAR(16)', remarks: '语言名称') {
                constraints(primaryKey: true)
            }
            column(name: 'ID', type: 'BIGINT UNSIGNED', remarks: '资源ID') {
                constraints(primaryKey: true)
            }
            column(name: 'NAME', type: 'VARCHAR(64)', remarks: 'dashboard名')
        }
    }
}