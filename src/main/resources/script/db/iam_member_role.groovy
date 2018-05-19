package script.db

databaseChangeLog(logicalFilePath: 'script/db/iam_member_role.groovy') {
    changeSet(author: 'superleader8@gmail.com', id: '2018-03-27-iam-member-role') {
        createTable(tableName: "iam_member_role") {
            column(name: 'id', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true)
            }
            column(name: 'role_id', type: 'BIGINT UNSIGNED', remarks: '角色id') {
                constraints(nullable: false)
            }
            column(name: 'member_id', type: 'BIGINT UNSIGNED', remarks: '成员id,可以是userId,clientId等，与member_type对应') {
                constraints(nullable: false)
            }
            column(name: 'member_type', type: 'VARCHAR(32)', defaultValue: "user", remarks: '成员类型，默认为user')

            column(name: 'source_id', type: 'BIGINT UNSIGNED', remarks: '创建该记录的源id，可以是projectId,也可以是organizarionId等') {
                constraints(nullable: false)
            }
            column(name: 'source_type', type: 'VARCHAR(32)', remarks: '创建该记录的源类型，sit/organization/project/user等') {
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
        addUniqueConstraint(tableName: 'iam_member_role', columnNames: 'role_id, member_id, member_type, source_id, source_type')
    }
}