package script.db

databaseChangeLog(logicalFilePath: 'script/db/fd_language.groovy') {
    changeSet(author: 'superleader8@gmail.com', id: '2018-03-19-fd-language') {
        if(helper.dbType().isSupportSequence()){
            createSequence(sequenceName: 'fd_language_s', startValue:"1")
        }
        createTable(tableName: 'fd_language') {
            column(name: 'id', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true)
            }
            column(name: "code", type: 'VARCHAR(32)', remarks: '语言Code') {
                constraints(unique: true)
                constraints(nullable: false)
            }
            column(name: 'name', type: 'VARCHAR(32)', remarks: '语言名称') {
                constraints(unique: true)
                constraints(nullable: false)
            }
            column(name: "description", type: 'VARCHAR(128)', remarks: '描述')

            column(name: "object_version_number", type: "BIGINT UNSIGNED", defaultValue: "1")
            column(name: "created_by", type: "BIGINT UNSIGNED", defaultValue: "0")
            column(name: "creation_date", type: "DATETIME", defaultValueComputed: "CURRENT_TIMESTAMP")
            column(name: "last_updated_by", type: "BIGINT UNSIGNED", defaultValue: "0")
            column(name: "last_update_date", type: "DATETIME", defaultValueComputed: "CURRENT_TIMESTAMP")
        }

        createTable(tableName: 'fd_language_tl') {
            column(name: "id", type: 'BIGINT UNSIGNED', remarks: 'fd_language id') {
                constraints(nullable: false)
            }
            column(name: 'lang', type: 'VARCHAR(16)', remarks: '语言名称') {
                constraints(nullable: false)
            }
            column(name: "description", type: 'VARCHAR(255)', remarks: '描述')

        }
        addPrimaryKey(tableName: 'fd_language_tl', columnNames: 'id, lang')
    }
}