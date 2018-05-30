package script.db

databaseChangeLog(logicalFilePath: 'script/db/iam_user.groovy') {
    changeSet(author: 'jcalaz@163.com', id: '2018-03-21-iam-iam') {
        createTable(tableName: "iam_user") {
            column(name: 'id', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true)
            }
            column(name: 'login_name', type: 'VARCHAR(128)', remarks: '用户名') {
                constraints(nullable: false)
                constraints(unique: true)
            }
            column(name: 'email', type: 'VARCHAR(128)', remarks: '电子邮箱地址') {
                constraints(nullable: false)
                constraints(unique: true)
            }

            column(name: 'organization_id', type: 'BIGINT UNSIGNED', remarks: '组织ID') {
                constraints(nullable: false)
            }
            column(name: 'password', type: 'VARCHAR(128)', remarks: 'Hash后的用户密码') {
                constraints(nullable: false)
            }
            column(name: 'real_name', type: 'VARCHAR(32)', remarks: '用户真实姓名')
            column(name: 'phone', type: 'VARCHAR(32)', remarks: '手机号')
            column(name: 'image_url', type: 'VARCHAR(128)', remarks: '用户头像地址')
            column(name: 'profile_photo', type: 'MEDIUMTEXT', remarks: '用户二进制头像')
            column(name: 'language', type: 'VARCHAR(16)', defaultValue: "zh_CN", remarks: '语言') {
                constraints(nullable: false)
            }
            column(name: 'time_zone', type: 'VARCHAR(16)', defaultValue: "CTT", remarks: '时区') {
                constraints(nullable: false)
            }
            column(name: 'last_password_updated_at', type: 'DATETIME', defaultValueComputed: "CURRENT_TIMESTAMP", remarks: '上一次密码更新时间') {
                constraints(nullable: false)
            }
            column(name: 'last_login_at', type: 'DATETIME', remarks: '上一次登陆时间')
            column(name: 'is_enabled', type: 'TINYINT UNSIGNED', defaultValue: "0", remarks: '用户是否启用。1启用，0未启用') {
                constraints(nullable: false)
            }
            column(name: 'is_locked', type: 'TINYINT UNSIGNED', defaultValue: "0", remarks: '是否锁定账户') {
                constraints(nullable: false)
            }
            column(name: 'is_ldap', type: 'TINYINT UNSIGNED', defaultValue: "0", remarks: '是否是LDAP来源。1是，0不是')
            column(name: 'locked_until_at', type: 'DATETIME', remarks: '锁定账户截止时间')
            column(name: 'password_attempt', type: 'TINYINT UNSIGNED', defaultValue: "0", remarks: '密码输错累积次数')

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
    changeSet(author: 'jcalaz@163.com', id: '2018-05-28-add_column_is_admin') {
        addColumn(tableName: 'iam_user') {
            column(name: 'is_admin', type: 'TINYINT UNSIGNED', defaultValue: "0", remarks: '是否为管理员用户。1表示是，0表示不是')
        }
    }

    changeSet(author: 'superleader8@gmail.com', id: '2018-05-30-drop-is-admin') {
        dropColumn(tableName: 'iam_user', ColumnName: 'is_admin')
        addColumn(tableName: 'iam_user') {
            column(name: 'is_admin', type: 'TINYINT UNSIGNED', defaultValue: "0", remarks: '是否为管理员用户。1表示是，0表示不是', afterColumn: 'is_ldap')
        }
    }
}