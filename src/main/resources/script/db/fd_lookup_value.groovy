package script.db

databaseChangeLog(logicalFilePath: 'script/db/fd_lookup_value.groovy') {
    changeSet(author: 'superleader8@gmail.com', id: '2018-03-19-fd-lookup-value') {
        createTable(tableName: 'fd_lookup_value') {
            column(name: 'id', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true)
            }
            column(name: 'lookup_id', type: 'BIGINT UNSIGNED', remarks: '值名称') {
                constraints(nullable: false)
            }
            column(name: 'code', type: 'VARCHAR(32)', remarks: '代码') {
                constraints(nullable: false)
            }
            column(name: 'description', type: 'VARCHAR(256)', remarks: '描述')

            column(name: "object_version_number", type: "BIGINT UNSIGNED", defaultValue: "1")
            column(name: "created_by", type: "BIGINT UNSIGNED", defaultValue: "0")
            column(name: "creation_date", type: "DATETIME", defaultValueComputed: "CURRENT_TIMESTAMP")
            column(name: "last_updated_by", type: "BIGINT UNSIGNED", defaultValue: "0")
            column(name: "last_update_date", type: "DATETIME", defaultValueComputed: "CURRENT_TIMESTAMP")
        }

        createTable(tableName: 'fd_lookup_value_tl') {
            column(name: 'id', type: 'BIGINT UNSIGNED', remarks: '关联lookup_value id') {
                constraints(nullable: false)
            }
            column(name: 'lang', type: 'VARCHAR(16)', remarks: '语言名称') {
                constraints(nullable: false)
            }
            column(name: 'description', type: 'VARCHAR(255)', remarks: '描述')
        }
        addUniqueConstraint(tableName: 'fd_lookup_value', columnNames: 'code,lookup_id')
        addPrimaryKey(tableName: 'fd_lookup_value_tl', columnNames: 'id, lang')
    }
}