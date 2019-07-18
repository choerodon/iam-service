package script.db

databaseChangeLog(logicalFilePath: 'script/db/iam_system_setting.groovy') {
    changeSet(author: 'zmfblue@qq.com', id: '2018-03-21-iam-system-setting') {
        if (helper.dbType().isSupportSequence()) {
            createSequence(sequenceName: 'IAM_SYSTEM_SETTING_S', startValue: "1")
        }
        createTable(tableName: "IAM_SYSTEM_SETTING") {
            column(name: 'ID', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true, primaryKeyName: 'PK_IAM_SYSTEM_SETTING')
            }
            column(name: 'FAVICON', type: 'VARCHAR(255)', remarks: '平台徽标链接') {
                constraints(nullable: false)
            }
            column(name: 'SYSTEM_LOGO', type: 'VARCHAR(255)', remarks: '平台导航栏图形标链接')
            column(name: 'SYSTEM_NAME', type: 'VARCHAR(100)', remarks: '平台简称') {
                constraints(nullable: false)
            }
            column(name: 'SYSTEM_TITLE', type: 'VARCHAR(255)', remarks: '平台全称')
            column(name: 'DEFAULT_PASSWORD', type: 'VARCHAR(50)', remarks: '平台默认密码') {
                constraints(nullable: false)
            }
            column(name: 'DEFAULT_LANGUAGE', type: 'VARCHAR(50)', remarks: '平台默认语言') {
                constraints(nullable: false)
            }
            column(name: "OBJECT_VERSION_NUMBER", type: "BIGINT UNSIGNED", defaultValue: "1") {
                constraints(nullable: true)
            }
            column(name: "CREATED_BY", type: "BIGINT UNSIGNED", defaultValue: "0") {
                constraints(nullable: true)
            }
            column(name: "CREATION_DATE", type: "DATETIME", defaultValueComputed: "CURRENT_TIMESTAMP")
            column(name: "LAST_UPDATED_BY", type: "BIGINT UNSIGNED", defaultValue: "0") {
                constraints(nullable: true)
            }
            column(name: "LAST_UPDATE_DATE", type: "DATETIME", defaultValueComputed: "CURRENT_TIMESTAMP")
        }
    }

    changeSet(author: 'zmfblue@qq.com', id: '2018-11-23-iam-system-setting-add-columns') {
        addColumn(tableName: 'IAM_SYSTEM_SETTING') {
            column(name: 'MIN_PASSWORD_LENGTH', type: 'INT UNSIGNED', remarks: '不启用组织层密码策略时的密码最小长度', afterColumn: 'DEFAULT_LANGUAGE', defaultValue: 0) {
                constraints(nullable: false)
            }
            column(name: 'MAX_PASSWORD_LENGTH', type: 'INT UNSIGNED', remarks: '不启用组织层密码策略时的密码最大长度', afterColumn: 'MIN_PASSWORD_LENGTH', defaultValue: 65535) {
                constraints(nullable: false)
            }
        }
    }

    changeSet(author: 'superlee', id: '2019-04-08-iam-add-column') {
        addColumn(tableName: 'IAM_SYSTEM_SETTING') {
            column(name: 'REGISTER_ENABLED', type: 'TINYINT UNSIGNED', remarks: '是否启用组织注册功能，默认为0，禁用', afterColumn: 'MAX_PASSWORD_LENGTH', defaultValue: 0) {
                constraints(nullable: false)
            }
            column(name: 'REGISTER_URL', type: 'VARCHAR(255)', remarks: '注册组织链接', afterColumn: 'REGISTER_ENABLED')
        }
    }

    changeSet(author: 'jiameng.cao', id: '2019-06-06-iam-add-column') {
        addColumn(tableName: 'IAM_SYSTEM_SETTING') {
            column(name: 'RESET_GITLAB_PASSWORD_URL', type: 'VARCHAR(255)', remarks: '重置gitlab密码的地址', afterColumn: 'REGISTER_URL') {
                constraints(nullable: true)
            }
        }
    }

    changeSet(author: 'superlee', id: '2019-07-18-iam-system-setting-add-remark') {
        setTableRemarks(tableName:"IAM_SYSTEM_SETTING",remarks: "系统设置表")
    }
}