package script.db

databaseChangeLog(logicalFilePath: 'script/db/fd_project.groovy') {
    changeSet(author: 'jcalaz@163.com', id: '2018-03-21-fd-project') {
        createTable(tableName: "fd_project") {
            column(name: 'id', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true)
            }
            column(name: 'name', type: 'VARCHAR(32)', remarks: '项目名') {
                constraints(nullable: false)
            }
            column(name: 'code', type: 'VARCHAR(14)', remarks: '项目code') {
                constraints(nullable: false, unique: true)
            }
            column(name: 'organization_id', type: 'BIGINT UNSIGNED', remarks: '组织ID')
            column(name: 'is_enabled', type: 'TINYINT UNSIGNED', defaultValue: "1", remarks: '是否启用。1启用，0未启用') {
                constraints(nullable: false)
            }

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
        addUniqueConstraint(tableName: 'fd_project', columnNames: 'code, organization_id')
    }
}