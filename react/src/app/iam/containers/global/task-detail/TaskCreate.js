import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observable, action, configure } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Content, Header, Page, Permission } from 'choerodon-boot-combine';
import { Steps, Button, Select, Table, DatePicker, Radio, Tooltip, Modal, Form, Input, Popover, Icon, Tabs, Col, Row, Spin, InputNumber, Checkbox } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import moment from 'moment';
import classnames from 'classnames';
import _ from 'lodash';
import TaskDetailStore from '../../../stores/global/task-detail';
import './TaskDetail.scss';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import Tips from '../../../components/tips';

const { TextArea } = Input;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { Step } = Steps;
const CheckboxGroup = Checkbox.Group;
const intlPrefix = 'taskdetail';
const inputWidth = '512px';
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

configure({ enforceActions: false });

// 公用方法类
class TaskDetailType {
  constructor(context) {
    this.context = context;
    const { AppState } = this.context.props;
    this.data = AppState.currentMenuType;
    const { type, id, name } = this.data;
    let codePrefix;
    switch (type) {
      case 'organization':
        codePrefix = 'organization';
        break;
      case 'project':
        codePrefix = 'project';
        break;
      case 'site':
        codePrefix = 'global';
        break;
      default:
        break;
    }
    this.code = `${codePrefix}.taskdetail`;
    this.values = { name: name || AppState.getSiteInfo.systemName || 'Choerodon' };
    this.type = type;
    this.id = id; // 项目或组织id
    this.name = name; // 项目或组织名称
  }
}

