package script.db

databaseChangeLog(logicalFilePath: 'event_consumer_record.groovy') {
    changeSet(id: '2018-02-06-add-table-event_consumer_record', author: 'flyleft') {
        if(helper.dbType().isSupportSequence()){
            createSequence(sequenceName: 'EVENT_CONSUMER_RECORD_S', startValue:"1")
        }
        createTable(tableName: "EVENT_CONSUMER_RECORD") {
            column(name: 'UUID', type: 'VARCHAR(50)', autoIncrement: false, remarks: 'uuid') {
                constraints(primaryKey: true)
            }
            column(name: 'CREATE_TIME', type: 'DATETIME', remarks: '创建时间')
        }
    }

    changeSet(author: 'superlee', id: '2019-07-18-event-consumer-record-add-remark') {
        setTableRemarks(tableName:"EVENT_CONSUMER_RECORD",remarks: "事件消费记录")
    }
}