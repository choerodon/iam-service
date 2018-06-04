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

    changeSet(author: 'superleader8@gmail.com', id: '2018-06-04-oauth-ldap-change-table') {
        dropColumn(tableName: 'oauth_ldap', columnName: 'encryption')
        dropColumn(tableName: 'oauth_ldap', columnName: 'status')
        dropColumn(tableName: 'oauth_ldap', columnName: 'description')
        dropColumn(tableName: 'oauth_ldap', columnName: 'ldap_attribute_name')
        dropColumn(tableName: 'oauth_ldap', columnName: 'domain')
        addColumn(tableName: 'oauth_ldap') {
            column(name: 'port', type: "VARCHAR(8)", defaultValue: "398", remarks: '端口号', afterColumn: 'server_address') {
                constraints(nullable: false)
            }
            column(name: 'use_ssl', type: "BIGINT UNSIGNED", defaultValue: "0", remarks: '使用ssl加密传输方式，默认情况为不使用', afterColumn:'port') {
                constraints(nullable: false)
            }
            column(name: 'is_enabled', type: "BIGINT UNSIGNED", defaultValue: "1", remarks: '是否启用，默认为启用', afterColumn:'use_ssl') {
                constraints(nullable: false)
            }
            column(name: 'is_syncing', type: "BIGINT UNSIGNED", defaultValue: "0", remarks: '是否正在同步，默认为否', afterColumn:'is_enabled') {
                constraints(nullable: false)
            }
            column(name: 'directory_type', type: "VARCHAR(64)", remarks: '目录类型', afterColumn:'base_dn')
            column(name: 'login_name_field', type: "VARCHAR(64)", remarks: 'login_name对应的字段名', defaultValue: 'login_name', afterColumn:'directory_type') {
                constraints(nullable: false)
            }
            column(name: 'real_name_field', type: "VARCHAR(64)", remarks: 'real_name对应的字段名', defaultValue: 'real_name', afterColumn:'login_name_field') {
                constraints(nullable: false)
            }
            column(name: 'email_field', type: "VARCHAR(64)", remarks: 'email对应的字段名', defaultValue: 'email', afterColumn:'real_name_field') {
                constraints(nullable: false)
            }
            column(name: 'password_field', type: "VARCHAR(64)", remarks: 'password对应的字段名', defaultValue: 'password', afterColumn:'email_field') {
                constraints(nullable: false)
            }
            column(name: 'phone_field', type: "VARCHAR(64)", remarks: 'phone对应的字段名', defaultValue: 'phone', afterColumn:'password_field') {
                constraints(nullable: false)
            }
            column(name: 'total_sync_count', type: "INTEGER UNSIGNED", remarks: '累计同步用户数量', afterColumn:'phone_field')
            column(name: "sync_begin_time", type: "DATETIME", remarks: '同步任务开始的时间', defaultValueComputed: "CURRENT_TIMESTAMP", afterColumn:'total_sync_count')
        }
    }

}