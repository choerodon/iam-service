package script.db

databaseChangeLog(logicalFilePath: 'script/db/iam_label.groovy') {
    changeSet(author: 'jcalaz@163.com', id: '2018-04-13-iam-label') {
        createTable(tableName: "iam_label") {
            column(name: 'id', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true)
            }
            column(name: 'name', type: 'VARCHAR(64)', remarks: '名称') {
                constraints(nullable: false)
            }
            column(name: 'type', type: 'VARCHAR(32)', remarks: '类型') {
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
        addUniqueConstraint(tableName: 'iam_label', columnNames: 'name, type')
    }

    changeSet(author: 'superleader8@gmail.com', id: '2018-07-23-iam-label-add-column') {
        addColumn(tableName: 'iam_label') {
            column(name: 'level', type: "VARCHAR(32)", remarks: '层级', afterColumn: 'type') {
                constraints(nullable: false)
            }
            column(name: 'description', type: "VARCHAR(128)", remarks: '描述', afterColumn: 'level')
        }
    }
}