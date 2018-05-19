package script.db

databaseChangeLog(logicalFilePath: 'script/db/oauth_ldap.groovy') {
    changeSet(author: 'guokai.wu.work@gmail.com', id: '2018-04-17-oauth-ldap') {
        createTable(tableName: "oauth_ldap") {
            column(name: 'id', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true)
            }
            column(name: 'name', type: 'VARCHAR(64)', remarks: 'ldap的名称') {
                constraints(nullable: false)
            }
            column(name: 'organization_id', type: 'BIGINT UNSIGNED', remarks: '组织id') {
                constraints(nullable: false, unique: true)
            }
            column(name: 'server_address', type: 'VARCHAR(64)', remarks: 'ldap服务器地址') {
                constraints(nullable: false)
            }
            column(name: 'encryption', type: 'VARCHAR(32)', remarks: '加密传输方式，可以为空')
            column(name: 'status', type: 'VARCHAR(8)', remarks: '状态')
            column(name: 'base_dn', type: 'VARCHAR(255)', remarks: '基础DN')
            column(name: 'ldap_attribute_name', type: 'VARCHAR(255)', remarks: '认证名')
            column(name: 'domain', type: 'VARCHAR(64)', remarks: '域名')
            column(name: 'description', type: 'VARCHAR(255)', remarks: '描述')

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