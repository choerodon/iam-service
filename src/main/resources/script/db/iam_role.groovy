package script.db

databaseChangeLog(logicalFilePath: 'script/db/iam_role.groovy') {
    changeSet(author: 'jcalaz@163.com', id: '2018-03-21-iam-role') {
        if(helper.dbType().isSupportSequence()){
            createSequence(sequenceName: 'iam_role_s', startValue:"1")
        }
        createTable(tableName: "iam_role") {
            column(name: 'id', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true)
            }
            column(name: 'name', type: 'VARCHAR(64)', remarks: '角色名') {
                constraints(nullable: false)
            }
            column(name: 'code', type: 'VARCHAR(128)', remarks: '角色编码') {
                constraints(nullable: false, unique: true)
            }
            column(name: 'description', type: 'VARCHAR(255)', remarks: '角色描述full description')
            column(name: 'level', type: 'VARCHAR(32)', remarks: '角色级别') {
                constraints(nullable: false)
            }
            column(name: 'is_enabled', type: 'TINYINT UNSIGNED', defaultValue: "1", remarks: '是否启用。1启用，0未启用') {
                constraints(nullable: false)
            }
            column(name: 'is_modified', type: 'TINYINT UNSIGNED', defaultValue: "1", remarks: '是否可以修改。1表示可以，0不可以') {
                constraints(nullable: false)
            }
            column(name: 'is_enable_forbidden', type: 'TINYINT UNSIGNED', defaultValue: "1", remarks: '是否可以被禁用') {
                constraints(nullable: false)
            }
            column(name: 'is_built_in', type: 'TINYINT UNSIGNED', defaultValue: "0", remarks: '是否内置。1表示是，0表示不是') {
                constraints(nullable: false)
            }
            column(name: 'is_assignable', type: 'TINYINT UNSIGNED', defaultValue: "1", remarks: '是否禁止在更高的层次上分配，禁止project role在organization上分配。1表示可以，0表示不可以') {
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

        createTable(tableName: "iam_role_tl") {
            column(name: 'lang', type: 'VARCHAR(8)', remarks: '语言code') {
                constraints(nullable: false)
            }
            column(name: 'id', type: 'BIGINT UNSIGNED', remarks: 'role表id') {
                constraints(nullable: false)
            }
            column(name: 'name', type: 'VARCHAR(64)', remarks: '多语言字段') {
                constraints(nullable: false)
            }
        }
        addPrimaryKey(tableName: 'iam_role_tl', columnNames: 'id, lang')
    }
}