package script.db

databaseChangeLog(logicalFilePath: 'script/db/iam_role_permission.groovy') {
    changeSet(author: 'guokai.wu.work@gmail.com', id: '2018-04-03-iam-role-permission') {
        createTable(tableName: "iam_role_permission") {
            column(name: 'id', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true)
            }
            column(name: 'role_id', type: 'BIGINT UNSIGNED', remarks: '角色id')
            column(name: 'permission_id', type: 'BIGINT UNSIGNED', remarks: '权限id')
        }
        addUniqueConstraint(tableName: 'iam_role_permission', columnNames: 'role_id, permission_id')
    }
}
