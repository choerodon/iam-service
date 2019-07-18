package script.db

databaseChangeLog(logicalFilePath: 'iam_application.groovy') {
    changeSet(id: '2018-03-05-create-table-iam_application', author: 'superlee') {
        if (helper.dbType().isSupportSequence()) {
            createSequence(sequenceName: 'IAM_APPLICATION_S', startValue: "1")
        }
        createTable(tableName: "IAM_APPLICATION") {
            column(name: 'ID', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true, primaryKeyName: 'PK_IAM_APPLICATION')
            }
            column(name: 'ORGANIZATION_ID', type: 'BIGINT UNSIGNED', remarks: '组织id') {
                constraints(nullable: false)
            }
            column(name: 'PROJECT_ID', type: 'BIGINT UNSIGNED', defaultValue: '0', remarks: '项目id，非空，0代表应用没有选择项目') {
                constraints(nullable: false)
            }
            column(name: 'NAME', type: 'VARCHAR(20)', remarks: '应用名称') {
                constraints(nullable: false)
            }

            column(name: 'CODE', type: 'VARCHAR(30)', remarks: '应用编码') {
                constraints(nullable: false)
            }

            column(name: 'IS_ENABLED', type: 'TINYINT UNSIGNED', defaultValue: "1", remarks: '是否启用。1启用，0未启用') {
                constraints(nullable: false)
            }

            column(name: 'APPLICATION_CATEGORY', type: 'VARCHAR(64)', remarks: '应用被划分为哪些类别(普通应用:application;组合应用:combination-application等)') {
                constraints(nullable: false)
            }
            column(name: 'APPLICATION_TYPE', type: 'VARCHAR(64)', remarks: '应用的分类(开发应用:normal;测试应用:test)') {
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
        //如果有项目，code在项目下唯一，如果没项目，code在组织下唯一
        addUniqueConstraint(tableName: 'IAM_APPLICATION', columnNames: 'ORGANIZATION_ID,PROJECT_ID,CODE',
                constraintName: 'UK_IAM_APPLICATION_U1')
        //name在组织下唯一
        addUniqueConstraint(tableName: 'IAM_APPLICATION', columnNames: 'ORGANIZATION_ID,NAME',
                constraintName: 'UK_IAM_APPLICATION_U2')
    }

    changeSet(id: '2018-03-19-modify-unique-column', author: 'superlee') {
        dropUniqueConstraint(tableName: 'IAM_APPLICATION', constraintName: 'UK_IAM_APPLICATION_U2')
        //name在组织和项目下唯一
        addUniqueConstraint(tableName: 'IAM_APPLICATION', columnNames: 'ORGANIZATION_ID,NAME,PROJECT_ID',
                constraintName: 'UK_IAM_APPLICATION_U3')
    }

    changeSet(id: '2019-05-16-iam-application-add-column', author: 'qiang.zeng') {
        addColumn(tableName: 'IAM_APPLICATION') {
            column(name: 'IS_ABNORMAL', type: 'TINYINT UNSIGNED', defaultValue: "0", afterColumn: 'APPLICATION_TYPE', remarks: '是否异常。1异常，0正常')
        }
    }

    changeSet(id: '2019-05-16-iam-application-drop-not-null', author: 'superlee') {
        dropNotNullConstraint(columnDataType: 'VARCHAR(64)', columnName: 'APPLICATION_TYPE', tableName: 'IAM_APPLICATION')
    }

    changeSet(id: '2019-06-06-iam-application-add-column', author: 'jiameng.cao') {
        addColumn(tableName: 'IAM_APPLICATION') {
            column(name: 'APPLICATION_TOKEN', type: 'VARCHAR(64)', afterColumn: 'APPLICATION_TYPE', remarks: '应用生成的token，用于feedback确定应用身份') {
                constraints(nullable: true)
            }
        }
    }

    changeSet(id: '2019-07-10-iam-application-add-unique-constraint', author: 'superlee') {
        addUniqueConstraint(tableName: 'IAM_APPLICATION', columnNames: 'APPLICATION_TOKEN',
                constraintName: 'UK_IAM_APPLICATION_U4')
    }

    changeSet(author: 'superlee', id: '2019-07-18-iam-application-add-remark') {
        setTableRemarks(tableName:"IAM_APPLICATION",remarks: "应用表")
    }
}