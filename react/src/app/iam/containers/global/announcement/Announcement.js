import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action, configure } from 'mobx';
import moment from 'moment';
import { Button, Table, Modal, Tooltip, Form, DatePicker, Input, Radio } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { Content, Header, Page, Permission } from 'choerodon-boot-combine';
import './Announcement.scss';
import StatusTag from '../../../components/statusTag';
import Editor from '../../../components/editor';
import MouseOverWrapper from '../../../components/mouseOverWrapper';

configure({ enforceActions: false });

// 匹配html界面为空白的正则。
const patternHTMLEmpty = /^(((<[^>]+>)*\s*)|&nbsp;|\s)*$/g;
const inputWidth = '512px';
const iconType = {
  COMPLETED: 'COMPLETED',
  SENDING: 'RUNNING',
  WAITING: 'UN_START',
  // FAILED: 'FAILED',
};
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};
const { Sidebar } = Modal;
// 公用方法类
class AnnouncementType {
  constructor(context) {
    this.context = context;
    const { AppState } = this.context.props;
    this.data = AppState.currentMenuType;
    const { type, id, name } = this.data;
    const codePrefix = type === 'organization' ? 'organization' : 'global';

    this.code = `${codePrefix}.msgrecord`;
    this.values = { name: name || 'Choerodon' };
    this.type = type;
    this.orgId = id;
    this.apiPrefix = '/notify/v1/system_notice';
    this.intlPrefix = `${codePrefix}.announcement`;
    this.intlValue = type === 'organization' ? name : AppState.getSiteInfo.systemName || 'Choerodon';
  }
}


