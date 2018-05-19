package script.db

databaseChangeLog(logicalFilePath: 'script/db/iam_permission.groovy') {
    changeSet(author: 'guokai.wu.work@gmail.com', id: '2018-04-02-iam-permission') {
        createTable(tableName: "iam_permission") {
            column(name: 'id', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true)
            }
            column(name: 'code', type: 'VARCHAR(128)', remarks: '权限的标识') {
                constraints(nullable: false, unique: true)
            }

            column(name: 'path', type: 'VARCHAR(128)', remarks: '权限对应的api路径') {
                constraints(nullable: false)
            }

            column(name: 'method', type: 'VARCHAR(64)', remarks: '请求的http方法') {
                constraints(nullable: false)
            }

            column(name: 'level', type: 'VARCHAR(64)', remarks: '权限的层级') {
                constraints(nullable: false)
            }

            column(name: 'description', type: 'VARCHAR(1024)', remarks: '权限描述')

            column(name: 'action', type: 'VARCHAR(64)', remarks: '权限对应的方法名') {
                constraints(nullable: false)
            }

            column(name: 'resource', type: 'VARCHAR(128)', remarks: '权限资源类型') {
                constraints(nullable: false)
            }

            column(name: 'public_access', type: 'TINYINT UNSIGNED', remarks: '是否公开的权限') {
                constraints(nullable: false)
            }

            column(name: 'login_access', type: 'TINYINT UNSIGNED', remarks: '是否需要登录才能访问的权限') {
                constraints(nullable: false)
            }

            column(name: 'service_name', type: 'VARCHAR(128)', remarks: '权限所在的服务名称') {
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
        addUniqueConstraint(tableName: 'iam_permission', columnNames: 'action,resource,service_name')
        addUniqueConstraint(tableName: 'iam_permission', columnNames: 'path,level,service_name,method,code')
    }
}