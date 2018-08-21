package script.db

databaseChangeLog(logicalFilePath: 'script/db/event_producer_record.groovy') {
    changeSet(id: '2018-05-18-add-table-event-producer-record', author: 'superleader8@gmail.com') {
        if(helper.dbType().isSupportSequence()){
            createSequence(sequenceName: 'event_producer_record_s', startValue:"1")
        }
        createTable(tableName: "event_producer_record") {
            column(name: 'uuid', type: 'VARCHAR(50)', autoIncrement: false, remarks: 'uuid') {
                constraints(primaryKey: true)
            }
            column(name: 'type', type: 'VARCHAR(50)', remarks: '业务类型') {
                constraints(nullable: false)
            }
            column(name: 'create_time', type: 'DATETIME', remarks: '创建时间')
        }
    }
}