package script.db

databaseChangeLog(logicalFilePath: 'script/db/iam_book_mark.groovy') {
    changeSet(author: 'youquandeng1@gmail.com', id: '2018-11-05-iam-book-mark') {
        if (helper.dbType().isSupportSequence()) {
            createSequence(sequenceName: 'IAM_BOOK_MARK_S', startValue: "1")
        }
        createTable(tableName: "IAM_BOOK_MARK") {
            column(name: 'ID', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true, primaryKeyName: 'PK_IAM_BOOK_MARK')
            }
            column(name: 'NAME', type: 'VARCHAR(64)', remarks: '书签名称') {
                constraints(nullable: false)
            }
            column(name: 'URL', type: 'VARCHAR(255)', remarks: '书签url') {
                constraints(nullable: false)
            }
            column(name: 'ICON', type: 'VARCHAR(128)', remarks: '图标的code值') {
                constraints(nullable: false)
            }
            column(name: 'COLOR', type: 'VARCHAR(32)', remarks: '图标的颜色')
            column(name: 'SORT', type: 'BIGINT UNSIGNED', remarks: '书签顺序') {
                constraints(nullable: false)
            }
            column(name: 'USER_ID', type: 'BIGINT UNSIGNED', remarks: '用户ID') {
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

    changeSet(author: 'superlee', id: '2019-07-18-iam-book-mark-add-remark') {
        setTableRemarks(tableName:"IAM_BOOK_MARK",remarks: "书签表")
    }
}