package script.db

databaseChangeLog(logicalFilePath: 'script/db/oauth_password_policy.groovy') {
    changeSet(author: 'guokai.wu.work@gmail.com', id: '2018-04-11-oauth-password-policy') {
        createTable(tableName: "oauth_password_policy") {
            column(name: 'id', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true)
            }
            column(name: 'code', type: 'VARCHAR(64)', remarks: '密码策略标识') {
                constraints(nullable: false, unique: true)
            }

            column(name: 'name', type: 'VARCHAR(64)', remarks: '密码策略名') {
                constraints(nullable: false)
            }
            column(name: 'organization_id', type: 'BIGINT UNSIGNED', remarks: '所属的组织id') {
                constraints(nullable: false, unique: true)
            }
            column(name: 'original_password', type: 'VARCHAR(64)', remarks: '新建用户初始密码')
            column(name: 'min_length', type: 'INT', remarks: '密码最小长度')
            column(name: 'max_length', type: 'INT', remarks: '密码最大长度')
            column(name: 'max_error_time', type: 'INT', remarks: '密码输入最大错误次数')
            column(name: 'digits_count', type: 'INT', remarks: '密码数字的数量')
            column(name: 'lowercase_count', type: 'INT', remarks: '密码小写字母数量')
            column(name: 'uppercase_count', type: 'INT', remarks: '密码大写字母数量')
            column(name: 'special_char_count', type: 'INT', remarks: '密码特殊字符数量')
            column(name: 'not_username', type: 'TINYINT UNSIGNED', defaultValue: '0', remarks: '密码可否和与用户名相同') {
                constraints(nullable: false)
            }
            column(name: 'regular_expression', type: 'VARCHAR(128)', remarks: '密码匹配的正则表达式')
            column(name: 'not_recent_count', type: 'INT', remarks: '是否可以修改为最近使用过的密码')
            column(name: 'enable_password', type: 'TINYINT UNSIGNED', defaultValue: '0', remarks: '开启密码策略') {
                constraints(nullable: false)
            }
            column(name: 'enable_security', type: 'TINYINT UNSIGNED', remarks: '开启登录安全策略', defaultValue: "0") {
                constraints(nullable: false)
            }
            column(name: 'enable_lock', type: 'TINYINT UNSIGNED', defaultValue: '0', remarks: '是否锁定') {
                constraints(nullable: false)
            }
            column(name: 'locked_expire_time', type: 'INT', defaultValue: '0', remarks: '锁定时长(s)') {
                constraints(nullable: false)
            }
            column(name: 'enable_captcha', type: 'TINYINT UNSIGNED', defaultValue: '0', remarks: '启用验证码') {
                constraints(nullable: false)
            }
            column(name: 'max_check_captcha', type: 'INT', defaultValue: '0', remarks: '密码错误多少次需要验证码')  {
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
    }
}