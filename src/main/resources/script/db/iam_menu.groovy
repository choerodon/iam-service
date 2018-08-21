package script.db

databaseChangeLog(logicalFilePath: 'script/db/iam_menu.groovy') {
    changeSet(author: 'guokai.wu.work@gmail.com', id: '2018-03-29-iam-menu') {
        if(helper.dbType().isSupportSequence()){
            createSequence(sequenceName: 'iam_menu_s', startValue:"1")
        }
        createTable(tableName: "iam_menu") {
            column(name: 'id', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true)
            }
            column(name: 'code', type: 'VARCHAR(128)', remarks: '菜单的标识') {
                constraints(nullable: false)
            }

            column(name: 'name', type: 'VARCHAR(128)', remarks: '菜单名') {
                constraints(nullable: false)
            }
            column(name: 'level', type: 'VARCHAR(64)', remarks: '菜单层级') {
                constraints(nullable: false)
            }
            column(name: 'parent_id', type: 'BIGINT UNSIGNED', remarks: '父级菜单id') {
                constraints(nullable: false)
            }
            column(name: 'type', type: 'VARCHAR(64)', remarks: '菜单类型， 包括三种（root, dir, menu）') {
                constraints(nullable: false)
            }
            column(name: 'sort', type: 'BIGINT UNSIGNED', remarks: '菜单顺序')
            column(name: 'is_default', type: 'TINYINT UNSIGNED', defaultValue: "1", remarks: '是否是默认菜单,0不是默认菜单，1是默认菜单') {
                constraints(nullable: false)
            }

            column(name: 'icon', type: 'VARCHAR(128)', remarks: '图标的code值')
            column(name: 'route', type: 'VARCHAR(128)', remarks: '路由')

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
        addUniqueConstraint(tableName: 'iam_menu', columnNames: 'code, type, level')
    }

    changeSet(author: 'guokai.wu.work@gmail.com', id: '2018-03-29-iam-menu-tl') {
        createTable(tableName: "iam_menu_tl") {
            column(name: 'lang', type: 'VARCHAR(16)', remarks: '语言名称') {
                constraints(primaryKey: true)
            }
            column(name: 'id', type: 'BIGINT UNSIGNED', remarks: '资源ID') {
                constraints(primaryKey: true)
            }
            column(name: 'name', type: 'VARCHAR(64)', remarks: '菜单名')
        }
    }
}