@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class Announcement extends Component {
  state = this.getInitState();

  getInitState() {
    return {
      sendDate: null,
      endDate: null,
    };
  }

  componentWillMount() {
    this.initAnnouncement();
  }

  initAnnouncement = () => {
    const { AnnouncementStore } = this.props;
    this.announcementType = new AnnouncementType(this);
    AnnouncementStore.setAnnouncementType(this.announcementType);
    AnnouncementStore.loadData();
  };

  handleTableChange = (pagination, filters, sort, params) => {
    this.fetchData(pagination, filters, sort, params);
  };

  handleOk = () => {
    const { AnnouncementStore: { editorContent, currentRecord, selectType }, AnnouncementStore, form, intl } = this.props;
    if (selectType !== 'detail') {
      form.validateFields((err, values) => {
        if (!err) {
          AnnouncementStore.setSubmitting(true);
          if (editorContent === null || patternHTMLEmpty.test(editorContent)) {
            AnnouncementStore.setSubmitting(false);
            Choerodon.prompt(intl.formatMessage({ id: 'announcement.content.required' }));
          } else if (editorContent && !patternHTMLEmpty.test(editorContent)) {
            if (selectType === 'create') {
              AnnouncementStore.createAnnouncement({
                ...values,
                content: editorContent,
                sendDate: values.sendDate.format('YYYY-MM-DD HH:mm:ss'),
                endDate: values.endDate && values.endDate.format('YYYY-MM-DD HH:mm:ss'),
              }).then((data) => {
                AnnouncementStore.setSubmitting(false);
                if (!data.failed) {
                  Choerodon.prompt(intl.formatMessage({ id: 'create.success' }));
                  this.handleRefresh();
                  AnnouncementStore.hideSideBar();
                } else {
                  Choerodon.prompt(data.message);
                }
              });
            } else {
              AnnouncementStore.modifyAnnouncement({
                ...values,
                id: currentRecord.id,
                objectVersionNumber: currentRecord.objectVersionNumber,
                scheduleTaskId: currentRecord.scheduleTaskId,
                status: currentRecord.status,
                content: editorContent,
                sendDate: values.sendDate.format('YYYY-MM-DD HH:mm:ss'),
              }).then((data) => {
                AnnouncementStore.setSubmitting(false);
                if (!data.failed) {
                  Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
                  this.handleRefresh();
                  AnnouncementStore.hideSideBar();
                } else {
                  Choerodon.prompt(data.message);
                }
              });
            }
          } else {
            AnnouncementStore.setSubmitting(false);
            Choerodon.prompt(intl.formatMessage({ id: 'announcement.content.required' }));
          }
        } else {
          AnnouncementStore.setSubmitting(false);
        }
      });
    } else {
      AnnouncementStore.hideSideBar();
    }
  };

  handleRefresh = () => {
    this.props.AnnouncementStore.refresh();
  };

  handleCancel = () => {
    this.props.AnnouncementStore.hideSideBar();
    this.setState(this.getInitState());
  };

  handleDelete = (record) => {
    const { intl, AnnouncementStore } = this.props;
    Modal.confirm({
      className: 'c7n-iam-confirm-modal',
      title: intl.formatMessage({ id: 'announcement.delete.title' }, { name: record.title }),
      content: intl.formatMessage({ id: `announcement.delete.content${record.status === 'COMPLETED' ? '.send' : ''}` }),
      onOk: () => AnnouncementStore.deleteAnnouncementById(record.id).then(({ failed, message }) => {
        if (failed) {
          Choerodon.prompt(message);
        } else {
          Choerodon.prompt(intl.formatMessage({ id: 'delete.success' }));
          this.handleRefresh();
        }
      }),
    });
  };

  handleOpen = (selectType, record = {}) => {
    const { AnnouncementStore, form } = this.props;
    form.resetFields();
    if (this.editor) {
      this.editor.initEditor();
    }
    AnnouncementStore.setEditorContent(selectType === 'create' ? null : record.content);
    AnnouncementStore.setCurrentRecord(record);
    AnnouncementStore.setSelectType(selectType);
    AnnouncementStore.showSideBar();
  }

  fetchData(pagination, filters, sort, params) {
    this.props.AnnouncementStore.loadData(pagination, filters, { columnKey: 'id', order: 'descend' }, params);
  }

  getTableColumns() {
    const { intl, AnnouncementStore: { filters } } = this.props;
    const { intlPrefix } = this.announcementType;
    return [
      {
        title: <FormattedMessage id={`${intlPrefix}.table.title`} />,
        dataIndex: 'title',
        key: 'title',
        filters: [],
        filteredValue: filters.title || [],
        width: '10%',
        render: text => (
          <MouseOverWrapper text={text} width={0.1}>
            {text}
          </MouseOverWrapper>
        ),
      },
      {
        title: <FormattedMessage id={`${intlPrefix}.content`} />,
        dataIndex: 'textContent',
        key: 'textContent',
        className: 'nowarp',
      }, {
        title: <FormattedMessage id={'status'} />,
        dataIndex: 'status',
        key: 'status',
        width: '12%',
        filters: Object.keys(iconType).map(value => ({
          text: intl.formatMessage({ id: `announcement.${value.toLowerCase()}` }),
          value,
        })),
        filteredValue: filters.status || [],
        render: status => (
          <StatusTag
            mode="icon"
            name={intl.formatMessage({ id: status ? `announcement.${status.toLowerCase()}` : 'announcement.completed' })}
            colorCode={status ? iconType[status] : iconType.COMPLETED}
          />),
      }, {
        title: <FormattedMessage id={`${intlPrefix}.send-time`} />,
        dataIndex: 'sendDate',
        key: 'sendDate',
        width: '10%',
        render: text => (
          <MouseOverWrapper text={text} width={0.15}>
            {text}
          </MouseOverWrapper>
        ),
      }, {
        title: '',
        width: '14%',
        key: 'action',
        align: 'right',
        render: this.renderAction,
      },
    ];
  }

  renderAction = (text, record) => (
    <React.Fragment>
      {
          record.status === 'WAITING' && (
            <Permission service={['notify-service.system-announcement.update']}>
              <Tooltip
                title={<FormattedMessage id="modify" />}
                placement="bottom"
              >
                <Button
                  size="small"
                  icon="mode_edit"
                  shape="circle"
                  onClick={() => this.handleOpen('modify', record)}
                />
              </Tooltip>
            </Permission>
          )
        }
      <Tooltip
        title={<FormattedMessage id="announcement.detail" />}
        placement="bottom"
      >
        <Button
          shape="circle"
          icon="find_in_page"
          size="small"
          onClick={() => this.handleOpen('detail', record)}
        />
      </Tooltip>
      <Permission service={['notify-service.system-announcement.delete']}>
        <Tooltip
          title={<FormattedMessage id="delete" />}
          placement="bottom"
        >
          <Button
            size="small"
            icon="delete_forever"
            shape="circle"
            onClick={() => this.handleDelete(record)}
          />
        </Tooltip>
      </Permission>
    </React.Fragment>
  );

  renderSidebarOkText() {
    const { AnnouncementStore: { selectType } } = this.props;
    let text;
    switch (selectType) {
      case 'create':
        text = 'create';
        break;
      case 'modify':
        text = 'save';
        break;
      case 'detail':
        text = 'close';
        break;
      default:
        break;
    }
    return <FormattedMessage id={`${text}`} />;
  }

  disabledDate(current) {
    return current < moment().subtract(1, 'days');
  }

  disabledShowDate = (current) => {
    const endDate = moment(this.props.form.getFieldValue('sendDate'));
    if (endDate) {
      return current < endDate.add(1, 'days');
    } else {
      return current < moment().subtract(1, 'days');
    }
  };
  /* 时间选择器处理 -- start */
  disabledStartDate = (sendDate) => {
    const endDate = this.state.endDate;
    if (!sendDate || !endDate) {
      return false;
    }
    if (endDate.format().split('T')[1] === '00:00:00+08:00') {
      return sendDate.format().split('T')[0] >= endDate.format().split('T')[0];
    } else {
      return sendDate.format().split('T')[0] > endDate.format().split('T')[0];
    }
  };

  disabledEndDate = (endDate) => {
    const sendDate = this.state.sendDate;
    if (!endDate || !sendDate) {
      return false;
    }
    return endDate.valueOf() <= sendDate.valueOf();
  };

  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i += 1) {
      result.push(i);
    }
    return result;
  };

  @action
  disabledDateStartTime = (date) => {
    this.sendDates = date;
    if (date && this.endDates && this.endDates.day() === date.day()) {
      if (this.endDates.hour() === date.hour() && this.endDates.minute() === date.minute()) {
        return {
          disabledHours: () => this.range(this.endDates.hour() + 1, 24),
          disabledMinutes: () => this.range(this.endDates.minute() + 1, 60),
          disabledSeconds: () => this.range(this.endDates.second(), 60),
        };
      } else if (this.endDates.hour() === date.hour()) {
        return {
          disabledHours: () => this.range(this.endDates.hour() + 1, 24),
          disabledMinutes: () => this.range(this.endDates.minute() + 1, 60),
        };
      } else {
        return {
          disabledHours: () => this.range(this.endDates.hour() + 1, 24),
        };
      }
    }
  };

  @action
  clearStartTimes = (status) => {
    if (!status) {
      this.endDates = null;
    }
  };

  @action
  clearEndTimes = (status) => {
    if (!status) {
      this.sendDates = null;
    }
  };

  @action
  disabledDateEndTime = (date) => {
    this.endDates = date;
    if (date && this.sendDates && this.sendDates.day() === date.day()) {
      if (this.sendDates.hour() === date.hour() && this.sendDates.minute() === date.minute()) {
        return {
          disabledHours: () => this.range(0, this.sendDates.hour()),
          disabledMinutes: () => this.range(0, this.sendDates.minute()),
          disabledSeconds: () => this.range(0, this.sendDates.second() + 1),
        };
      } else if (this.sendDates.hour() === date.hour()) {
        return {
          disabledHours: () => this.range(0, this.sendDates.hour()),
          disabledMinutes: () => this.range(0, this.sendDates.minute()),
        };
      } else {
        return {
          disabledHours: () => this.range(0, this.sendDates.hour()),
        };
      }
    }
  };

  onStartChange = (value) => {
    this.onChange('sendDate', value);
  };

  onEndChange = (value) => {
    this.onChange('endDate', value);
  };

  onChange = (field, value) => {
    const { setFieldsValue } = this.props.form;
    this.setState({
      [field]: value,
    }, () => {
      setFieldsValue({ [field]: this.state[field] });
    });
  };
  /* 时间选择器处理 -- end */

  renderForm() {
    const {
      AnnouncementStore: { editorContent, selectType, currentRecord }, AnnouncementStore, intl,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const isModify = selectType === 'modify';
    return (
      <div className="c7n-iam-announcement-siderbar-content">
        <Form>
          <FormItem {...formItemLayout}>
            {getFieldDecorator('sendDate', {
              rules: [{
                required: true,
                message: '请输入发送时间',
              }],
              initialValue: isModify ? moment(currentRecord.sendDate) : undefined,
            })(
              <DatePicker
                className="c7n-iam-announcement-siderbar-content-datepicker"
                label={<FormattedMessage id="announcement.send.date" />}
                style={{ width: inputWidth }}
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={this.disabledStartDate}
                disabledTime={this.disabledDateStartTime}
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                getCalendarContainer={that => that}
                onChange={this.onStartChange}
                onOpenChange={this.clearStartTimes}
              />,
            )
              }
          </FormItem>
          <FormItem {...formItemLayout}>
            {getFieldDecorator('sendNotices', {
              rules: [],
              initialValue: isModify ? currentRecord.sendNotices : true,
            })(
              <RadioGroup
                label={<FormattedMessage id="announcement.send.letter" />}
                className="radioGroup"
              >
                <Radio value>{intl.formatMessage({ id: 'yes' })}</Radio>
                <Radio value={false}>{intl.formatMessage({ id: 'no' })}</Radio>
              </RadioGroup>,
            )}
          </FormItem>
          <FormItem {...formItemLayout}>
            {getFieldDecorator('sticky', {
              rules: [],
              initialValue: isModify ? currentRecord.sticky || false : false,
            })(
              <RadioGroup
                label={<FormattedMessage id="announcement.send.is-sticky" />}
                className="radioGroup"
              >
                <Radio value>{intl.formatMessage({ id: 'yes' })}</Radio>
                <Radio value={false}>{intl.formatMessage({ id: 'no' })}</Radio>
              </RadioGroup>,
            )}
          </FormItem>
          {
            getFieldValue('sticky') ? <FormItem {...formItemLayout}>
              {getFieldDecorator('endDate', {
                rules: [{
                  required: true,
                  message: '请输入结束显示时间',
                }],
                initialValue: isModify && currentRecord.endDate ? moment(currentRecord.endDate) : undefined,
              })(
                <DatePicker
                  className="c7n-iam-announcement-siderbar-content-datepicker"
                  label={<FormattedMessage id="announcement.end-date" />}
                  style={{ width: inputWidth }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={this.disabledEndDate}
                  disabledTime={this.disabledDateEndTime}
                  showTime={{ defaultValue: moment() }}
                  getCalendarContainer={that => that}
                  onChange={this.onEndChange}
                  onOpenChange={this.clearEndTimes}
                />,
              )
              }
            </FormItem> : null
          }
          <FormItem {...formItemLayout}>
            {getFieldDecorator('title', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: 'announcement.title.required' }),
              }],
              initialValue: isModify ? currentRecord.title : undefined,
            })(
              <Input autoComplete="off" style={{ width: inputWidth }} label={<FormattedMessage id="announcement.title" />} />,
            )}
          </FormItem>
        </Form>
        <p className="content-text">公告内容：</p>
        <Editor
          value={editorContent}
          onRef={(node) => {
            this.editor = node;
          }}
          onChange={(value) => {
            AnnouncementStore.setEditorContent(value);
          }}
        />
      </div>
    );
  }

  renderDetail({ content, status, sendDate, endDate, sticky }) {
    const { intl } = this.props;
    return (
      <div className="c7n-iam-announcement-detail">
        <div><span>{intl.formatMessage({ id: 'status' })}：</span>
          <div className="inline">
            <StatusTag
              style={{ fontSize: 14, color: 'rgba(0,0,0,0.65)' }}
              mode="icon"
              name={intl.formatMessage({ id: status ? `announcement.${status.toLowerCase()}` : 'announcement.completed' })}
              colorCode={iconType[status]}
            />
          </div>
        </div>
        <div><span>{intl.formatMessage({ id: 'announcement.send.date' })}：</span><span className="send-time">{sendDate}</span></div>
        <div><span>{intl.formatMessage({ id: 'announcement.send.is-sticky' })}：</span><span className="send-time">{intl.formatMessage({ id: sticky ? 'yes' : 'no' })}</span></div>
        {sticky ? <div><span>{intl.formatMessage({ id: 'announcement.end-date' })}：</span><span className="send-time">{endDate}</span></div> : null}
        <div><span>{intl.formatMessage({ id: 'global.announcement.content' })}：</span></div>
        <div className="c7n-iam-announcement-detail-wrapper">
          <div
            className="c7n-iam-announcement-detail-content"
            dangerouslySetInnerHTML={{ __html: `${content}` }}
          />
        </div>
      </div>
    );
  }

  render() {
    const { intl, AnnouncementStore: { announcementData, loading, pagination, params, sidebarVisible, currentRecord, submitting } } = this.props;
    const { intlPrefix } = this.announcementType;
    const { AnnouncementStore: { selectType } } = this.props;
    return (
      <Page
        service={[
          'notify-service.system-announcement.pagingQuery',
          'notify-service.system-announcement.create',
          'notify-service.system-announcement.update',
          'notify-service.system-announcement.delete',
        ]}
      >
        <Header title={<FormattedMessage id={`${intlPrefix}.header.title`} />}>
          <Permission service={['notify-service.system-announcement.create']}>
            <Button
              onClick={() => this.handleOpen('create')}
              icon="playlist_add"
            >
              <FormattedMessage id="announcement.add" />
            </Button>
          </Permission>

          <Button
            onClick={this.handleRefresh}
            icon="refresh"
          >
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content
          code={intlPrefix}
          values={{ name: this.announcementType.intlValue }}
        >
          <Table
            loading={loading}
            className="c7n-iam-announcement"
            columns={this.getTableColumns()}
            dataSource={announcementData.slice()}
            pagination={pagination}
            filters={params}
            onChange={this.handleTableChange}
            rowKey="id"
            filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
          />
          <Sidebar
            title={<FormattedMessage id={`${intlPrefix}.sidebar.title.${selectType}`} />}
            onOk={this.handleOk}
            okText={this.renderSidebarOkText()}
            cancelText={<FormattedMessage id="cancel" />}
            okCancel={selectType !== 'detail'}
            onCancel={this.handleCancel}
            confirmLoading={submitting}
            visible={sidebarVisible}
          >
            {(selectType === 'create' || selectType === 'modify') && this.renderForm()}
            {selectType === 'detail' && this.renderDetail(currentRecord)}

          </Sidebar>
        </Content>
      </Page>
    );
  }
}
