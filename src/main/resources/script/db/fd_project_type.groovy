package script.db

databaseChangeLog(logicalFilePath: 'script/db/fd_project_type.groovy') {
    changeSet(author: 'jcalaz@163.com', id: '2018-11-26-fd-project-type') {
        if (helper.dbType().isSupportSequence()) {
            createSequence(sequenceName: 'FD_PROJECT_TYPE_S', startValue: "1")
        }
        createTable(tableName: "FD_PROJECT_TYPE") {
            column(name: 'ID', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true, primaryKeyName: 'PK_FD_PROJECT_TYPE')
            }
            column(name: 'NAME', type: 'VARCHAR(64)', remarks: '类型名称') {
                constraints(nullable: false)
            }
            column(name: 'CODE', type: 'VARCHAR(128)', remarks: '类型编码') {
                constraints(nullable: false, unique: true, uniqueConstraintName: 'UK_FD_PROJECT_TYPE_CODE')
            }
            column(name: 'DESCRIPTION', type: 'VARCHAR(255)', remarks: '类型描述')

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

    changeSet(author: 'superlee', id: '2019-07-18-fd-project-type-add-remark') {
        setTableRemarks(tableName:"FD_PROJECT_TYPE",remarks: "项目类型表")
    }
}