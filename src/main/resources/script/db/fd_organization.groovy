package script.db

databaseChangeLog(logicalFilePath: 'script/db/fd_organization.groovy') {
    changeSet(author: 'jcalaz@163.com', id: '2018-03-21-fd-organization') {
        if (helper.dbType().isSupportSequence()) {
            createSequence(sequenceName: 'FD_ORGANIZATION_S', startValue: "1")
        }
        createTable(tableName: "FD_ORGANIZATION") {
            column(name: 'ID', type: 'BIGINT UNSIGNED', autoIncrement: true, remarks: '表ID，主键，供其他表做外键，unsigned bigint、单表时自增、步长为 1') {
                constraints(primaryKey: true, primaryKeyName: 'PK_FD_ORGANIZATION')
            }
            column(name: 'NAME', type: 'VARCHAR(32)', remarks: '组织名') {
                constraints(nullable: false)
            }
            column(name: 'CODE', type: 'VARCHAR(15)', remarks: '组织code') {
                constraints(nullable: false, unique: true, uniqueConstraintName: 'UK_FD_ORGANIZATION_U1')
            }
            column(name: 'IS_ENABLED', type: 'TINYINT UNSIGNED', defaultValue: "1", remarks: '是否启用。1启用，0未启用') {
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

    changeSet(author: 'superleader8@gmail.com', id: '2018-10-10-fd-organization-add') {
        addColumn(tableName: 'FD_ORGANIZATION') {
            column(name: 'USER_ID', type: "BIGINT UNSIGNED", remarks: '创建用户的id', defaultValue: '1', afterColumn: 'IS_ENABLED') {
                constraints(nullable: true)
            }
            column(name: 'ADDRESS', type: "VARCHAR(128)", remarks: '组织的地址', afterColumn: 'USER_ID')
        }
    }

    changeSet(author: 'superleader8@gmail.com', id: '2018-12-18-fd-organization-add') {
        addColumn(tableName: 'FD_ORGANIZATION') {
            column(name: 'IMAGE_URL', type: 'VARCHAR(255)', remarks: '组织图标url', afterColumn: 'ADDRESS')
        }
    }


    changeSet(author: 'longhe1996@icloud.com', id: '2018-01-02-fd-organization-add') {
        addColumn(tableName: 'FD_ORGANIZATION') {
            column(name: 'IS_REGISTER', type: 'TINYINT UNSIGNED', defaultValue: "0", remarks: '是否为注册组织。1.是，0不是', afterColumn: 'IS_ENABLED') {
                constraints(nullable: false)
            }
            column(name: 'SCALE', type: 'TINYINT UNSIGNED', remarks: '组织规模。0：0-30,1：30-100,2：100', afterColumn: 'IMAGE_URL')
        }
    }

    changeSet(author: 'qiang.zeng', id: '2019-05-16-fd-organization-add') {
        addColumn(tableName: 'FD_ORGANIZATION') {
            column(name: 'HOME_PAGE', type: 'VARCHAR(255)', remarks: '组织官网地址', afterColumn: 'SCALE')
        }
    }

    changeSet(author: 'jiameng.cao@hand-china.com', id: '2019-06-04-fd-organization-add-category') {
        addColumn(tableName: 'FD_ORGANIZATION') {
            column(name: 'CATEGORY', type: 'VARCHAR(255)', remarks: '组织类型code', afterColumn: 'HOME_PAGE', defaultValue: 'test')
        }
    }


    changeSet(author: 'jiameng.cao@hand-china.com', id: '2019-06-06-exchange-fd-organization.groovy') {
        dropColumn(tableName: 'FD_ORGANIZATION', columnName: 'CATEGORY')
        addColumn(tableName: 'FD_ORGANIZATION') {
            column(name: 'CATEGORY', type: 'VARCHAR(255)', remarks: '组织类型code', afterColumn: 'HOME_PAGE', defaultValue: 'DEFAULT')
        }
    }

    changeSet(author: 'qiang.zeng@hand-china.com', id: '2019-07-16-fd-organization-add') {
        addColumn(tableName: 'FD_ORGANIZATION') {
            column(name: 'BUSINESS_TYPE', type: 'VARCHAR(50)', remarks: '组织所在行业', afterColumn: 'CATEGORY')
        }
        addColumn(tableName: 'FD_ORGANIZATION') {
            column(name: 'EMAIL_SUFFIX', type: 'VARCHAR(50)', remarks: '组织邮箱后缀', afterColumn: 'BUSINESS_TYPE') {
                constraints(unique: true, uniqueConstraintName: 'UK_FD_ORGANIZATION_U2')
            }
        }
    }

    changeSet(author: 'qiang.zeng@hand-china.com', id: '2019-07-22-fd-organization-change') {
        dropColumn(tableName: 'FD_ORGANIZATION', columnName: 'SCALE')
        addColumn(tableName: 'FD_ORGANIZATION') {
            column(name: 'SCALE', type: 'INT UNSIGNED', remarks: '组织规模', afterColumn: 'IMAGE_URL')
        }
    }

}