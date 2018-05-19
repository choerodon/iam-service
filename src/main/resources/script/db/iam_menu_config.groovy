package script.db

databaseChangeLog(logicalFilePath: 'script/db/iam_menu_config.groovy') {
    changeSet(author: 'guokai.wu.work@gmail.com', id: '2018-04-03-iam-menu-config') {
        createTable(tableName: "iam_menu_config") {
            column(name: 'id', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true)
            }
            column(name: 'menu_id', type: 'BIGINT UNSIGNED', remarks: '菜单id') {
                constraints(nullable: true)
            }
            column(name: 'domain', type: 'VARCHAR(128)', remarks: '域名')
            column(name: 'devops_service_group', type: 'VARCHAR(128)', remarks: '服务组')
            column(name: 'devops_service_type', type: 'VARCHAR(128)', remarks: '服务类型')
            column(name: 'devops_service_code', type: 'VARCHAR(128)', remarks: '服务代码')

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
