package script.db

databaseChangeLog(logicalFilePath: 'script/db/iam_group.groovy') {
    changeSet(author: 'jcalaz@163.com', id: '2018-03-21-iam-group') {
        createTable(tableName: "iam_group") {
            column(name: 'id', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true)
            }
            column(name: 'name', type: 'VARCHAR(32)', remarks: '组名称') {
                constraints(nullable: false, unique: true)
            }
            column(name: 'code', type: 'VARCHAR(32)', remarks: '组code') {
                constraints(nullable: false, unique: true)
            }
            column(name: 'description', type: 'VARCHAR(128)', remarks: '组描述') {
                constraints(nullable: false)
            }
            column(name: 'organization_id', type: 'BIGINT UNSIGNED', remarks: '组织id') {
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
    }
}