'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

var _tooltip = require('choerodon-ui/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _popover = require('choerodon-ui/lib/popover');

var _popover2 = _interopRequireDefault(_popover);

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _radio = require('choerodon-ui/lib/radio');

var _radio2 = _interopRequireDefault(_radio);

var _form = require('choerodon-ui/lib/form');

var _form2 = _interopRequireDefault(_form);

var _select = require('choerodon-ui/lib/select');

var _select2 = _interopRequireDefault(_select);

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _dec, _dec2, _class;

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/popover/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/radio/style');

require('choerodon-ui/lib/form/style');

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/modal/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactRouterDom = require('react-router-dom');

var _reactIntl = require('react-intl');

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _mobxReact = require('mobx-react');

require('./Route.scss');

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

var _statusTag = require('../../../components/statusTag');

var _statusTag2 = _interopRequireDefault(_statusTag);

require('../../../common/ConfirmModal.scss');

var _util = require('../../../common/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Sidebar = _modal2['default'].Sidebar;

var Option = _select2['default'].Option;
var FormItem = _form2['default'].Item;
var RadioGroup = _radio2['default'].Group;
var intlPrefix = 'global.route';

var Route = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(Route, _Component);

  function Route(props) {
    (0, _classCallCheck3['default'])(this, Route);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (Route.__proto__ || Object.getPrototypeOf(Route)).call(this, props));

    _this.state = _this.getInitState();

    _this.handlePageChange = function (pagination, filters, sorter, params) {
      _this.loadRouteList(pagination, sorter, filters, params);
    };

    _this.createRoute = function () {
      _this.props.form.resetFields();
      _this.setState({
        visible: true,
        show: 'create'
      });
      setTimeout(function () {
        _this.createRouteFocusInput.focus();
      }, 10);
    };

    _this.editOrDetail = function (record, status) {
      _this.props.form.resetFields();
      _this.setState({
        visible: true,
        show: status,
        sidebarData: record,
        helper: record.helperService && status === 'detail',
        filterSensitive: record.customSensitiveHeaders ? 'filtered' : 'noFiltered'
      });
    };

    _this.handleRefresh = function () {
      _this.setState(_this.getInitState(), function () {
        _this.loadRouteList();
        _this.getService();
      });
    };

    _this.handleCancel = function () {
      _this.setState({
        visible: false
      });
    };

    _this.handleDelete = function (record) {
      var intl = _this.props.intl;

      _modal2['default'].confirm({
        className: 'c7n-iam-confirm-modal',
        title: intl.formatMessage({ id: intlPrefix + '.delete.title' }),
        content: intl.formatMessage({ id: intlPrefix + '.delete.content' }, { name: record.name }),
        onOk: function onOk() {
          return _choerodonBootCombine.axios['delete']('/manager/v1/routes/' + record.id).then(function (_ref) {
            var failed = _ref.failed,
                message = _ref.message;

            if (failed) {
              Choerodon.prompt(message);
            } else {
              Choerodon.prompt(intl.formatMessage({ id: 'delete.success' }));
              _this.loadRouteList();
            }
          });
        }
      });
    };

    _this.saveSelectRef = function (node) {
      if (node) {
        _this.rcSelect = node.rcSelect;
      }
    };

    _this.handleInputKeyDown = function (e) {
      var value = e.target.value;

      if (e.keyCode === 32 || e.keyCode === 188) {
        e.preventDefault();
        return false;
      }
      if (e.keyCode === 13 && !e.isDefaultPrevented() && value) {
        _this.setValueInSelect(value);
      }
    };

    _this.handleSubmit = function (e) {
      e.preventDefault();
      var _this$state$sidebarDa = _this.state.sidebarData,
          id = _this$state$sidebarDa.id,
          objectVersionNumber = _this$state$sidebarDa.objectVersionNumber;

      _this.props.form.validateFields(function (err, _ref2, modify) {
        var name = _ref2.name,
            path = _ref2.path,
            serviceId = _ref2.serviceId,
            preffix = _ref2.preffix,
            retryable = _ref2.retryable,
            customSensitiveHeaders = _ref2.customSensitiveHeaders,
            sensitiveHeaders = _ref2.sensitiveHeaders,
            helperService = _ref2.helperService;

        if (!err) {
          var show = _this.state.show;

          if (show === 'create') {
            var body = {
              name: name,
              path: path.trim(),
              serviceId: serviceId
            };
            _this.setState({
              submitting: true
            });
            _choerodonBootCombine.axios.post('/manager/v1/routes', JSON.stringify(body)).then(function (_ref3) {
              var failed = _ref3.failed,
                  message = _ref3.message;

              if (failed) {
                Choerodon.prompt(message);
              } else {
                Choerodon.prompt(_this.props.intl.formatMessage({ id: 'create.success' }));
                _this.loadRouteList();
                _this.setState({
                  submitting: false,
                  visible: false
                });
              }
            })['catch'](Choerodon.handleResponseError);
          } else if (show === 'detail') {
            _this.handleCancel();
          } else {
            if (!modify) {
              Choerodon.prompt(_this.props.intl.formatMessage({ id: 'modify.success' }));
              _this.loadRouteList();
              _this.setState({
                visible: false
              });
              return;
            }
            var isFiltered = customSensitiveHeaders === 'filtered';
            var info = isFiltered ? sensitiveHeaders.join(',') : undefined;
            _this.setState({
              submitting: true
            });
            var _body = {
              name: name,
              path: path.trim(),
              objectVersionNumber: objectVersionNumber,
              helperService: helperService,
              serviceId: serviceId,
              stripPrefix: preffix === 'stripPrefix',
              retryable: retryable === 'retry',
              customSensitiveHeaders: isFiltered,
              sensitiveHeaders: info
            };
            _choerodonBootCombine.axios.post('/manager/v1/routes/' + id, JSON.stringify(_body)).then(function (_ref4) {
              var failed = _ref4.failed,
                  message = _ref4.message;

              if (failed) {
                Choerodon.prompt(message);
              } else {
                Choerodon.prompt(_this.props.intl.formatMessage({ id: 'modify.success' }));
                _this.loadRouteList();
                _this.setState({
                  submitting: false,
                  visible: false
                });
              }
            })['catch'](Choerodon.handleResponseError);
          }
        }
      });
    };

    _this.checkName = function (rule, value, callback) {
      var intl = _this.props.intl;

      _choerodonBootCombine.axios.post('/manager/v1/routes/check', JSON.stringify({ name: value })).then(function (_ref5) {
        var failed = _ref5.failed;

        if (failed) {
          callback(intl.formatMessage({ id: intlPrefix + '.name.exist.msg' }));
        } else {
          callback();
        }
      });
    };

    _this.checkNamePattern = function (rule, value, callback) {
      var intl = _this.props.intl;

      var patternEmpty = /^\S+$/;
      var patterNum = /^\d+$/;
      if (!patternEmpty.test(value) || patterNum.test(value)) {
        callback(intl.formatMessage({ id: intlPrefix + '.name.number.msg' }));
      } else {
        callback();
      }
    };

    _this.checkPath = function (rule, value, callback) {
      var intl = _this.props.intl;

      _choerodonBootCombine.axios.post('/manager/v1/routes/check', JSON.stringify({ path: value })).then(function (_ref6) {
        var failed = _ref6.failed;

        if (failed) {
          callback(intl.formatMessage({ id: intlPrefix + '.path.exist.msg' }));
        } else {
          callback();
        }
      });
    };

    _this.createRouteFocusInput = _react2['default'].createRef();
    return _this;
  }

  (0, _createClass3['default'])(Route, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.loadRouteList();
      this.getService();
    }

    /* 初始化state */

  }, {
    key: 'getInitState',
    value: function getInitState() {
      return {
        visible: false,
        content: null,
        loading: false,
        sidebarData: {},
        isShow: '',
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        sort: {
          columnKey: 'id',
          order: 'descend'
        },
        filters: {},
        params: [],
        record: {},
        serviceArr: [],
        filterSensitive: false,
        submitting: false
      };
    }

    /* 获取sidebar中对应微服务 */

  }, {
    key: 'getOption',
    value: function getOption() {
      var _state$serviceArr = this.state.serviceArr,
          serviceArr = _state$serviceArr === undefined ? [] : _state$serviceArr;

      var services = serviceArr.map(function (_ref7) {
        var name = _ref7.name;
        return _react2['default'].createElement(
          Option,
          { value: name, key: name },
          name
        );
      });
      return services;
    }

    /* 获取所有微服务 */

  }, {
    key: 'getService',
    value: function getService() {
      var _this2 = this;

      _choerodonBootCombine.axios.get('manager/v1/services').then(function (res) {
        _this2.setState({
          serviceArr: res
        });
      });
    }

    /**
     * Input后缀提示
     * @param text
     */

  }, {
    key: 'getSuffix',
    value: function getSuffix(text) {
      return _react2['default'].createElement(
        _popover2['default'],
        {
          getPopupContainer: function getPopupContainer() {
            return document.getElementsByClassName('sidebar-content')[0].parentNode;
          },
          overlayStyle: { maxWidth: '180px' },
          placement: 'right',
          trigger: 'hover',
          content: text
        },
        _react2['default'].createElement(_icon2['default'], { type: 'help' })
      );
    }
  }, {
    key: 'setValueInSelect',
    value: function setValueInSelect(value) {
      var _props$form = this.props.form,
          getFieldValue = _props$form.getFieldValue,
          setFieldsValue = _props$form.setFieldsValue;

      var sensitiveHeaders = getFieldValue('sensitiveHeaders') || [];
      if (sensitiveHeaders.indexOf(value) === -1) {
        sensitiveHeaders.push(value);
        setFieldsValue({
          sensitiveHeaders: sensitiveHeaders
        });
      }
      if (this.rcSelect) {
        this.rcSelect.setState({
          inputValue: ''
        });
      }
    }
  }, {
    key: 'loadRouteList',
    value: function loadRouteList(paginationIn, sortIn, filtersIn, paramsIn) {
      var _this3 = this;

      var _state = this.state,
          paginationState = _state.pagination,
          sortState = _state.sort,
          filtersState = _state.filters,
          paramsState = _state.params;

      var pagination = paginationIn || paginationState;
      var sort = sortIn || sortState;
      var filters = filtersIn || filtersState;
      var params = paramsIn || paramsState;
      // 防止标签闪烁
      this.setState({ filters: filters, loading: true });
      // 若params或filters含特殊字符表格数据置空
      var isIncludeSpecialCode = (0, _util.handleFiltersParams)(params, filters);
      if (isIncludeSpecialCode) {
        this.setState({
          loading: false,
          pagination: {
            total: 0
          },
          content: [],
          sort: sort,
          params: params
        });
        return;
      }

      this.fetch(pagination, sort, filters, params).then(function (data) {
        _this3.setState({
          sort: sort,
          params: params,
          pagination: {
            current: data.number + 1,
            pageSize: data.size,
            total: data.totalElements
          },
          content: data.content,
          loading: false
        });
      })['catch'](function (error) {
        Choerodon.handleResponseError(error);
      });
    }
  }, {
    key: 'fetch',
    value: function fetch(_ref8, _ref9, _ref10, params) {
      var current = _ref8.current,
          pageSize = _ref8.pageSize;
      var _ref9$columnKey = _ref9.columnKey,
          columnKey = _ref9$columnKey === undefined ? 'id' : _ref9$columnKey,
          _ref9$order = _ref9.order,
          order = _ref9$order === undefined ? 'descend' : _ref9$order;
      var name = _ref10.name,
          path = _ref10.path,
          serviceId = _ref10.serviceId,
          builtIn = _ref10.builtIn;

      var queryObj = {
        page: current - 1,
        size: pageSize,
        name: name,
        path: path,
        serviceId: serviceId,
        builtIn: builtIn,
        params: params
      };
      if (columnKey) {
        var sorter = [];
        sorter.push(columnKey);
        if (order === 'descend') {
          sorter.push('desc');
        }
        queryObj.sort = sorter.join(',');
      }
      return _choerodonBootCombine.axios.get('/manager/v1/routes?' + _queryString2['default'].stringify(queryObj));
    }

    /* 刷新 */


    /* 关闭sidebar */


    /* 删除自定义路由 */

  }, {
    key: 'labelSuffix',


    /**
     * label后缀提示
     * @param label label文字
     * @param tip 提示文字
     */

    value: function labelSuffix(label, tip) {
      return _react2['default'].createElement(
        'div',
        { className: 'labelSuffix' },
        _react2['default'].createElement(
          'span',
          null,
          label
        ),
        _react2['default'].createElement(
          _popover2['default'],
          {
            getPopupContainer: function getPopupContainer() {
              return document.getElementsByClassName('sidebar-content')[0].parentNode;
            },
            placement: 'right',
            trigger: 'hover',
            content: tip,
            overlayStyle: { maxWidth: '180px' }
          },
          _react2['default'].createElement(_icon2['default'], { type: 'help' })
        )
      );
    }
  }, {
    key: 'changeSensetive',
    value: function changeSensetive(e) {
      var setFieldsValue = this.props.form.setFieldsValue;

      this.setState({
        filterSensitive: e.target.value
      }, function () {
        setFieldsValue({ sensitiveHeaders: [] });
      });
    }

    /* 表单提交 */


    /**
     * 路由名称唯一性校验
     * @param rule 规则
     * @param value 路径
     * @param callback 回调
     */


    /**
     * 路由路径唯一性校验
     * @param rule 规则
     * @param value 路径
     * @param callback 回调
     */

  }, {
    key: 'renderAction',


    /**
     * 渲染列表操作按钮
     * @param record 当前行数据
     */
    value: function renderAction(record) {
      if (record.builtIn) {
        return _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            _tooltip2['default'],
            {
              title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'detail' }),
              placement: 'bottom'
            },
            _react2['default'].createElement(_button2['default'], {
              icon: 'find_in_page',
              size: 'small',
              shape: 'circle',
              onClick: this.editOrDetail.bind(this, record, 'detail')
            })
          )
        );
      } else {
        return _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            { service: ['manager-service.route.update'] },
            _react2['default'].createElement(
              _tooltip2['default'],
              {
                title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'modify' }),
                placement: 'bottom'
              },
              _react2['default'].createElement(_button2['default'], {
                icon: 'mode_edit',
                shape: 'circle',
                size: 'small',
                onClick: this.editOrDetail.bind(this, record, 'edit')
              })
            )
          ),
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            { service: ['manager-service.route.delete'] },
            _react2['default'].createElement(
              _tooltip2['default'],
              {
                title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'delete' }),
                placement: 'bottom'
              },
              _react2['default'].createElement(_button2['default'], {
                icon: 'delete_forever',
                shape: 'circle',
                size: 'small',
                onClick: this.handleDelete.bind(this, record)
              })
            )
          )
        );
      }
    }

    /* 渲染侧边栏头部 */

  }, {
    key: 'renderSidebarTitle',
    value: function renderSidebarTitle() {
      var show = this.state.show;

      if (show === 'create') {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.create' });
      } else if (show === 'edit') {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.modify' });
      } else {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.detail' });
      }
    }

    /* 渲染侧边栏成功按钮文字 */

  }, {
    key: 'renderSidebarOkText',
    value: function renderSidebarOkText() {
      var show = this.state.show;

      if (show === 'create') {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'create' });
      } else if (show === 'edit') {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'save' });
      } else {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'return' });
      }
    }

    /* 渲染侧边栏内容 */

  }, {
    key: 'renderSidebarContent',
    value: function renderSidebarContent() {
      var _this4 = this;

      var _props = this.props,
          intl = _props.intl,
          AppState = _props.AppState;
      var getFieldDecorator = this.props.form.getFieldDecorator;
      var _state2 = this.state,
          show = _state2.show,
          sidebarData = _state2.sidebarData,
          filterSensitive = _state2.filterSensitive,
          helper = _state2.helper;

      var formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      };
      var createValidate = show === 'create';
      var detailValidate = show === 'detail';
      var inputWidth = 512;
      var stripPrefix = sidebarData && sidebarData.stripPrefix ? 'stripPrefix' : 'withPrefix';
      var retryable = sidebarData && sidebarData.retryable ? 'retry' : 'noRetry';
      var customSensitiveHeaders = sidebarData && sidebarData.customSensitiveHeaders ? 'filtered' : 'noFiltered';
      var sensitiveHeaders = sidebarData && sidebarData.sensitiveHeaders ? sidebarData.sensitiveHeaders.split(',') : [];
      var code = void 0;
      var values = void 0;
      if (show === 'create') {
        code = intlPrefix + '.create';
        values = {
          name: '' + (AppState.getSiteInfo.systemName || 'Choerodon')
        };
      } else if (show === 'edit') {
        code = intlPrefix + '.modify';
        values = {
          name: sidebarData.name
        };
      } else if (show === 'detail') {
        code = intlPrefix + '.detail';
        values = {
          name: sidebarData.name
        };
      }
      return _react2['default'].createElement(
        _choerodonBootCombine.Content,
        {
          code: code,
          values: values,
          className: 'sidebar-content route-form-container'
        },
        _react2['default'].createElement(
          _form2['default'],
          { layout: 'vertical' },
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('name', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: intlPrefix + '.name.require.msg' })
              }, {
                validator: createValidate && this.checkName
              }, {
                validator: createValidate && this.checkNamePattern
              }],
              initialValue: createValidate ? undefined : sidebarData.name,
              validateTrigger: 'onBlur',
              validateFirst: true
            })(_react2['default'].createElement(_input2['default'], {
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.name' }),
              autoComplete: 'off',
              suffix: this.getSuffix(intl.formatMessage({ id: intlPrefix + '.name.tip' })),
              style: { width: inputWidth },
              disabled: !createValidate,
              ref: function ref(e) {
                _this4.createRouteFocusInput = e;
              },
              maxLength: 64,
              showLengthInfo: false
            }))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('path', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: intlPrefix + '.path.require.msg' })
              }, {
                validator: createValidate && this.checkPath
              }],
              initialValue: createValidate ? undefined : sidebarData.path,
              validateTrigger: 'onBlur',
              validateFirst: true
            })(_react2['default'].createElement(_input2['default'], {
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.path' }),
              autoComplete: 'off',
              style: { width: inputWidth },
              suffix: this.getSuffix(intl.formatMessage({ id: intlPrefix + '.path.tip' })),
              disabled: !createValidate
            }))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('serviceId', {
              rules: [{
                required: true,
                message: intl.formatMessage({ id: intlPrefix + '.service.require.msg' })
              }],
              initialValue: createValidate ? undefined : sidebarData.serviceId
            })(_react2['default'].createElement(
              _select2['default'],
              {
                disabled: detailValidate,
                style: { width: 300 },
                label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.service' }),
                getPopupContainer: function getPopupContainer() {
                  return document.getElementsByClassName('sidebar-content')[0].parentNode;
                },
                filterOption: function filterOption(input, option) {
                  return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                },
                filter: true
              },
              this.getOption()
            ))
          ),
          !createValidate && _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('preffix', {
              initialValue: stripPrefix
            })(_react2['default'].createElement(
              RadioGroup,
              {
                label: this.labelSuffix(intl.formatMessage({ id: intlPrefix + '.stripprefix' }), intl.formatMessage({ id: intlPrefix + '.stripprefix.tip' })),
                className: 'radioGroup',
                disabled: detailValidate
              },
              _react2['default'].createElement(
                _radio2['default'],
                { value: 'stripPrefix' },
                intl.formatMessage({ id: 'yes' })
              ),
              _react2['default'].createElement(
                _radio2['default'],
                { value: 'withPrefix' },
                intl.formatMessage({ id: 'no' })
              )
            ))
          ),
          !createValidate && _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('retryable', {
              initialValue: retryable
            })(_react2['default'].createElement(
              RadioGroup,
              {
                label: this.labelSuffix(intl.formatMessage({ id: intlPrefix + '.retryable' }), intl.formatMessage({ id: intlPrefix + '.retryable.tip' })),
                className: 'radioGroup',
                disabled: detailValidate
              },
              _react2['default'].createElement(
                _radio2['default'],
                { value: 'retry' },
                intl.formatMessage({ id: 'yes' })
              ),
              _react2['default'].createElement(
                _radio2['default'],
                { value: 'noRetry' },
                intl.formatMessage({ id: 'no' })
              )
            ))
          ),
          !createValidate && _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('customSensitiveHeaders', {
              initialValue: customSensitiveHeaders
            })(_react2['default'].createElement(
              RadioGroup,
              {
                label: this.labelSuffix(intl.formatMessage({ id: intlPrefix + '.customsensitiveheaders' }), intl.formatMessage({ id: intlPrefix + '.customsensitiveheaders.tip' })),
                className: 'radioGroup',
                disabled: detailValidate,
                onChange: this.changeSensetive.bind(this)
              },
              _react2['default'].createElement(
                _radio2['default'],
                { value: 'filtered' },
                intl.formatMessage({ id: 'yes' })
              ),
              _react2['default'].createElement(
                _radio2['default'],
                { value: 'noFiltered' },
                intl.formatMessage({ id: 'no' })
              )
            ))
          ),
          filterSensitive === 'filtered' && !createValidate ? _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('sensitiveHeaders', {
              rules: [{
                required: this.state.filterSensitive === 'filtered' && show === 'edit',
                message: intl.formatMessage({ id: intlPrefix + '.sensitiveheaders.require.msg' })
              }],
              initialValue: this.state.filterSensitive === 'filtered' ? sensitiveHeaders : []
            })(_react2['default'].createElement(_select2['default'], {
              disabled: show === 'detail',
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.sensitiveheaders' }),
              mode: 'tags',
              filterOption: false,
              onInputKeyDown: this.handleInputKeyDown,
              ref: this.saveSelectRef,
              style: { width: inputWidth },
              notFoundContent: false,
              showNotFindSelectedItem: false,
              showNotFindInputItem: false,
              allowClear: true
            }))
          ) : '',
          (show === 'edit' || helper) && _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('helperService', {
              rules: [{
                whitespace: show === 'edit',
                message: intl.formatMessage({ id: intlPrefix + '.helperservice.require.msg' })
              }],
              initialValue: sidebarData.helperService || undefined
            })(_react2['default'].createElement(_input2['default'], {
              disabled: detailValidate,
              autoComplete: 'off',
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.helperservice' }),
              style: { width: inputWidth },
              suffix: this.getSuffix(intl.formatMessage({ id: intlPrefix + '.helperservice.tip' }))
            }))
          )
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var _props2 = this.props,
          AppState = _props2.AppState,
          intl = _props2.intl;
      var _state3 = this.state,
          _state3$sort = _state3.sort,
          columnKey = _state3$sort.columnKey,
          order = _state3$sort.order,
          filters = _state3.filters,
          params = _state3.params,
          serviceArr = _state3.serviceArr;
      var _state4 = this.state,
          content = _state4.content,
          loading = _state4.loading,
          pagination = _state4.pagination,
          visible = _state4.visible,
          show = _state4.show,
          submitting = _state4.submitting;
      var type = AppState.currentMenuType.type;

      var filtersService = serviceArr && serviceArr.map(function (_ref11) {
        var name = _ref11.name;
        return {
          value: name,
          text: name
        };
      });
      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'name' }),
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        filters: [],
        filteredValue: filters.name || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.2 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.path' }),
        dataIndex: 'path',
        key: 'path',
        width: '20%',
        filters: [],
        filteredValue: filters.path || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.service' }),
        dataIndex: 'serviceId',
        key: 'serviceId',
        filters: filtersService,
        filteredValue: filters.serviceId || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'source' }),
        dataIndex: 'builtIn',
        key: 'builtIn',
        filters: [{
          text: intl.formatMessage({ id: intlPrefix + '.builtin.predefined' }),
          value: 'true'
        }, {
          text: intl.formatMessage({ id: intlPrefix + '.builtin.custom' }),
          value: 'false'
        }],
        filteredValue: filters.builtIn || [],
        render: function render(text, record) {
          return _react2['default'].createElement(_statusTag2['default'], {
            mode: 'icon',
            name: intl.formatMessage({ id: record.builtIn ? 'predefined' : 'custom' }),
            colorCode: record.builtIn ? 'PREDEFINE' : 'CUSTOM'
          });
        }
      }, {
        title: '',
        width: '100px',
        key: 'action',
        align: 'right',
        render: function render(text, record) {
          return _this5.renderAction(record);
        }
      }];
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          className: 'container',
          service: ['manager-service.route.list', 'manager-service.route.check', 'manager-service.route.update', 'manager-service.route.delete', 'manager-service.route.create']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          {
            title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' })
          },
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            { service: ['manager-service.route.create'] },
            _react2['default'].createElement(
              _button2['default'],
              {
                icon: 'playlist_add',
                onClick: this.createRoute
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.create' })
            )
          ),
          _react2['default'].createElement(
            _button2['default'],
            {
              icon: 'refresh',
              onClick: this.handleRefresh
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'refresh' })
          )
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          {
            code: intlPrefix,
            values: { name: AppState.getSiteInfo.systemName || 'Choerodon' }
          },
          _react2['default'].createElement(_table2['default'], {
            columns: columns,
            dataSource: content,
            loading: loading,
            pagination: pagination,
            onChange: this.handlePageChange,
            filters: params,
            rowKey: 'id',
            className: 'c7n-route-table',
            filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
          }),
          _react2['default'].createElement(
            Sidebar,
            {
              title: this.renderSidebarTitle(),
              visible: visible,
              okText: this.renderSidebarOkText(),
              cancelText: '\u53D6\u6D88',
              onOk: this.handleSubmit,
              onCancel: this.handleCancel,
              okCancel: show !== 'detail',
              confirmLoading: submitting
            },
            this.renderSidebarContent()
          )
        )
      );
    }
  }]);
  return Route;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = Route;