@Form.create()
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class TaskCreate extends Component {
  state = this.getInitState();

  getInitState() {
    return {
      current: 1,
      loading: true, // 指定用户表格加载状态
      triggerType: 'simple-trigger', // 创建任务默认触发类型
      startTime: null,
      endTime: null,
      cronLoading: 'empty', // cron popover的状态
      cronTime: [],
      submitLoading: false, // 提交表单时下一步按钮的状态
      paramsData: [], // 参数列表的数据
      informArr: [], // 通知对象
      isShowModal: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      sort: {
        columnKey: 'id',
        order: 'descend',
      },
      filters: {},
      userParams: [],
      createSelectedRowKeys: [], // 模态框中选中的key
      createSelectedTemp: [],
      createSelected: [], // 模态框中选中的row
      showSelectedRowKeys: [], // 页面显示的key
      showSelected: [], // 页面的row
      params: {}, // 参数列表参数
    };
  }


  componentWillMount() {
    this.initTaskDetail();
  }

  componentWillUnmount() {
    TaskDetailStore.setService([]);
    TaskDetailStore.setClassNames([]);
    TaskDetailStore.setCurrentService({});
    TaskDetailStore.setCurrentClassNames({});
    TaskDetailStore.setUserData([]);
  }

  initTaskDetail() {
    this.taskdetail = new TaskDetailType(this);
  }

  getBackPath = () => {
    let backPath;
    let organizationId;
    const { type, name, id } = this.taskdetail;
    const { currentMenuType } = this.props.AppState;
    if (currentMenuType.type === 'project') {
      organizationId = currentMenuType.organizationId;
    }
    switch (type) {
      case 'organization':
        backPath = `/iam/task-detail?type=${type}&id=${id}&name=${name}&organizationId=${id}`;
        break;
      case 'project':
        backPath = `/iam/task-detail?type=${type}&id=${id}&name=${name}&organizationId=${organizationId}`;
        break;
      case 'site':
        backPath = '/iam/task-detail';
        break;
      default:
        break;
    }
    return backPath;
  };

  /**
   * 返回列表页
   */
  goBack = () => {
    const backPath = this.getBackPath();
    this.props.history.push(backPath);
  };

  /**
   * 获取步骤条状态
   * @param index
   * @returns {string}
   */
  getStatus = (index) => {
    const { current } = this.state;
    let status = 'process';
    if (index === current) {
      status = 'process';
    } else if (index > current) {
      status = 'wait';
    } else {
      status = 'finish';
    }
    return status;
  };

  /**
   * 任务名称唯一性校验
   * @param rule 表单校验规则
   * @param value 任务名称
   * @param callback 回调函数
   */
  checkName = (rule, value, callback) => {
    const { intl } = this.props;
    const { type, id } = this.taskdetail;
    TaskDetailStore.checkName(value, type, id).then(({ failed }) => {
      if (failed) {
        callback(intl.formatMessage({ id: `${intlPrefix}.task.name.exist` }));
      } else {
        callback();
      }
    });
  };

  /* 时间选择器处理 -- start */
  disabledStartDate = (startTime) => {
    const endTime = this.state.endTime;
    if (!startTime || !endTime) {
      return false;
    }
    if (endTime.format().split('T')[1] === '00:00:00+08:00') {
      return startTime.format().split('T')[0] >= endTime.format().split('T')[0];
    } else {
      return startTime.format().split('T')[0] > endTime.format().split('T')[0];
    }
  };

  disabledEndDate = (endTime) => {
    const startTime = this.state.startTime;
    if (!endTime || !startTime) {
      return false;
    }
    return endTime.valueOf() <= startTime.valueOf();
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
    this.startTimes = date;
    if (date && this.endTimes && this.endTimes.day() === date.day()) {
      if (this.endTimes.hour() === date.hour() && this.endTimes.minute() === date.minute()) {
        return {
          disabledHours: () => this.range(this.endTimes.hour() + 1, 24),
          disabledMinutes: () => this.range(this.endTimes.minute() + 1, 60),
          disabledSeconds: () => this.range(this.endTimes.second(), 60),
        };
      } else if (this.endTimes.hour() === date.hour()) {
        return {
          disabledHours: () => this.range(this.endTimes.hour() + 1, 24),
          disabledMinutes: () => this.range(this.endTimes.minute() + 1, 60),
        };
      } else {
        return {
          disabledHours: () => this.range(this.endTimes.hour() + 1, 24),
        };
      }
    }
  };

  @action
  clearStartTimes = (status) => {
    if (!status) {
      this.endTimes = null;
    }
  };

  @action
  clearEndTimes = (status) => {
    if (!status) {
      this.startTimes = null;
    }
  };

  @action
  disabledDateEndTime = (date) => {
    this.endTimes = date;
    if (date && this.startTimes && this.startTimes.day() === date.day()) {
      if (this.startTimes.hour() === date.hour() && this.startTimes.minute() === date.minute()) {
        return {
          disabledHours: () => this.range(0, this.startTimes.hour()),
          disabledMinutes: () => this.range(0, this.startTimes.minute()),
          disabledSeconds: () => this.range(0, this.startTimes.second() + 1),
        };
      } else if (this.startTimes.hour() === date.hour()) {
        return {
          disabledHours: () => this.range(0, this.startTimes.hour()),
          disabledMinutes: () => this.range(0, this.startTimes.minute()),
        };
      } else {
        return {
          disabledHours: () => this.range(0, this.startTimes.hour()),
        };
      }
    }
  };

  onStartChange = (value) => {
    this.onChange('startTime', value);
  };

  onEndChange = (value) => {
    this.onChange('endTime', value);
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


  /**
   *  创建任务切换触发类型
   * @param e
   */
  changeValue(e) {
    const { resetFields } = this.props.form;
    resetFields(['simpleRepeatInterval', 'simpleRepeatCount', 'simpleRepeatIntervalUnit', 'cronExpression']);
    this.setState({
      triggerType: e.target.value,
    });
  }

  /**
   * 校验cron表达式
   */
  checkCron = () => {
    const { getFieldValue } = this.props.form;
    const { type, id } = this.taskdetail;
    const cron = getFieldValue('cronExpression');
    if (this.state.currentCron === cron) return;
    this.setState({
      currentCron: cron,
    });
    if (!cron) {
      this.setState({
        cronLoading: 'empty',
      });
    } else {
      this.setState({
        cronLoading: true,
      });

      TaskDetailStore.checkCron(cron, type, id).then((data) => {
        if (data.failed) {
          this.setState({
            cronLoading: false,
          });
        } else {
          this.setState({
            cronLoading: 'right',
            cronTime: data,
          });
        }
      });
    }
  };

  checkCronExpression = (rule, value, callback) => {
    const { intl } = this.props;
    const { type, id } = this.taskdetail;
    TaskDetailStore.checkCron(value, type, id).then((data) => {
      if (data.failed) {
        callback(intl.formatMessage({ id: `${intlPrefix}.cron.wrong` }));
      } else {
        callback();
      }
    });
  };

  /**
   * cron表达式popover提示内容
   * @returns {*}
   */
  getCronContent = () => {
    const { cronLoading, cronTime } = this.state;
    const { intl } = this.props;
    let content;
    if (cronLoading === 'empty') {
      content = (
        <div className="c7n-task-deatil-cron-container-empty">
          <FormattedMessage id={`${intlPrefix}.cron.tip`} />
        </div>
      );
    } else if (cronLoading === true) {
      content = (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin />
        </div>);
    } else if (cronLoading === 'right') {
      content = (
        <div className="c7n-task-deatil-cron-container">
          <FormattedMessage id={`${intlPrefix}.cron.example`} />
          {
            cronTime.map((value, key) => (
              <li key={key}><FormattedMessage id={`${intlPrefix}.cron.runtime`} values={{ time: key + 1 }} /><span>{value}</span></li>
            ))
          }
        </div>
      );
    } else {
      content = (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <FormattedMessage id={`${intlPrefix}.cron.wrong`} />
        </div>
      );
    }
    return content;
  };


  /**
   * 服务名变换时
   * @param service 服务名
   */
  handleChangeService(service) {
    const currentService = [service];
    TaskDetailStore.setCurrentService(currentService);
    this.loadClass();
  }

  /**
   * 类名变换时
   * @param id
   */
  handleChangeClass(id) {
    const currentClass = TaskDetailStore.classNames.find(item => item.id === id);
    TaskDetailStore.setCurrentClassNames(currentClass);
    this.loadParamsTable();
  }

  /**
   * 获取所有服务名
   */
  loadService = () => {
    const { type, id } = this.taskdetail;
    TaskDetailStore.loadService(type, id).then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        TaskDetailStore.setService(data);
      }
    }).catch((error) => {
      Choerodon.handleResponseError(error);
    });
  };

  /**
   * 获取对应服务名的类名
   */
  loadClass = () => {
    const { currentService } = TaskDetailStore;
    TaskDetailStore.loadClass(currentService[0], this.taskdetail.type, this.taskdetail.id).then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else if (data.length) {
        const classNames = [];
        data.map(({ method, code, id, description }) => classNames.push({ method, code, id, description }));
        TaskDetailStore.setClassNames(classNames);
        TaskDetailStore.setCurrentClassNames(classNames[0]);
        this.loadParamsTable();
      } else {
        TaskDetailStore.setClassNames([]);
        TaskDetailStore.setCurrentClassNames({});
        this.setState({
          paramsData: [],
        });
      }
    });
  };

  /**
   * 获取参数列表
   */
  loadParamsTable = () => {
    this.setState({
      paramsLoading: true,
    });
    const { currentClassNames } = TaskDetailStore;
    const { type, id } = this.taskdetail;
    if (currentClassNames.id) {
      TaskDetailStore.loadParams(currentClassNames.id, type, id).then((data) => {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          const filteredParamsData = data.paramsList.length ? data.paramsList.filter(item => item.default === false) : [];
          this.setState({
            paramsData: filteredParamsData,
          });
        }
        this.setState({
          paramsLoading: false,
        });
      });
    } else {
      this.setState({
        paramsData: [],
        paramsLoading: false,
      });
    }
  };

  /**
   * 返回上一步
   * @param index
   */
  goPrevStep = (index) => {
    this.setState({ current: index });
  };

  /**
   * 渲染第一步
   * @returns {*}
   */
  handleRenderFirstStep = () => {
    const { intl, form: { getFieldDecorator } } = this.props;
    const { submitLoading, firstStepValues, triggerType } = this.state;
    const stepPrefix = 'c7n-iam-create-task-content-step1-container';
    const contentPrefix = 'c7n-iam-create-task-content';
    return (
      <div className={`${stepPrefix}`}>
        <p className={`${contentPrefix}-des`}>
          {intl.formatMessage({ id: `${intlPrefix}.step1.description` })}
          <a href={intl.formatMessage({ id: `${intlPrefix}.cron.tip.link` })} target="_blank">
            <span>{intl.formatMessage({ id: 'learnmore' })}</span>
            <Icon type="open_in_new" style={{ fontSize: '13px' }} />
          </a>
        </p>
        <Form className="c7n-create-task">
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('name', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: `${intlPrefix}.task.name.required` }),
              }, {
                validator: this.checkName,
              }],
              initialValue: firstStepValues ? firstStepValues.name : undefined,
              validateTrigger: 'onBlur',
              validateFirst: true,
            })(
              <Input
                maxLength={15}
                showLengthInfo={false}
                autoComplete="off"
                style={{ width: inputWidth }}
                label={<FormattedMessage id={`${intlPrefix}.task.name`} />}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            style={{ width: inputWidth }}
          >
            {getFieldDecorator('description', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: `${intlPrefix}.task.description.required` }),
              }],
              initialValue: firstStepValues ? firstStepValues.description : undefined,
            })(
              <TextArea autoComplete="off" label={<FormattedMessage id={`${intlPrefix}.task.description`} />} />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            className={`${contentPrefix}-inline-formitem`}
          >
            {getFieldDecorator('startTime', {
              rules: [{
                required: true,
                message: intl.formatMessage({ id: `${intlPrefix}.task.start.time.required` }),
              }],
              initialValue: firstStepValues ? firstStepValues.startTime : undefined,
            })(
              <DatePicker
                label={<FormattedMessage id={`${intlPrefix}.task.start.time`} />}
                style={{ width: '248px' }}
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={this.disabledStartDate}
                disabledTime={this.disabledDateStartTime}
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                getCalendarContainer={() => document.getElementsByClassName('page-content')[0]}
                onChange={this.onStartChange}
                onOpenChange={this.clearStartTimes}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            className={`${contentPrefix}-inline-formitem`}
          >
            {getFieldDecorator('endTime', {
              initialValue: firstStepValues ? firstStepValues.endTime : undefined,
            })(
              <DatePicker
                label={<FormattedMessage id={`${intlPrefix}.task.end.time`} />}
                style={{ width: '248px' }}
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={this.disabledEndDate.bind(this)}
                disabledTime={this.disabledDateEndTime.bind(this)}
                showTime={{ defaultValue: moment() }}
                getCalendarContainer={() => document.getElementsByClassName('page-content')[0]}
                onChange={this.onEndChange}
                onOpenChange={this.clearEndTimes}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            className={`${contentPrefix}-inline-formitem`}
            style={{ width: 248 }}
          >
            {getFieldDecorator('triggerType', {
              rules: [],
              initialValue: firstStepValues ? firstStepValues.triggerType : 'simple-trigger',
            })(
              <RadioGroup
                className={`${contentPrefix}-radio-container`}
                label={intl.formatMessage({ id: `${intlPrefix}.trigger.type` })}
                onChange={this.changeValue.bind(this)}
              >
                <Radio value={'simple-trigger'}><FormattedMessage id={`${intlPrefix}.easy.task`} /></Radio>
                <Radio value={'cron-trigger'}><FormattedMessage id={`${intlPrefix}.cron.task`} /></Radio>
              </RadioGroup>,
            )}
          </FormItem>
          <div style={{ display: triggerType === 'simple-trigger' ? 'block' : 'none' }}>
            <div className={`${stepPrefix}-simpletask-time-container`}>
              <FormItem
                {...formItemLayout}
                className={`${contentPrefix}-inline-formitem`}
              >
                {getFieldDecorator('simpleRepeatInterval', {
                  rules: [{
                    required: triggerType === 'simple-trigger',
                    message: intl.formatMessage({ id: `${intlPrefix}.repeat.required` }),
                  }, {
                    pattern: /^[1-9]\d*$/,
                    message: intl.formatMessage({ id: `${intlPrefix}.repeat.pattern` }),
                  }],
                  validateFirst: true,
                  initialValue: firstStepValues ? firstStepValues.simpleRepeatInterval : undefined,
                })(
                  <Input style={{ width: '100px' }} autoComplete="off" label={<FormattedMessage id={`${intlPrefix}.repeat.interval`} />} />,
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                className={`${contentPrefix}-inline-formitem ${contentPrefix}-inline-formitem-select`}
              >
                {getFieldDecorator('simpleRepeatIntervalUnit', {
                  rules: [],
                  initialValue: firstStepValues ? firstStepValues.simpleRepeatIntervalUnit : 'SECONDS',
                })(
                  <Select
                    style={{ width: '124px' }}
                    getPopupContainer={() => document.getElementsByClassName('page-content')[0]}
                  >
                    <Option value="SECONDS" key="SECONDS">{intl.formatMessage({ id: `${intlPrefix}.seconds` })}</Option>
                    <Option value="MINUTES" key="MINUTES">{intl.formatMessage({ id: `${intlPrefix}.minutes` })}</Option>
                    <Option value="HOURS" key="HOURS">{intl.formatMessage({ id: `${intlPrefix}.hours` })}</Option>
                    <Option value="DAYS" key="DAYS">{intl.formatMessage({ id: `${intlPrefix}.days` })}</Option>
                  </Select>,
                )}
              </FormItem>
            </div>
            <FormItem
              className={`${contentPrefix}-inline-formitem`}
              {...formItemLayout}
            >
              {getFieldDecorator('simpleRepeatCount', {
                rules: [{
                  required: triggerType === 'simple-trigger',
                  message: intl.formatMessage({ id: `${intlPrefix}.repeat.time.required` }),
                }, {
                  pattern: /^[1-9]\d*$/,
                  message: intl.formatMessage({ id: `${intlPrefix}.repeat.pattern` }),
                }],
                initialValue: firstStepValues ? firstStepValues.simpleRepeatCount : undefined,
              })(
                <Input style={{ width: '100px' }} autoComplete="off" label={<FormattedMessage id={`${intlPrefix}.repeat.time`} />} />,
              )}
            </FormItem>
          </div>
          <div>
            <FormItem
              {...formItemLayout}
              style={{ position: 'relative', display: triggerType === 'cron-trigger' ? 'inline-block' : 'none' }}
            >
              {getFieldDecorator('cronExpression', {
                rules: [{
                  required: triggerType === 'cron-trigger',
                  message: intl.formatMessage({ id: `${intlPrefix}.cron.expression.required` }),
                }, {
                  validator: triggerType === 'cron-trigger' ? this.checkCronExpression : '',
                }],
                initialValue: firstStepValues ? firstStepValues.cronExpression : undefined,
                validateTrigger: 'onBlur',
                validateFirst: true,
              })(
                <Input style={{ width: inputWidth }} autoComplete="off" label={<FormattedMessage id={`${intlPrefix}.cron.expression`} />} />,
              )}
            </FormItem>
            <Popover
              content={this.getCronContent()}
              trigger="click"
              placement="bottom"
              overlayClassName={`${stepPrefix}.popover`}
              getPopupContainer={() => document.getElementsByClassName('page-content')[0]}
            >
              <Icon
                onClick={this.checkCron}
                style={{ display: triggerType === 'cron-trigger' ? 'inline-block' : 'none' }}
                className={`${stepPrefix}-popover-icon`}
                type="find_in_page"
              />
            </Popover>
          </div>
          <div className="c7n-iam-create-task-tip-select">
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('executeStrategy', {
                rules: [{
                  required: true,
                  message: intl.formatMessage({ id: `${intlPrefix}.execute-strategy.required` }),
                }],
                initialValue: firstStepValues ? firstStepValues.executeStrategy : null,
              })(
                <Select
                  style={{ width: 242 }}
                  getPopupContainer={() => document.getElementsByClassName('page-content')[0]}
                  label={intl.formatMessage({ id: `${intlPrefix}.execute-strategy` })}
                  dropdownMatchSelectWidth
                >
                  <Option value="STOP" key="STOP">{intl.formatMessage({ id: `${intlPrefix}.stop` })}</Option>
                  <Option value="SERIAL" key="SERIAL">{intl.formatMessage({ id: `${intlPrefix}.serial` })}</Option>
                  <Option value="PARALLEL" key="PARALLEL">{intl.formatMessage({ id: `${intlPrefix}.parallel` })}</Option>
                </Select>,
              )}
            </FormItem>
            <Tips type="form" data={`${intlPrefix}.execute-strategy.tips`} />
          </div>
          <Button
            type="primary"
            funcType="raised"
            style={{ display: 'inlineBlock', marginTop: '8px' }}
            loading={submitLoading}
            onClick={this.handleSubmit.bind(this, 1)}
          >
            <FormattedMessage id={`${intlPrefix}.step.next`} />
          </Button>
        </Form>
      </div>
    );
  }

  getParamsInitvalue = (text, record) => {
    const { params } = this.state;
    const { name } = record;
    let value;
    if (`${name}` in params) {
      value = params[name];
    } else {
      value = text === null ? undefined : text;
    }
    return value;
  };

  /**
   * 渲染第二步
   * @returns {*}
   */
  handleRenderSecStep = () => {
    const { intl, form: { getFieldDecorator } } = this.props;
    const { submitLoading } = this.state;
    const service = TaskDetailStore.service;
    const classNames = TaskDetailStore.classNames;
    const stepPrefix = 'c7n-iam-create-task-content-step2-container';
    const contentPrefix = 'c7n-iam-create-task-content';
    const columns = [{
      title: <FormattedMessage id={`${intlPrefix}.params.name`} />,
      dataIndex: 'name',
      key: 'name',
    }, {
      title: <FormattedMessage id={`${intlPrefix}.params.value`} />,
      dataIndex: 'defaultValue',
      key: 'defaultValue',
      width: 258,
      render: (text, record) => {
        let editableNode;
        if (record.type === 'Boolean') {
          editableNode = (
            <FormItem style={{ marginBottom: 0, width: '55px' }}>
              {
                getFieldDecorator(`params.${record.name}`, {
                  rules: [{
                    required: text === null,
                    message: intl.formatMessage({ id: `${intlPrefix}.default.required` }),
                  }],
                  initialValue: this.getParamsInitvalue(text, record),
                })(
                  <Select
                    getPopupContainer={() => document.getElementsByClassName('page-content')[0].parentNode}
                    tyle={{ width: '55px' }}
                  >
                    <Option value={null} style={{ height: '22px' }} key="null" />
                    <Option value key="true">true</Option>
                    <Option value={false} key="false">false</Option>
                  </Select>,
                )
              }
            </FormItem>);
        } else if (record.type === 'Integer' || record.type === 'Long' || record.type === 'Double' || record.type === 'Float') {
          editableNode = (
            <FormItem style={{ marginBottom: 0 }}>
              {
                getFieldDecorator(`params.${record.name}`, {
                  rules: [{
                    required: text === null,
                    message: intl.formatMessage({ id: `${intlPrefix}.num.required` }),
                  }, {
                    transform: value => Number(value),
                    type: 'number',
                    message: intl.formatMessage({ id: `${intlPrefix}.number.pattern` }),
                  }],
                  validateFirst: true,
                  initialValue: this.getParamsInitvalue(text, record),
                })(
                  <InputNumber
                    style={{ width: '200px' }}
                    onFocus={this.inputOnFocus}
                    autoComplete="off"
                  />,
                )
              }
            </FormItem>);
        } else {
          editableNode = (
            <FormItem style={{ marginBottom: 0 }}>
              {
                getFieldDecorator(`params.${record.name}`, {
                  rules: [{
                    required: text === null,
                    whitespace: true,
                    message: intl.formatMessage({ id: `${intlPrefix}.default.required` }),
                  }],
                  initialValue: this.getParamsInitvalue(text, record),
                })(
                  <Input
                    style={{ width: '200px' }}
                    onFocus={this.inputOnFocus}
                    autoComplete="off"
                  />,
                )
              }
            </FormItem>);
        }

        if (record.type !== 'Boolean') {
          editableNode = (
            <div className="c7n-taskdetail-text">
              {editableNode}
              <Icon type="mode_edit" className="c7n-taskdetail-text-icon" />
            </div>
          );
        }
        return editableNode;
      },
    }, {
      title: <FormattedMessage id={`${intlPrefix}.params.type`} />,
      dataIndex: 'type',
      key: 'type',
    }];


    return (
      <div className={`${stepPrefix}`}>
        <p className={`${contentPrefix}-des`}>
          {intl.formatMessage({ id: `${intlPrefix}.step2.description` })}
        </p>
        <Form>
          <div className="c7n-task-deatil-params-container">
            <FormItem
              {...formItemLayout}
              className={`${contentPrefix}-inline-formitem`}
            >
              {getFieldDecorator('serviceName', {
                rules: [{
                  required: true,
                  message: intl.formatMessage({ id: `${intlPrefix}.service.required` }),
                }],
                initialValue: TaskDetailStore.getCurrentService.length ? TaskDetailStore.getCurrentService : undefined,
              })(
                <Select
                  style={{ width: '176px' }}
                  getPopupContainer={() => document.getElementsByClassName('page-content')[0]}
                  label={<FormattedMessage id={`${intlPrefix}.service.name`} />}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  filter
                  onChange={this.handleChangeService.bind(this)}
                >
                  {
                    service && service.length ? service.map(item => (
                      <Option key={item}>{item}</Option>
                    )) : <Option key="empty">{intl.formatMessage({ id: `${intlPrefix}.noservice` })}</Option>
                  }
                </Select>,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              style={{ marginRight: '0' }}
              className={`${contentPrefix}-inline-formitem`}
            >
              {getFieldDecorator('methodId', {
                rules: [{
                  required: true,
                  message: intl.formatMessage({ id: `${intlPrefix}.task.class.required` }),
                }],
                initialValue: classNames.length ? TaskDetailStore.currentClassNames.id : undefined,
              })(
                <Select
                  notFoundContent={intl.formatMessage({ id: `${intlPrefix}.noprograms` })}
                  label={<FormattedMessage id={`${intlPrefix}.task.class.name`} />}
                  style={{ width: '292px' }}
                  getPopupContainer={() => document.getElementsByClassName('page-content')[0]}
                  filterOption={(input, option) => {
                    const childNode = option.props.children;
                    if (childNode && React.isValidElement(childNode)) {
                      return childNode.props.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                    }
                    return false;
                  }}
                  filter
                  onChange={this.handleChangeClass.bind(this)}
                >
                  {
                    classNames.length && classNames.map(({ description, method, id }) => (
                      <Option key={`${method}-${id}`} value={id}>
                        <Tooltip
                          title={method}
                          placement="right"
                          align={{ offset: [20, 0] }}
                          getPopupContainer={() => document.getElementsByClassName('page-content')[0]}
                        >
                          <span
                            className={`${stepPrefix}-tooltip`}
                          >{description}</span>
                        </Tooltip>
                      </Option>
                    ))
                  }
                </Select>,
              )}
            </FormItem>
            <Table
              loading={this.state.paramsLoading}
              pagination={false}
              filterBar={false}
              columns={columns}
              rowKey="name"
              dataSource={this.state.paramsData}
              style={{ width: '488px', marginRight: '0' }}
            />
          </div>
          <div className={`${contentPrefix}-btn-group`}>
            <Button
              type="primary"
              funcType="raised"
              loading={submitLoading}
              onClick={this.handleSubmit.bind(this, 2)}
            >
              <FormattedMessage id={`${intlPrefix}.step.next`} />
            </Button>
            <Button
              disabled={submitLoading}
              funcType="raised"
              onClick={this.goPrevStep.bind(this, 1)}
            >
              <FormattedMessage id={`${intlPrefix}.step.prev`} />
            </Button>
          </div>
        </Form>
      </div>
    );
  };

  /**
   * 获取当前层级名称
   * @returns {*}
   */
  getLevelName = () => {
    const { intl } = this.props;
    let level;
    switch (this.taskdetail.type) {
      case 'site':
        level = intl.formatMessage({ id: `${intlPrefix}.site` });
        break;
      case 'organization':
        level = intl.formatMessage({ id: `${intlPrefix}.organization` });
        break;
      case 'project':
        level = intl.formatMessage({ id: `${intlPrefix}.project` });
        break;
      default:
        break;
    }
    return level;
  };

  /**
   * 渲染第三步
   * @returns {*}
   */
  handleRenderThirdStep = () => {
    const { intl, AppState } = this.props;
    const { submitLoading, isShowModal, showSelected, showSelectedRowKeys, informArr } = this.state;
    const stepPrefix = 'c7n-iam-create-task-content-step3-container';
    const contentPrefix = 'c7n-iam-create-task-content';
    const level = this.getLevelName();
    const options = [
      { label: intl.formatMessage({ id: `${intlPrefix}.creator` }), value: AppState.getUserInfo.id },
      { label: `${level}${intl.formatMessage({ id: `${intlPrefix}.manager` })}`, value: 'manager' },
      { label: intl.formatMessage({ id: `${intlPrefix}.user` }), value: 'user' },
    ];

    return (
      <div className={`${stepPrefix}`}>
        <p className={`${contentPrefix}-des`}>
          {intl.formatMessage({ id: `${intlPrefix}.step3.description` })}
        </p>
        <div>
          <CheckboxGroup
            label={<FormattedMessage id={`${intlPrefix}.inform.person`} />}
            options={options}
            className={`${stepPrefix}-checkbox-group`}
            onChange={this.changeInformPerson}
            value={informArr}
          />
          <div className={`${stepPrefix}-specified-container`} style={{ display: informArr.indexOf('user') !== -1 ? 'block' : 'none' }}>
            <div style={{ marginBottom: '15px' }}>
              <span className={`${stepPrefix}-specified-container-title`}>{intl.formatMessage({ id: `${intlPrefix}.user` })}</span>
              <Button
                icon="playlist_add"
                type="primary"
                className={`${stepPrefix}-specified-container-btn`}
                onClick={this.handleOpenUsersModal}
              >
                <FormattedMessage id="add" />
              </Button>
            </div>
            {
              showSelected.length ? (
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  value={showSelectedRowKeys}
                  showArrow={false}
                  onChoiceRemove={this.handleChoiceRemove}
                  getPopupContainer={() => document.getElementsByClassName('c7n-iam-create-task-container')[0]}
                  className={`${stepPrefix}-select`}
                >
                  {
                    showSelected.length && showSelected.map(({ loginName, realName, id }) =>
                      <Option key={id} value={id}>{loginName}{realName}</Option>,
                    )
                  }
                </Select>
              ) : (
                <div>{intl.formatMessage({ id: `${intlPrefix}.nousers` })}</div>
              )
            }
            <Modal
              width={560}
              visible={isShowModal}
              closable={false}
              title={<FormattedMessage id={`${intlPrefix}.add.specified.user`} />}
              okText={<FormattedMessage id="ok" />}
              onOk={this.handleAddUsers}
              onCancel={this.handleCloseModal}
              className="c7n-iam-create-task-modal"
            >
              {this.getModalContent()}
            </Modal>
          </div>
          <div className={`${contentPrefix}-btn-group`}>
            <Button
              type="primary"
              funcType="raised"
              loading={submitLoading}
              onClick={this.handleSubmit.bind(this, 3)}
            >
              <FormattedMessage id={`${intlPrefix}.step.next`} />
            </Button>
            <Button
              disabled={submitLoading}
              funcType="raised"
              onClick={this.goPrevStep.bind(this, 2)}
            >
              <FormattedMessage id={`${intlPrefix}.step.prev`} />
            </Button>
          </div>
        </div>
      </div>
    );
  };


  /**
   * 移除指定用户标签
   * @param value 用户id
   */
  handleChoiceRemove = (value) => {
    const { showSelectedRowKeys, showSelected } = this.state;
    const deleteItemIndex = showSelectedRowKeys.findIndex(item => item === value);
    const deleteRowItemIndex = showSelected.findIndex(item => item.id === value);
    showSelectedRowKeys.splice(deleteItemIndex, 1);
    showSelected.splice(deleteRowItemIndex, 1);
    this.setState({
      createSelectedRowKeys: showSelectedRowKeys,
      showSelectedRowKeys,
      showSelected,
    });
  };


  /**
   * 通知对象变化时
   * @param checkedValue array 选中的通知对象
   */
  changeInformPerson = (checkedValue) => {
    if (checkedValue.indexOf('user') === -1) {
      this.setState({
        createSelected: [],
        createSelectedRowKeys: [],
        showSelected: [],
        showSelectedRowKeys: [],
        createSelectedTemp: [],
      });
    }
    this.setState({
      informArr: checkedValue,
    });
  };

  /**
   * 开启指定用户模态框
   */
  handleOpenUsersModal = () => {
    const { showSelected } = this.state;
    this.setState({
      isShowModal: true,
      createSelected: showSelected,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      filters: {},
      userParams: [],
      loading: true,
    }, () => {
      this.loadUsers();
    });
  };

  /**
   * 加载指定用户数据
   * @param paginationIn
   * @param filtersIn
   * @param sortIn
   * @param paramsIn
   */
  loadUsers(paginationIn, filtersIn, sortIn, paramsIn) {
    const {
      pagination: paginationState,
      sort: sortState,
      userParams: paramsState,
    } = this.state;
    const pagination = paginationIn || paginationState;
    const sort = sortIn || sortState;
    const userParams = paramsIn || paramsState;
    const { type, id } = this.taskdetail;
    // 防止标签闪烁
    this.setState({ loading: true });
    TaskDetailStore.loadUserDatas(pagination, sort, userParams, type, id).then((data) => {
      TaskDetailStore.setUserData(data.content.slice());
      this.setState({
        pagination: {
          current: data.pageNum,
          pageSize: data.pageSize,
          total: data.total,
        },
        loading: false,
        userParams,
      });
    });
  }

  handlePageChange = (pagination, filters, sort, params) => {
    this.loadUsers(pagination, filters, sort, params);
  };


  /**
   * 指定用户模态框-确定
   */
  handleAddUsers = () => {
    const { createSelected, createSelectedRowKeys } = this.state;
    this.setState({
      showSelected: createSelected,
      showSelectedRowKeys: createSelectedRowKeys,
      isShowModal: false,
    });
  }


  /**
   * 关闭指定用户模态框
   */
  handleCloseModal = () => {
    const { showSelectedRowKeys } = this.state;
    this.setState({
      createSelectedRowKeys: showSelectedRowKeys,
      isShowModal: false,
    });
  };


  /**
   * 模态框选择的key变化时
   * @param keys 用户id
   * @param selected 当前行数据
   */
  onCreateSelectChange = (keys, selected) => {
    const s = [];
    const a = this.state.createSelectedTemp.concat(selected);
    this.setState({ createSelectedTemp: a });
    _.map(keys, (o) => {
      if (_.filter(a, ['id', o]).length) {
        s.push(_.filter(a, ['id', o])[0]);
      }
    });
    this.setState({
      createSelectedRowKeys: keys,
      createSelected: s,
    });
  };

  getModalContent = () => {
    const { pagination, userParams, loading, createSelectedRowKeys } = this.state;
    const { intl } = this.props;
    const rowSelection = {
      selectedRowKeys: createSelectedRowKeys,
      onChange: this.onCreateSelectChange,
    };
    const columns = [{
      title: <FormattedMessage id={`${intlPrefix}.login.name`} />,
      dataIndex: 'loginName',
      key: 'loginName',
      width: '50%',
      render: text => (
        <MouseOverWrapper text={text} width={0.4}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.real.name`} />,
      dataIndex: 'realName',
      key: 'realName',
      width: '50%',
      render: text => (
        <MouseOverWrapper text={text} width={0.4}>
          {text}
        </MouseOverWrapper>
      ),
    }];

    return (
      <Table
        loading={loading}
        columns={columns}
        pagination={pagination}
        dataSource={TaskDetailStore.getUserData}
        filters={userParams}
        rowKey="id"
        onChange={this.handlePageChange}
        rowSelection={rowSelection}
        filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
      />
    );
  };


  /**
   * 渲染第四步
   */
  handleRenderFourthStep = () => {
    const stepPrefix = 'c7n-iam-create-task-content-step4-container';
    const contentPrefix = 'c7n-iam-create-task-content';
    const { intl: { formatMessage }, AppState } = this.props;
    const level = this.getLevelName();
    const { firstStepValues, serviceName, submitLoading, params, informArr, showSelected } = this.state;
    const tableData = [];
    Object.entries(params).map(item => tableData.push({ name: item[0], value: item[1] }));
    let unit;
    switch (firstStepValues.simpleRepeatIntervalUnit) {
      case 'SECONDS':
        unit = formatMessage({ id: `${intlPrefix}.seconds` });
        break;
      case 'MINUTES':
        unit = formatMessage({ id: `${intlPrefix}.minutes` });
        break;
      case 'HOURS':
        unit = formatMessage({ id: `${intlPrefix}.hours` });
        break;
      case 'DAYS':
        unit = formatMessage({ id: `${intlPrefix}.days` });
        break;
      default:
        break;
    }
    const infoList = [{
      key: formatMessage({ id: `${intlPrefix}.task.name` }),
      value: firstStepValues.name,
    }, {
      key: formatMessage({ id: `${intlPrefix}.task.description` }),
      value: firstStepValues.description,
    }, {
      key: formatMessage({ id: `${intlPrefix}.task.start.time` }),
      value: firstStepValues.startTime.format('YYYY-MM-DD HH:mm:ss'),
    }, {
      key: formatMessage({ id: `${intlPrefix}.task.end.time` }),
      value: firstStepValues.endTime ? firstStepValues.endTime.format('YYYY-MM-DD HH:mm:ss') : null,
    }, {
      key: formatMessage({ id: `${intlPrefix}.cron.expression` }),
      value: firstStepValues.triggerType === 'simple-trigger' ? null : firstStepValues.cronExpression,
    }, {
      key: formatMessage({ id: `${intlPrefix}.trigger.type` }),
      value: formatMessage({ id: firstStepValues.triggerType === 'simple-trigger' ? `${intlPrefix}.simple.trigger` : `${intlPrefix}.cron.trigger` }),
    }, {
      key: formatMessage({ id: `${intlPrefix}.repeat.interval` }),
      value: firstStepValues.triggerType === 'simple-trigger' ? `${firstStepValues.simpleRepeatInterval}${unit}` : null,
    }, {
      key: formatMessage({ id: `${intlPrefix}.repeat.time` }),
      value: firstStepValues.simpleRepeatCount || null,
    }, {
      key: formatMessage({ id: `${intlPrefix}.execute-strategy` }),
      value: formatMessage({ id: `${intlPrefix}.${firstStepValues.executeStrategy.toLowerCase()}` }) || '阻塞',
    }, {
      key: formatMessage({ id: `${intlPrefix}.service.name` }),
      value: serviceName,
    }, {
      key: formatMessage({ id: `${intlPrefix}.task.class.name` }),
      value: TaskDetailStore.getCurrentClassNames.description,
    }, {
      key: formatMessage({ id: `${intlPrefix}.params.data` }),
      value: '',
    }];

    const columns = [
      {
        title: <FormattedMessage id={`${intlPrefix}.params.name`} />,
        key: 'name',
        dataIndex: 'name',
      }, {
        title: <FormattedMessage id={`${intlPrefix}.params.value`} />,
        key: 'value',
        dataIndex: 'value',
        render: text => `${text}`,
      }];
    return (
      <div>
        {
          infoList.map(({ key, value }) =>
            <Row key={key} className={classnames(`${stepPrefix}-row`, { 'c7n-iam-create-task-content-step4-container-row-hide': value === null })}>
              <Col span={3}>{key}:</Col>
              <Col span={21}>{value}</Col>
            </Row>,
          )
        }
        <Table
          style={{ width: '512px' }}
          pagination={false}
          columns={columns}
          dataSource={tableData}
          filterBar={false}
        />
        <Row className={`${stepPrefix}-informlist`}>
          <Col span={3}>{formatMessage({ id: `${intlPrefix}.inform.person` })}:</Col>
          <Col span={21}>
            {
              informArr.length ? (<ul style={{ paddingLeft: '0' }}>
                <li className={classnames({ [`${stepPrefix}-informlist-li-hide`]: informArr.indexOf(AppState.getUserInfo.id) === -1 })}>
                  {formatMessage({ id: `${intlPrefix}.creator` })}
                </li>
                <li className={classnames({ [`${stepPrefix}-informlist-li-hide`]: informArr.indexOf('manager') === -1 })}>
                  {level}{formatMessage({ id: `${intlPrefix}.manager` })}
                </li>
                <li className={classnames({ [`${stepPrefix}-informlist-li-hide`]: informArr.indexOf('user') === -1 })}>
                  {formatMessage({ id: `${intlPrefix}.user` })}:
                  {showSelected.length ? (
                    <div className={`${stepPrefix}-informlist-name-container`}>{
                      showSelected.map(item => (
                        <div key={item.id}>
                          <span>{item.loginName}{item.realName}</span>
                          <span>、</span>
                        </div>
                      ))
                    }</div>
                  ) : <div className={`${stepPrefix}-informlist-name-container`}>{formatMessage({ id: `${intlPrefix}.empty` })}</div>}
                </li>
              </ul>) : (
                <span>{formatMessage({ id: `${intlPrefix}.empty` })}</span>
              )
            }
          </Col>
        </Row>
        <div className={`${contentPrefix}-btn-group`}>
          <Button
            type="primary"
            funcType="raised"
            loading={submitLoading}
            onClick={this.handleSubmit.bind(this, 4)}
          >
            <FormattedMessage id="create" />
          </Button>
          <Button
            disabled={submitLoading}
            funcType="raised"
            onClick={this.goPrevStep.bind(this, 3)}
          >
            <FormattedMessage id={`${intlPrefix}.step.prev`} />
          </Button>
          <Button
            disabled={submitLoading}
            funcType="raised"
            onClick={this.goBack}
          >
            <FormattedMessage id="cancel" />
          </Button>
        </div>
      </div>
    );
  };

  handleSubmit = (step, e) => {
    e.preventDefault();
    const { form, intl, AppState } = this.props;
    const { type, id } = this.taskdetail;
    this.setState({
      submitLoading: true,
    });
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (step === 1) {
          this.setState({
            firstStepValues: {
              ...values,
            },
            current: step + 1,
            submitLoading: false,
          }, () => {
            if (!TaskDetailStore.service.length) {
              this.loadService();
            }
          });
        } else if (step === 2) {
          if (values.methodId === 'empty') {
            Choerodon.prompt(intl.formatMessage({ id: `${intlPrefix}.noprogram` }));
            this.setState({
              submitLoading: false,
            });
            return;
          }

          this.setState({
            ...values,
            current: step + 1,
            submitLoading: false,
          });
        } else if (step === 3) {
          this.setState({
            current: step + 1,
            submitLoading: false,
          });
        } else {
          const { informArr, showSelectedRowKeys, methodId, params, firstStepValues: { executeStrategy, startTime, endTime, cronExpression, simpleRepeatInterval, simpleRepeatIntervalUnit, simpleRepeatCount, triggerType } } = this.state;
          const flag = triggerType === 'simple-trigger';
          const body = {
            ...this.state.firstStepValues,
            startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
            endTime: endTime ? endTime.format('YYYY-MM-DD HH:mm:ss') : null,
            cronExpression: flag ? null : cronExpression,
            simpleRepeatInterval: flag ? Number(simpleRepeatInterval) : null,
            simpleRepeatIntervalUnit: flag ? simpleRepeatIntervalUnit : null,
            simpleRepeatCount: flag ? Number(simpleRepeatCount) : null,
            executeStrategy,
            params,
            methodId,
            notifyUser: {
              administrator: informArr.indexOf('manager') !== -1,
              creator: informArr.indexOf(AppState.getUserInfo.id) !== -1,
              assigner: informArr.indexOf('user') !== -1,
            },
            assignUserIds: showSelectedRowKeys,
          };

          TaskDetailStore.createTask(body, type, id).then(({ failed, message }) => {
            if (failed) {
              Choerodon.prompt(message);
              this.setState({
                submitLoading: false,
              });
            } else {
              Choerodon.prompt(intl.formatMessage({ id: 'create.success' }));
              this.setState({
                submitLoading: false,
              }, () => {
                this.goBack();
              });
            }
          }).catch(() => {
            Choerodon.prompt(intl.formatMessage({ id: 'create.error' }));
            this.setState({
              submitLoading: false,
            });
          });
          this.setState({
            submitLoading: false,
          });
        }
      } else {
        this.setState({
          submitLoading: false,
        });
      }
    });
  };

  render() {
    const { current } = this.state;
    return (
      <Page
        service={[
          'asgard-service.schedule-task-site.check',
          'asgard-service.schedule-task-org.check',
          'asgard-service.schedule-task-project.check',
          'asgard-service.schedule-task-site.cron',
          'asgard-service.schedule-task-org.cron',
          'asgard-service.schedule-task-project.cron',
          'manager-service.service.pageAll',
          'asgard-service.schedule-method-site.getMethodByService',
          'asgard-service.schedule-method-org.getMethodByService',
          'asgard-service.schedule-method-project.getMethodByService',
          'asgard-service.schedule-method-site.pagingQuery',
          'asgard-service.schedule-method-org.pagingQuery',
          'asgard-service.schedule-method-project.pagingQuery',
          'asgard-service.schedule-task-site.create',
          'asgard-service.schedule-task-org.create',
          'asgard-service.schedule-task-project.create',
        ]}
      >
        <Header
          title={<FormattedMessage id={`${intlPrefix}.create`} />}
          backPath={this.getBackPath()}
        />
        <Content
          code={`${this.taskdetail.code}.create`}
          values={this.taskdetail.values}
          className="c7n-iam-create-task-page"
        >
          <div className="c7n-iam-create-task-container">
            <div className="c7n-iam-create-task-container-steps">
              <Steps current={current}>
                <Step
                  title={
                    <span style={{ color: current === 1 ? '#3F51B5' : '', fontSize: 14 }}>
                      <FormattedMessage id={`${intlPrefix}.step1.title`} />
                    </span>}
                  status={this.getStatus(1)}
                />
                <Step
                  title={<span style={{ color: current === 2 ? '#3F51B5' : '', fontSize: 14 }}>
                    <FormattedMessage id={`${intlPrefix}.step2.title`} />
                  </span>}
                  status={this.getStatus(2)}
                />
                <Step
                  title={<span style={{
                    color: current === 3 ? '#3F51B5' : '',
                    fontSize: 14,
                  }}
                  >
                    <FormattedMessage id={`${intlPrefix}.step3.title`} />
                  </span>}
                  status={this.getStatus(3)}
                />
                <Step
                  title={<span style={{
                    color: current === 4 ? '#3F51B5' : '',
                    fontSize: 14,
                  }}
                  >
                    <FormattedMessage id={`${intlPrefix}.step4.title`} />
                  </span>}
                  status={this.getStatus(4)}
                />
              </Steps>
            </div>
            <div className="c7n-iam-create-task-content">
              {current === 1 && this.handleRenderFirstStep()}
              {current === 2 && this.handleRenderSecStep()}
              {current === 3 && this.handleRenderThirdStep()}
              {current === 4 && this.handleRenderFourthStep()}
            </div>
          </div>
        </Content>
      </Page>
    );
  }
}
