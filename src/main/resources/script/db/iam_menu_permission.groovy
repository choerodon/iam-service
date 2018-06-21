package script.db

databaseChangeLog(logicalFilePath: 'script/db/iam_menu_permission.groovy') {
    changeSet(author: 'guokai.wu.work@gmail.com', id: '2018-04-03-iam-menu-permission') {
        createTable(tableName: "iam_menu_permission") {
            column(name: 'id', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true)
            }
            column(name: 'menu_id', type: 'BIGINT UNSIGNED', remarks: '菜单id')
            column(name: 'permission_id', type: 'BIGINT UNSIGNED', remarks: '权限id')
        }
        addUniqueConstraint(tableName: 'iam_menu_permission', columnNames: 'menu_id, permission_id')
    }

    changeSet(author: 'jcalaz@163.com', id: '2018-06-21-iam-menu-permission-code') {
        dropTable(tableName: 'iam_menu_permission')
        createTable(tableName: "iam_menu_permission") {
            column(name: 'id', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true)
            }
            column(name: 'menu_id', type: 'BIGINT UNSIGNED', remarks: '菜单id')
            column(name: 'permission_code', type: 'VARCHAR(128)', remarks: '权限的标识')
        }
        addUniqueConstraint(tableName: 'iam_menu_permission', columnNames: 'menu_id, permission_code')
    }
}
