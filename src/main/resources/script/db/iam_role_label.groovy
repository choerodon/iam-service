package script.db

databaseChangeLog(logicalFilePath: 'script/db/iam_role_label.groovy') {
    changeSet(author: 'jcalaz@163.com', id: '2018-04-13-iam-role-label') {
        createTable(tableName: "iam_role_label") {
            column(name: 'id', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true)
            }
            column(name: 'role_id', type: 'BIGINT UNSIGNED', remarks: '角色的id') {
                constraints(nullable: false)
            }
            column(name: 'label_id', type: 'BIGINT UNSIGNED', remarks: 'label的id') {
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
        addUniqueConstraint(tableName: 'iam_role_label', columnNames: 'role_id, label_id')
    }
}