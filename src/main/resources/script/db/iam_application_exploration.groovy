package script.db

databaseChangeLog(logicalFilePath: 'script/db/iam_application_exploration.groovy') {
    changeSet(author: 'superlee', id: '2018-03-12-iam-application-exploration') {
        if (helper.dbType().isSupportSequence()) {
            createSequence(sequenceName: 'IAM_APPLICATION_EXPLORATION_S', startValue: "1")
        }
        createTable(tableName: "IAM_APPLICATION_EXPLORATION") {
            column(name: 'ID', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true, primaryKeyName: 'PK_IAM_APPLICATION_EXPLO')
            }
            column(name: 'APPLICATION_ID', type: 'BIGINT UNSIGNED', remarks: '应用id') {
                constraints(nullable: false)
            }
            column(name: 'PATH', type: 'VARCHAR(4000)', remarks: '应用路径，从根节点到当前节点的application_id路径，实例：1/或1/2/3/或1/4/5/等') {
                constraints(nullable: false)
            }
            column(name: 'ROOT_ID', type: 'BIGINT UNSIGNED', remarks: '当前节点的根节点id，如果自己是根节点，则是自己的id') {
                constraints(nullable: false)
            }
            column(name: 'PARENT_ID', type: 'BIGINT UNSIGNED', remarks: '父节点id，没有父节点则为null')
            column(name: 'HASHCODE', type: 'VARCHAR(64)', remarks: 'path路径的hash值，可能存在hash碰撞，碰撞的情况下在比较path') {
                constraints(nullable: false)
            }
            column(name: 'IS_ENABLED', type: 'TINYINT UNSIGNED', defaultValue: "1", remarks: '是否启用。默认为1表示启用') {
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
        addUniqueConstraint(tableName: 'IAM_APPLICATION_EXPLORATION', columnNames: 'APPLICATION_ID, PARENT_ID', constraintName: 'PK_IAM_APPLICATION_EXPLO_U1')
    }

    changeSet(author: 'superlee', id: '2018-03-14-iam-application-exploration-remove-unique-constraint') {
        dropUniqueConstraint(tableName:'IAM_APPLICATION_EXPLORATION', constraintName:'PK_IAM_APPLICATION_EXPLO_U1')
    }

    changeSet(author: 'superlee', id: '2019-07-18-iam-application-exploration-add-remark') {
        setTableRemarks(tableName:"IAM_APPLICATION_EXPLORATION",remarks: "应用探测表，用于记录应用的路径信息，父子关系等")
    }
}