import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Modal, Popover, Radio, Row, Select, Spin, Table, Tooltip } from 'choerodon-ui';
import { axios, Content, Header, Page, Permission } from 'choerodon-front-boot';
import { withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import querystring from 'query-string';
import { inject, observer } from 'mobx-react';
import './Route.scss';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import StatusTag from '../../../components/statusTag';
import '../../../common/ConfirmModal.scss';
import { handleFiltersParams } from '../../../common/util';

const { Sidebar } = Modal;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const intlPrefix = 'global.route';

@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class Route extends Component {
  constructor(props) {
    super(props);
    this.createRouteFocusInput = React.createRef();
  }

  state = this.getInitState();

  componentWillMount() {
    this.loadRouteList();
    this.getService();
  }

  /* 初始化state */
  getInitState() {
    return {
      visible: false,
      content: null,
      loading: false,
      sidebarData: {},
      isShow: '',
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
      params: [],
      record: {},
      serviceArr: [],
      filterSensitive: false,
      submitting: false,
    };
  }

  /* 获取sidebar中对应微服务 */
  getOption() {
    const { serviceArr = [] } = this.state;
    const services = serviceArr.map(({ name }) => (
      <Option value={name} key={name}>{name}</Option>
    ));
    return services;
  }

  /* 获取所有微服务 */
  getService() {
    axios.get('manager/v1/services').then((res) => {
      this.setState({
        serviceArr: res,
      });
    });
  }

  /**
   * Input后缀提示
   * @param text
   */
  getSuffix(text) {
    return (
      <Popover
        getPopupContainer={() => document.getElementsByClassName('sidebar-content')[0].parentNode}
        overlayStyle={{ maxWidth: '180px' }}
        placement="right"
        trigger="hover"
        content={text}
      >
        <Icon type="help" />
      </Popover>
    );
  }


  setValueInSelect(value) {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const sensitiveHeaders = getFieldValue('sensitiveHeaders') || [];
    if (sensitiveHeaders.indexOf(value) === -1) {
      sensitiveHeaders.push(value);
      setFieldsValue({
        sensitiveHeaders,
      });
    }
    if (this.rcSelect) {
      this.rcSelect.setState({
        inputValue: '',
      });
    }
  }

  loadRouteList(paginationIn, sortIn, filtersIn, paramsIn) {
    const {
      pagination: paginationState,
      sort: sortState,
      filters: filtersState,
      params: paramsState,
    } = this.state;
    const pagination = paginationIn || paginationState;
    const sort = sortIn || sortState;
    const filters = filtersIn || filtersState;
    const params = paramsIn || paramsState;
    // 防止标签闪烁
    this.setState({ filters, loading: true });
    // 若params或filters含特殊字符表格数据置空
    const isIncludeSpecialCode = handleFiltersParams(params, filters);
    if (isIncludeSpecialCode) {
      this.setState({
        loading: false,
        pagination: {
          total: 0,
        },
        content: [],
        sort,
        params,
      });
      return;
    }

    this.fetch(pagination, sort, filters, params)
      .then((data) => {
        this.setState({
          sort,
          params,
          pagination: {
            current: data.number + 1,
            pageSize: data.size,
            total: data.totalElements,
          },
          content: data.content,
          loading: false,
        });
      })
      .catch((error) => {
        Choerodon.handleResponseError(error);
      });
  }

  fetch({ current, pageSize }, { columnKey = 'id', order = 'descend' }, { name, path, serviceId, builtIn }, params) {
    const queryObj = {
      page: current - 1,
      size: pageSize,
      name,
      path,
      serviceId,
      builtIn,
      params,
    };
    if (columnKey) {
      const sorter = [];
      sorter.push(columnKey);
      if (order === 'descend') {
        sorter.push('desc');
      }
      queryObj.sort = sorter.join(',');
    }
    return axios.get(`/manager/v1/routes?${querystring.stringify(queryObj)}`);
  }

  handlePageChange = (pagination, filters, sorter, params) => {
    this.loadRouteList(pagination, sorter, filters, params);
  };

  createRoute = () => {
    this.props.form.resetFields();
    this.setState({
      visible: true,
      show: 'create',
    });
    setTimeout(() => {
      this.createRouteFocusInput.focus();
    }, 10);
  };

  editOrDetail = (record, status) => {
    this.props.form.resetFields();
    this.setState({
      visible: true,
      show: status,
      sidebarData: record,
      helper: record.helperService && status === 'detail',
      filterSensitive: record.customSensitiveHeaders ? 'filtered' : 'noFiltered',
    });
  }

  /* 刷新 */
  handleRefresh = () => {
    this.setState(this.getInitState(), () => {
      this.loadRouteList();
      this.getService();
    });
  };

  /* 关闭sidebar */
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  /* 删除自定义路由 */
  handleDelete = (record) => {
    const { intl } = this.props;
    Modal.confirm({
      className: 'c7n-iam-confirm-modal',
      title: intl.formatMessage({ id: `${intlPrefix}.delete.title` }),
      content: intl.formatMessage({ id: `${intlPrefix}.delete.content` }, { name: record.name }),
      onOk: () => axios.delete(`/manager/v1/routes/${record.id}`).then(({ failed, message }) => {
        if (failed) {
          Choerodon.prompt(message);
        } else {
          Choerodon.prompt(intl.formatMessage({ id: 'delete.success' }));
          this.loadRouteList();
        }
      }),
    });
  }

  /**
   * label后缀提示
   * @param label label文字
   * @param tip 提示文字
   */

  labelSuffix(label, tip) {
    return (
      <div className="labelSuffix">
        <span>
          {label}
        </span>
        <Popover
          getPopupContainer={() => document.getElementsByClassName('sidebar-content')[0].parentNode}
          placement="right"
          trigger="hover"
          content={tip}
          overlayStyle={{ maxWidth: '180px' }}
        >
          <Icon type="help" />
        </Popover>
      </div>
    );
  }

  saveSelectRef = (node) => {
    if (node) {
      this.rcSelect = node.rcSelect;
    }
  };

  handleInputKeyDown = (e) => {
    const { value } = e.target;
    if (e.keyCode === 32 || e.keyCode === 188) {
      e.preventDefault();
      return false;
    }
    if (e.keyCode === 13 && !e.isDefaultPrevented() && value) {
      this.setValueInSelect(value);
    }
  }

  changeSensetive(e) {
    const { setFieldsValue } = this.props.form;
    this.setState({
      filterSensitive: e.target.value,
    }, () => {
      setFieldsValue({ sensitiveHeaders: [] });
    });
  }

  /* 表单提交 */
  handleSubmit = (e) => {
    e.preventDefault();
    const { id, objectVersionNumber } = this.state.sidebarData;
    this.props.form.validateFields((err, { name, path, serviceId, preffix,
      retryable, customSensitiveHeaders, sensitiveHeaders, helperService }, modify) => {
      if (!err) {
        const { show } = this.state;
        if (show === 'create') {
          const body = {
            name,
            path: path.trim(),
            serviceId,
          };
          this.setState({
            submitting: true,
          });
          axios.post('/manager/v1/routes', JSON.stringify(body)).then(({ failed, message }) => {
            if (failed) {
              Choerodon.prompt(message);
            } else {
              Choerodon.prompt(this.props.intl.formatMessage({ id: 'create.success' }));
              this.loadRouteList();
              this.setState({
                submitting: false,
                visible: false,
              });
            }
          }).catch(Choerodon.handleResponseError);
        } else if (show === 'detail') {
          this.handleCancel();
        } else {
          if (!modify) {
            Choerodon.prompt(this.props.intl.formatMessage({ id: 'modify.success' }));
            this.loadRouteList();
            this.setState({
              visible: false,
            });
            return;
          }
          const isFiltered = customSensitiveHeaders === 'filtered';
          const info = isFiltered ? sensitiveHeaders.join(',') : undefined;
          this.setState({
            submitting: true,
          });
          const body = {
            name,
            path: path.trim(),
            objectVersionNumber,
            helperService,
            serviceId,
            stripPrefix: preffix === 'stripPrefix',
            retryable: retryable === 'retry',
            customSensitiveHeaders: isFiltered,
            sensitiveHeaders: info,
          };
          axios.post(`/manager/v1/routes/${id}`, JSON.stringify(body)).then(({ failed, message }) => {
            if (failed) {
              Choerodon.prompt(message);
            } else {
              Choerodon.prompt(this.props.intl.formatMessage({ id: 'modify.success' }));
              this.loadRouteList();
              this.setState({
                submitting: false,
                visible: false,
              });
            }
          }).catch(Choerodon.handleResponseError);
        }
      }
    });
  }

  /**
   * 路由名称唯一性校验
   * @param rule 规则
   * @param value 路径
   * @param callback 回调
   */
  checkName = (rule, value, callback) => {
    const { intl } = this.props;
    axios.post('/manager/v1/routes/check', JSON.stringify({ name: value }))
      .then(({ failed }) => {
        if (failed) {
          callback(intl.formatMessage({ id: `${intlPrefix}.name.exist.msg` }));
        } else {
          callback();
        }
      });
  }

  checkNamePattern = (rule, value, callback) => {
    const { intl } = this.props;
    const patternEmpty = /^\S+$/;
    const patterNum = /^\d+$/;
    if (!patternEmpty.test(value) || patterNum.test(value)) {
      callback(intl.formatMessage({ id: `${intlPrefix}.name.number.msg` }));
    } else {
      callback();
    }
  }

  /**
   * 路由路径唯一性校验
   * @param rule 规则
   * @param value 路径
   * @param callback 回调
   */
  checkPath = (rule, value, callback) => {
    const { intl } = this.props;
    axios.post('/manager/v1/routes/check', JSON.stringify({ path: value }))
      .then(({ failed }) => {
        if (failed) {
          callback(intl.formatMessage({ id: `${intlPrefix}.path.exist.msg` }));
        } else {
          callback();
        }
      });
  }

  /**
   * 渲染列表操作按钮
   * @param record 当前行数据
   */
  renderAction(record) {
    if (record.builtIn) {
      return (
        <div>
          <Tooltip
            title={<FormattedMessage id="detail" />}
            placement="bottom"
          >
            <Button
              icon="find_in_page"
              size="small"
              shape="circle"
              onClick={this.editOrDetail.bind(this, record, 'detail')}
            />
          </Tooltip>
        </div>
      );
    } else {
      return (
        <div>
          <Permission service={['manager-service.route.update']}>
            <Tooltip
              title={<FormattedMessage id="modify" />}
              placement="bottom"
            >
              <Button
                icon="mode_edit"
                shape="circle"
                size="small"
                onClick={this.editOrDetail.bind(this, record, 'edit')}
              />
            </Tooltip>
          </Permission>
          <Permission service={['manager-service.route.delete']}>
            <Tooltip
              title={<FormattedMessage id="delete" />}
              placement="bottom"
            >
              <Button
                icon="delete_forever"
                shape="circle"
                size="small"
                onClick={this.handleDelete.bind(this, record)}
              />
            </Tooltip>
          </Permission>
        </div>
      );
    }
  }

  /* 渲染侧边栏头部 */
  renderSidebarTitle() {
    const { show } = this.state;
    if (show === 'create') {
      return <FormattedMessage id={`${intlPrefix}.create`} />;
    } else if (show === 'edit') {
      return <FormattedMessage id={`${intlPrefix}.modify`} />;
    } else {
      return <FormattedMessage id={`${intlPrefix}.detail`} />;
    }
  }

  /* 渲染侧边栏成功按钮文字 */
  renderSidebarOkText() {
    const { show } = this.state;
    if (show === 'create') {
      return <FormattedMessage id="create" />;
    } else if (show === 'edit') {
      return <FormattedMessage id="save" />;
    } else {
      return <FormattedMessage id="return" />;
    }
  }

  /* 渲染侧边栏内容 */
  renderSidebarContent() {
    const { intl, AppState } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { show, sidebarData, filterSensitive, helper } = this.state;
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
    const createValidate = show === 'create';
    const detailValidate = show === 'detail';
    const inputWidth = 512;
    const stripPrefix = sidebarData && sidebarData.stripPrefix ? 'stripPrefix' : 'withPrefix';
    const retryable = sidebarData && sidebarData.retryable ? 'retry' : 'noRetry';
    const customSensitiveHeaders = sidebarData && sidebarData.customSensitiveHeaders ? 'filtered' : 'noFiltered';
    const sensitiveHeaders = sidebarData && sidebarData.sensitiveHeaders ? sidebarData.sensitiveHeaders.split(',') : [];
    let code;
    let values;
    if (show === 'create') {
      code = `${intlPrefix}.create`;
      values = {
        name: `${AppState.getSiteInfo.systemName || 'Choerodon'}`,
      };
    } else if (show === 'edit') {
      code = `${intlPrefix}.modify`;
      values = {
        name: sidebarData.name,
      };
    } else if (show === 'detail') {
      code = `${intlPrefix}.detail`;
      values = {
        name: sidebarData.name,
      };
    }
    return (
      <Content
        code={code}
        values={values}
        className="sidebar-content route-form-container"
      >
        <Form layout="vertical">
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('name', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: `${intlPrefix}.name.require.msg` }),
              }, {
                validator: createValidate && this.checkName,
              }, {
                validator: createValidate && this.checkNamePattern,
              }],
              initialValue: createValidate ? undefined : sidebarData.name,
              validateTrigger: 'onBlur',
              validateFirst: true,
            })(
              <Input
                label={<FormattedMessage id={`${intlPrefix}.name`} />}
                autoComplete="off"
                suffix={this.getSuffix(intl.formatMessage({ id: `${intlPrefix}.name.tip` }))}
                style={{ width: inputWidth }}
                disabled={!createValidate}
                ref={(e) => { this.createRouteFocusInput = e; }}
                maxLength={64}
                showLengthInfo={false}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('path', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: `${intlPrefix}.path.require.msg` }),
              }, {
                validator: createValidate && this.checkPath,
              }],
              initialValue: createValidate ? undefined : sidebarData.path,
              validateTrigger: 'onBlur',
              validateFirst: true,
            })(
              <Input
                label={<FormattedMessage id={`${intlPrefix}.path`} />}
                autoComplete="off"
                style={{ width: inputWidth }}
                suffix={this.getSuffix(intl.formatMessage({ id: `${intlPrefix}.path.tip` }))}
                disabled={!createValidate}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('serviceId', {
              rules: [{
                required: true,
                message: intl.formatMessage({ id: `${intlPrefix}.service.require.msg` }),
              }],
              initialValue: createValidate ? undefined : sidebarData.serviceId,
            })(
              <Select
                disabled={detailValidate}
                style={{ width: 300 }}
                label={<FormattedMessage id={`${intlPrefix}.service`} />}
                getPopupContainer={() => document.getElementsByClassName('sidebar-content')[0].parentNode}
                filterOption={
                  (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filter
              >
                {this.getOption()}
              </Select>,
            )}
          </FormItem>
          {!createValidate && (
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('preffix', {
                initialValue: stripPrefix,
              })(
                <RadioGroup
                  label={this.labelSuffix(intl.formatMessage({ id: `${intlPrefix}.stripprefix` }),
                    intl.formatMessage({ id: `${intlPrefix}.stripprefix.tip` }))}
                  className="radioGroup"
                  disabled={detailValidate}
                >
                  <Radio value="stripPrefix">{intl.formatMessage({ id: 'yes' })}</Radio>
                  <Radio value="withPrefix">{intl.formatMessage({ id: 'no' })}</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          )}
          {!createValidate && (
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('retryable', {
                initialValue: retryable,
              })(
                <RadioGroup
                  label={this.labelSuffix(intl.formatMessage({ id: `${intlPrefix}.retryable` }),
                    intl.formatMessage({ id: `${intlPrefix}.retryable.tip` }))}
                  className="radioGroup"
                  disabled={detailValidate}
                >
                  <Radio value="retry">{intl.formatMessage({ id: 'yes' })}</Radio>
                  <Radio value="noRetry">{intl.formatMessage({ id: 'no' })}</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          )}
          {!createValidate && (
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('customSensitiveHeaders', {
                initialValue: customSensitiveHeaders,
              })(
                <RadioGroup
                  label={this.labelSuffix(intl.formatMessage({ id: `${intlPrefix}.customsensitiveheaders` }),
                    intl.formatMessage({ id: `${intlPrefix}.customsensitiveheaders.tip` }))}
                  className="radioGroup"
                  disabled={detailValidate}
                  onChange={this.changeSensetive.bind(this)}
                >
                  <Radio value="filtered">{intl.formatMessage({ id: 'yes' })}</Radio>
                  <Radio value="noFiltered">{intl.formatMessage({ id: 'no' })}</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          )}
          {
            filterSensitive === 'filtered' && !createValidate ? (
              <FormItem
                {...formItemLayout}
              >
                {getFieldDecorator('sensitiveHeaders', {
                  rules: [{
                    required: this.state.filterSensitive === 'filtered' && show === 'edit',
                    message: intl.formatMessage({ id: `${intlPrefix}.sensitiveheaders.require.msg` }),
                  }],
                  initialValue: this.state.filterSensitive === 'filtered' ? sensitiveHeaders : [],
                })(
                  <Select
                    disabled={show === 'detail'}
                    label={<FormattedMessage id={`${intlPrefix}.sensitiveheaders`} />}
                    mode="tags"
                    filterOption={false}
                    onInputKeyDown={this.handleInputKeyDown}
                    ref={this.saveSelectRef}
                    style={{ width: inputWidth }}
                    notFoundContent={false}
                    showNotFindSelectedItem={false}
                    showNotFindInputItem={false}
                    allowClear
                  />,
                )}
              </FormItem>
            ) : ''
          }
          {(show === 'edit' || helper) && (
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('helperService', {
                rules: [{
                  whitespace: show === 'edit',
                  message: intl.formatMessage({ id: `${intlPrefix}.helperservice.require.msg` }),
                }],
                initialValue: sidebarData.helperService || undefined,
              })(
                <Input
                  disabled={detailValidate}
                  autoComplete="off"
                  label={<FormattedMessage id={`${intlPrefix}.helperservice`} />}
                  style={{ width: inputWidth }}
                  suffix={this.getSuffix(intl.formatMessage({ id: `${intlPrefix}.helperservice.tip` }))}
                />,
              )}
            </FormItem>
          )
          }
        </Form>
      </Content>
    );
  }

  render() {
    const { AppState, intl } = this.props;
    const { sort: { columnKey, order }, filters, params, serviceArr } = this.state;
    const { content, loading, pagination, visible, show, submitting } = this.state;
    const { type } = AppState.currentMenuType;
    const filtersService = serviceArr && serviceArr.map(({ name }) => ({
      value: name,
      text: name,
    }));
    const columns = [{
      title: <FormattedMessage id="name" />,
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      filters: [],
      filteredValue: filters.name || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.2}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.path`} />,
      dataIndex: 'path',
      key: 'path',
      width: '20%',
      filters: [],
      filteredValue: filters.path || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.1}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.service`} />,
      dataIndex: 'serviceId',
      key: 'serviceId',
      filters: filtersService,
      filteredValue: filters.serviceId || [],
    }, {
      title: <FormattedMessage id="source" />,
      dataIndex: 'builtIn',
      key: 'builtIn',
      filters: [{
        text: intl.formatMessage({ id: `${intlPrefix}.builtin.predefined` }),
        value: 'true',
      }, {
        text: intl.formatMessage({ id: `${intlPrefix}.builtin.custom` }),
        value: 'false',
      }],
      filteredValue: filters.builtIn || [],
      render: (text, record) => (
        <StatusTag
          mode="icon"
          name={intl.formatMessage({ id: record.builtIn ? 'predefined' : 'custom' })}
          colorCode={record.builtIn ? 'PREDEFINE' : 'CUSTOM'}
        />),
    }, {
      title: '',
      width: '100px',
      key: 'action',
      align: 'right',
      render: (text, record) => this.renderAction(record),
    }];
    return (
      <Page
        className="container"
        service={[
          'manager-service.route.list',
          'manager-service.route.check',
          'manager-service.route.update',
          'manager-service.route.delete',
          'manager-service.route.create',
        ]}
      >
        <Header
          title={<FormattedMessage id={`${intlPrefix}.header.title`} />}
        >
          <Permission service={['manager-service.route.create']}>
            <Button
              icon="playlist_add"
              onClick={this.createRoute}
            >
              <FormattedMessage id={`${intlPrefix}.create`} />
            </Button>
          </Permission>
          <Button
            icon="refresh"
            onClick={this.handleRefresh}
          >
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content
          code={intlPrefix}
          values={{ name: AppState.getSiteInfo.systemName || 'Choerodon' }}
        >
          <Table
            columns={columns}
            dataSource={content}
            loading={loading}
            pagination={pagination}
            onChange={this.handlePageChange}
            filters={params}
            rowKey="id"
            className="c7n-route-table"
            filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
          />
          <Sidebar
            title={this.renderSidebarTitle()}
            visible={visible}
            okText={this.renderSidebarOkText()}
            cancelText="取消"
            onOk={this.handleSubmit}
            onCancel={this.handleCancel}
            okCancel={show !== 'detail'}
            confirmLoading={submitting}
          >
            {this.renderSidebarContent()}
          </Sidebar>
        </Content>
      </Page>
    );
  }
}
