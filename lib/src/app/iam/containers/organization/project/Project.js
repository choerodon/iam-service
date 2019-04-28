'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _checkbox = require('choerodon-ui/lib/checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _tooltip = require('choerodon-ui/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _select = require('choerodon-ui/lib/select');

var _select2 = _interopRequireDefault(_select);

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _form = require('choerodon-ui/lib/form');

var _form2 = _interopRequireDefault(_form);

var _dec, _dec2, _class;

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/checkbox/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/radio/style');

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/modal/style');

require('choerodon-ui/lib/form/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _mobxReact = require('mobx-react');

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactIntl = require('react-intl');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./Project.scss');

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

var _statusTag = require('../../../components/statusTag');

var _statusTag2 = _interopRequireDefault(_statusTag);

var _util = require('../../../common/util');

var _avatarUploader = require('../../../components/avatarUploader');

var _avatarUploader2 = _interopRequireDefault(_avatarUploader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var HeaderStore = _choerodonBootCombine.stores.HeaderStore;

var FormItem = _form2['default'].Item;
var ORGANIZATION_TYPE = 'organization';
var PROJECT_TYPE = 'project';
var Sidebar = _modal2['default'].Sidebar;

var Option = _select2['default'].Option;
var RadioGroup = _radio2['default'].Group;
var intlPrefix = 'organization.project';
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
var isNum = /^\d+$/;

var Project = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(Project, _Component);

  function Project(props) {
    (0, _classCallCheck3['default'])(this, Project);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (Project.__proto__ || Object.getPrototypeOf(Project)).call(this, props));

    _this.linkToChange = function (url) {
      var history = _this.props.history;

      history.push(url);
    };

    _this.loadProjectTypes = function () {
      var ProjectStore = _this.props.ProjectStore;

      ProjectStore.loadProjectTypes().then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          ProjectStore.setProjectTypes(data);
        }
      })['catch'](function (error) {
        Choerodon.handleResponseError(error);
      });
    };

    _this.loadProjects = function (paginationIn, sortIn, filtersIn) {
      var _this$state = _this.state,
          paginationState = _this$state.pagination,
          sortState = _this$state.sort,
          filtersState = _this$state.filters;

      var pagination = paginationIn || paginationState;
      var sort = sortIn || sortState;
      var filters = filtersIn || filtersState;
      var _this$props = _this.props,
          AppState = _this$props.AppState,
          ProjectStore = _this$props.ProjectStore;

      var menuType = AppState.currentMenuType;
      var organizationId = menuType.id;
      ProjectStore.changeLoading(true);
      // 防止标签闪烁
      _this.setState({ filters: filters });
      // 若params或filters含特殊字符表格数据置空
      var currentParams = filters.params;
      var currentFilters = {
        name: filters.name,
        code: filters.code,
        enabled: filters.enabled
      };
      var isIncludeSpecialCode = (0, _util.handleFiltersParams)(currentParams, currentFilters);
      if (isIncludeSpecialCode) {
        ProjectStore.changeLoading(false);
        ProjectStore.setProjectData([]);
        _this.setState({
          sort: sort,
          pagination: {
            total: 0
          }
        });
        return;
      }

      ProjectStore.loadProject(organizationId, pagination, sort, filters).then(function (data) {
        ProjectStore.changeLoading(false);
        ProjectStore.setProjectData(data.content);
        _this.setState({
          sort: sort,
          pagination: {
            current: data.number + 1,
            pageSize: data.size,
            total: data.totalElements
          }
        });
      })['catch'](function (error) {
        return Choerodon.handleResponseError(error);
      });
    };

    _this.handleopenTab = function (data, operation) {
      var _this$props2 = _this.props,
          form = _this$props2.form,
          ProjectStore = _this$props2.ProjectStore,
          AppState = _this$props2.AppState;

      var menuType = AppState.currentMenuType;
      var organizationId = menuType.id;
      form.resetFields();
      _this.setState({
        errorMeg: '',
        successMeg: '',
        projectDatas: data || { name: null },
        operation: operation,
        imgUrl: operation === 'edit' ? data.imageUrl : null,
        sidebar: true
      });
      if (operation === 'edit') {
        setTimeout(function () {
          _this.editFocusInput.input.focus();
        }, 10);
      } else if (operation === 'create') {
        setTimeout(function () {
          _this.createFocusInput.input.focus();
        }, 10);
      } else {
        form.resetFields();
        ProjectStore.getProjectsByGroupId(data.id).then(function (groupData) {
          if (groupData.failed) {
            Choerodon.prompt(groupData.message);
          } else {
            ProjectStore.setCurrentGroup(data);
            ProjectStore.setGroupProjects(groupData);
            if (groupData.length === 0) {
              ProjectStore.addNewProjectToGroup();
            }
          }
          ProjectStore.getAgileProject(organizationId, data.id).then(function (optionAgileData) {
            if (optionAgileData.failed) {
              Choerodon.prompt(optionAgileData.message);
            } else {
              ProjectStore.setOptionAgileData(optionAgileData);
            }
          });
        });
      }
    };

    _this.handleTabClose = function () {
      if (_this.state.isShowAvatar) {
        _this.setState({
          isShowAvatar: false
        });
        return;
      }
      _this.setState({
        sidebar: false,
        submitting: false
      });
      _this.props.ProjectStore.setGroupProjects([]);
      _this.props.ProjectStore.setCurrentGroup(null);
      _this.props.ProjectStore.clearProjectRelationNeedRemove();
    };

    _this.handleSubmit = function (e) {
      e.preventDefault();
      var _this$props3 = _this.props,
          AppState = _this$props3.AppState,
          ProjectStore = _this$props3.ProjectStore;
      var _this$state2 = _this.state,
          projectDatas = _this$state2.projectDatas,
          imgUrl = _this$state2.imgUrl;

      var menuType = AppState.currentMenuType;
      var organizationId = menuType.id;
      var data = void 0;
      if (_this.state.operation === 'create') {
        var validateFields = _this.props.form.validateFields;

        validateFields(function (err, _ref) {
          var code = _ref.code,
              name = _ref.name,
              type = _ref.type,
              category = _ref.category;

          if (!err) {
            data = {
              code: code,
              name: name.trim(),
              organizationId: organizationId,
              category: category,
              type: type === 'no' || undefined ? null : type,
              imageUrl: imgUrl || null
            };

            _this.setState({ submitting: true });
            ProjectStore.createProject(organizationId, data).then(function (value) {
              _this.setState({ submitting: false });
              if (value) {
                Choerodon.prompt(_this.props.intl.formatMessage({ id: 'create.success' }));
                _this.handleTabClose();
                _this.loadProjects();
                var targetType = ProjectStore.getProjectTypes.find(function (item) {
                  return item.code === value.type;
                });
                value.typeName = targetType ? targetType.name : null;
                value.type = 'project';
                HeaderStore.addProject(value);
              }
            })['catch'](function (error) {
              Choerodon.handleResponseError(error);
              _this.setState({
                submitting: false,
                visibleCreate: false
              });
            });
          }
        });
      } else if (_this.state.operation === 'edit') {
        var _validateFields = _this.props.form.validateFields;

        _validateFields(function (err, _ref2, modify) {
          var name = _ref2.name,
              type = _ref2.type;

          if (!err) {
            if (projectDatas.imageUrl !== imgUrl) modify = true;
            if (!modify) {
              Choerodon.prompt(_this.props.intl.formatMessage({ id: 'modify.success' }));
              _this.handleTabClose();
              return;
            }
            data = {
              name: name.trim(),
              type: type === 'no' || undefined ? null : type,
              imageUrl: imgUrl || null
            };
            _this.setState({ submitting: true, buttonClicked: true });
            ProjectStore.updateProject(organizationId, (0, _extends3['default'])({}, data, {
              objectVersionNumber: projectDatas.objectVersionNumber,
              code: projectDatas.code
            }), _this.state.projectDatas.id).then(function (value) {
              _this.setState({ submitting: false, buttonClicked: false });
              if (value) {
                Choerodon.prompt(_this.props.intl.formatMessage({ id: 'modify.success' }));
                _this.handleTabClose();
                _this.loadProjects();
                value.type = 'project';
                HeaderStore.updateProject(value);
              }
            })['catch'](function (error) {
              Choerodon.handleResponseError(error);
            });
          }
        });
      } else {
        var _validateFields2 = _this.props.form.validateFields;

        _validateFields2(function (err, rawData) {
          if (!err) {
            _this.setState({ submitting: true, buttonClicked: true });
            ProjectStore.axiosDeleteProjectsFromGroup();
            ProjectStore.saveProjectGroup(rawData).then(function (savedData) {
              if (savedData.failed) {
                Choerodon.prompt(_this.props.intl.formatMessage({ id: savedData.message }));
                _this.setState({ submitting: false, buttonClicked: false, sidebar: true });
              } else {
                Choerodon.prompt(_this.props.intl.formatMessage({ id: 'save.success' }));
                _this.setState({ submitting: false, buttonClicked: false, sidebar: false });
              }
            })['catch'](function (error) {
              Choerodon.prompt(_this.props.intl.formatMessage({ id: 'save.error' }));
              Choerodon.handleResponseError(error);
            })['finally'](function () {
              _this.setState({ submitting: false });
            });
          }
        });
      }
    };

    _this.getSelectedProject = function () {
      var fieldsValue = _this.props.form.getFieldsValue();
      return Object.keys(fieldsValue).filter(function (v) {
        return isNum.test(v);
      }).map(function (v) {
        return fieldsValue[v];
      });
    };

    _this.disabledStartDate = function (startValue, index) {
      var _this$props4 = _this.props,
          _this$props4$ProjectS = _this$props4.ProjectStore,
          disabledTime = _this$props4$ProjectS.disabledTime,
          currentGroup = _this$props4$ProjectS.currentGroup,
          form = _this$props4.form;

      var projectId = form.getFieldValue(index);
      var endDate = form.getFieldValue('endDate-' + index);
      if (!startValue) return false;
      if (currentGroup.category === 'ANALYTICAL') return false;
      if (!startValue) return false;
      // 结束时间没有选的时候
      if (!endDate) {
        return disabledTime[projectId] && disabledTime[projectId].some(function (_ref3) {
          var start = _ref3.start,
              end = _ref3.end;

          if (end === null) {
            end = '2199-12-31';
          }
          // 若有不在可选范围之内的（开始前，结束后是可选的）则返回true
          return !(startValue.isBefore((0, _moment2['default'])(start)) || startValue.isAfter((0, _moment2['default'])(end).add(1, 'hours')));
        });
      }
      if (endDate && startValue && startValue.isAfter((0, _moment2['default'])(endDate).add(1, 'hours'))) {
        return true;
      }
      var lastDate = (0, _moment2['default'])('1970-12-31');
      if (disabledTime[projectId]) {
        disabledTime[projectId].forEach(function (data) {
          if (data.end && (0, _moment2['default'])(data.end).isAfter(lastDate) && (0, _moment2['default'])(data.end).isBefore((0, _moment2['default'])(endDate))) lastDate = (0, _moment2['default'])(data.end);
        });
      }
      return !(startValue.isBefore((0, _moment2['default'])(endDate).add(1, 'hours')) && startValue.isAfter((0, _moment2['default'])(lastDate).add(1, 'hours')));
    };

    _this.disabledEndDate = function (endValue, index) {
      var _this$props5 = _this.props,
          _this$props5$ProjectS = _this$props5.ProjectStore,
          disabledTime = _this$props5$ProjectS.disabledTime,
          currentGroup = _this$props5$ProjectS.currentGroup,
          form = _this$props5.form;

      var projectId = form.getFieldValue(index);
      var startDate = form.getFieldValue('startDate-' + index);
      if (!endValue) return false;

      // 开始时间没有选的时候
      if (!startDate) {
        return disabledTime[projectId] && disabledTime[projectId].some(function (_ref4) {
          var start = _ref4.start,
              end = _ref4.end;

          if (end === null) {
            end = '2199-12-31';
          }
          // 若有不在可选范围之内的（开始前，结束后是可选的）则返回true
          return !(endValue.isBefore((0, _moment2['default'])(start)) || endValue.isAfter((0, _moment2['default'])(end).add(1, 'hours')));
        });
      }
      if (startDate && endValue && endValue.isBefore(startDate)) {
        return true;
      }

      if (currentGroup.category === 'ANALYTICAL') return false;
      var earlyDate = (0, _moment2['default'])('2199-12-31');
      if (disabledTime[projectId]) {
        disabledTime[projectId].forEach(function (data) {
          if ((0, _moment2['default'])(data.start).isBefore(earlyDate) && (0, _moment2['default'])(data.start).isAfter(startDate)) earlyDate = (0, _moment2['default'])(data.start);
        });
      }
      return !(endValue.isAfter((0, _moment2['default'])(startDate).subtract(1, 'hours')) && endValue.isBefore(earlyDate));
    };

    _this.handleEnable = function (record) {
      var _this$props6 = _this.props,
          ProjectStore = _this$props6.ProjectStore,
          AppState = _this$props6.AppState,
          intl = _this$props6.intl;

      var userId = AppState.getUserId;
      var menuType = AppState.currentMenuType;
      var orgId = menuType.id;
      ProjectStore.enableProject(orgId, record.id, record.enabled).then(function (value) {
        Choerodon.prompt(intl.formatMessage({ id: record.enabled ? 'disable.success' : 'enable.success' }));
        _this.loadProjects();
        HeaderStore.axiosGetOrgAndPro(sessionStorage.userId || userId).then(function (org) {
          org[0].forEach(function (item) {
            item.type = ORGANIZATION_TYPE;
          });
          org[1].forEach(function (item) {
            item.type = PROJECT_TYPE;
          });
          HeaderStore.setProData(org[0]);
          HeaderStore.setProData(org[1]);
          _this.forceUpdate();
        });
      })['catch'](function (error) {
        Choerodon.prompt(intl.formatMessage({ id: 'operation.error' }));
      });
    };

    _this.checkCode = function (rule, value, callback) {
      var _this$props7 = _this.props,
          AppState = _this$props7.AppState,
          ProjectStore = _this$props7.ProjectStore,
          intl = _this$props7.intl;

      var menuType = AppState.currentMenuType;
      var organizationId = menuType.id;
      var params = { code: value };
      ProjectStore.checkProjectCode(organizationId, params).then(function (mes) {
        if (mes.failed) {
          callback(intl.formatMessage({ id: intlPrefix + '.code.exist.msg' }));
        } else {
          callback();
        }
      });
    };

    _this.getOption = function (current) {
      var _this$props8 = _this.props,
          _this$props8$ProjectS = _this$props8.ProjectStore,
          optionAgileData = _this$props8$ProjectS.optionAgileData,
          groupProjects = _this$props8$ProjectS.groupProjects,
          form = _this$props8.form;

      if (groupProjects[current].id) {
        var _groupProjects$curren = groupProjects[current],
            projectId = _groupProjects$curren.projectId,
            projName = _groupProjects$curren.projName,
            code = _groupProjects$curren.code;

        var options = [];
        options.push(_react2['default'].createElement(
          Option,
          { value: projectId, key: projectId, title: projName },
          _react2['default'].createElement(
            _tooltip2['default'],
            { title: code, placement: 'right', align: { offset: [20, 0] } },
            _react2['default'].createElement(
              'span',
              { style: { display: 'inline-block', width: '100%' } },
              projName
            )
          )
        ));
        return options;
      }
      return optionAgileData.filter(function (value) {
        return _this.getSelectedProject().every(function (existProject) {
          return existProject !== value.id || existProject === form.getFieldValue(current);
        });
      }).filter(function (v) {
        return v.code;
      }).reduce(function (options, _ref5) {
        var id = _ref5.id,
            name = _ref5.name,
            enabled = _ref5.enabled,
            code = _ref5.code;

        options.push(_react2['default'].createElement(
          Option,
          { value: id, key: id, title: name },
          _react2['default'].createElement(
            _tooltip2['default'],
            { title: code, placement: 'right', align: { offset: [20, 0] } },
            _react2['default'].createElement(
              'span',
              { style: { display: 'inline-block', width: '100%' } },
              name
            )
          )
        ));
        return options;
      }, []);
    };

    _this.handleSelectProject = function (projectId, index) {
      var _this$props9 = _this.props,
          groupProjects = _this$props9.ProjectStore.groupProjects,
          ProjectStore = _this$props9.ProjectStore;

      ProjectStore.setGroupProjectByIndex(index, { projectId: projectId, startDate: groupProjects[index].startDate, endDate: groupProjects[index].endDate, enabled: groupProjects[index].enabled });
    };

    _this.handleCheckboxChange = function (value, index) {
      var _this$props10 = _this.props,
          form = _this$props10.form,
          ProjectStore = _this$props10.ProjectStore,
          _this$props10$Project = _this$props10.ProjectStore,
          groupProjects = _this$props10$Project.groupProjects,
          currentGroup = _this$props10$Project.currentGroup;

      if (currentGroup.category === 'ANALYTICAL') return;
      if ((form.getFieldValue('startDate-' + index) && form.getFieldValue('startDate-' + index).format('YYYY-MM-DD 00:00:00')) !== groupProjects[index].startDate || (form.getFieldValue('endDate-' + index) && form.getFieldValue('endDate-' + index).format('YYYY-MM-DD 00:00:00')) !== groupProjects[index].endDate) return;
      if (value && value.target.checked && groupProjects[index].id) {
        ProjectStore.checkCanEnable(groupProjects[index].id).then(function (data) {
          var newValue = {};
          newValue['enabled-' + index] = false;
          newValue['startDate-' + index] = null;
          newValue['endDate-' + index] = null;
          if (data.result === false) {
            Choerodon.prompt('\u8BE5\u9879\u76EE\u5F53\u524D\u65F6\u95F4\u6BB5\u4E0E\u9879\u76EE\u7FA4"' + data.projectName + '"\u4E2D\u7684\u8BE5\u9879\u76EE\u6709\u51B2\u7A81');
            form.setFieldsValue(newValue);
            ProjectStore.setGroupProject((0, _extends3['default'])({}, groupProjects[index], { enabled: !groupProjects.enabled }));
            form.resetFields('enabled-' + index);
          }
        });
      }
    };

    _this.validateDate = function (projectId, index, callback) {
      var _this$props11 = _this.props,
          _this$props11$Project = _this$props11.ProjectStore,
          disabledTime = _this$props11$Project.disabledTime,
          groupProjects = _this$props11$Project.groupProjects,
          form = _this$props11.form,
          ProjectStore = _this$props11.ProjectStore;

      if (!projectId) callback();
      if (groupProjects[projectId] && groupProjects[projectId].id) callback();
      if (projectId) {
        ProjectStore.setDisabledTime(projectId).then(function () {
          if (disabledTime[projectId]) {
            var startValue = form.getFieldValue('startDate-' + index);
            var endValue = form.getFieldValue('endDate-' + index);
            if (_this.disabledStartDate(startValue, index) || _this.disabledEndDate(endValue, index)) {
              callback('日期冲突，请重新选择日期');
            } else {
              callback();
            }
          }
        })['catch'](function (err) {
          callback('网络错误');
          Choerodon.handleResponseError(err);
        });
      }
    };

    _this.getAddGroupProjectContent = function (operation) {
      var _this$props12 = _this.props,
          intl = _this$props12.intl,
          groupProjects = _this$props12.ProjectStore.groupProjects,
          form = _this$props12.form;
      var getFieldDecorator = form.getFieldDecorator;

      if (operation !== 'add') return;
      var formItems = groupProjects.map(function (_ref6, index) {
        var projectId = _ref6.projectId,
            startDate = _ref6.startDate,
            endDate = _ref6.endDate,
            enabled = _ref6.enabled,
            id = _ref6.id;

        var key = !projectId ? 'project-index-' + index : String(projectId);
        return _react2['default'].createElement(
          _react2['default'].Fragment,
          { key: key },
          _react2['default'].createElement(
            FormItem,
            (0, _extends3['default'])({}, formItemLayout, {
              key: key,
              className: 'c7n-iam-project-inline-formitem'
            }),
            getFieldDecorator('' + index, {
              initialValue: projectId,
              rules: [{
                required: true,
                message: '请选择项目'
              }, {
                validator: function validator(rule, value, callback) {
                  return _this.validateDate(value, index, callback);
                }
              }]
            })(_react2['default'].createElement(
              _select2['default'],
              {
                className: 'member-role-select',
                style: { width: 200, marginTop: -2 },
                label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'organization.project.name' }),
                disabled: !!id,
                onChange: function onChange(e) {
                  return _this.handleSelectProject(e, index);
                },
                filterOption: function filterOption(input, option) {
                  var childNode = option.props.children;
                  if (childNode && _react2['default'].isValidElement(childNode)) {
                    return childNode.props.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  }
                  return false;
                },
                filter: true
              },
              _this.getOption(index)
            ))
          ),
          _react2['default'].createElement(
            FormItem,
            (0, _extends3['default'])({}, formItemLayout, {
              className: 'c7n-iam-project-inline-formitem c7n-iam-project-inline-formitem-checkbox'
            }),
            getFieldDecorator('enabled-' + index, {
              initialValue: enabled
            })(_react2['default'].createElement(
              _checkbox2['default'],
              { onChange: function onChange(value) {
                  return _this.handleCheckboxChange(value, index);
                }, checked: form.getFieldValue('enabled-' + index) },
              '\u662F\u5426\u542F\u7528'
            ))
          ),
          _react2['default'].createElement(_button2['default'], {
            size: 'small',
            icon: 'delete',
            shape: 'circle',
            onClick: function onClick() {
              return _this.removeProjectFromGroup(index);
            }
            // disabled={roleIds.length === 1 && selectType === 'create'}
            , className: 'c7n-iam-project-inline-formitem-button'
          })
        );
      });
      return formItems;
    };

    _this.removeProjectFromGroup = function (index) {
      _this.props.ProjectStore.removeProjectFromGroup(index);
      _this.props.form.resetFields();
    };

    _this.openAvatarUploader = function () {
      _this.setState({
        isShowAvatar: true
      });
    };

    _this.closeAvatarUploader = function (visible) {
      _this.setState({
        isShowAvatar: visible
      });
    };

    _this.handleUploadOk = function (res) {
      _this.setState({
        imgUrl: res,
        isShowAvatar: false
      });
    };

    _this.goToProject = function (record) {
      if (_this.canGotoProject(record)) {
        window.location = '#/?type=project&id=' + record.id + '&name=' + record.name + '&organizationId=' + record.organizationId;
      }
    };

    _this.canGotoProject = function (record) {
      return HeaderStore.proData.some(function (v) {
        return v.id === record.id;
      });
    };

    _this.getGotoTips = function (record) {
      if (_this.canGotoProject(record)) {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.redirect', values: { name: record.name } });
      } else if (!record.enabled) {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.redirect.disable' });
      } else {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.redirect.no-permission' });
      }
    };

    _this.getAddOtherBtn = function () {
      return _react2['default'].createElement(
        _button2['default'],
        { type: 'primary', className: 'add-other-project', icon: 'add', onClick: _this.addProjectList },
        _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'organization.project.add.project' })
      );
    };

    _this.addProjectList = function () {
      var _this$props13 = _this.props,
          ProjectStore = _this$props13.ProjectStore,
          AppState = _this$props13.AppState,
          intl = _this$props13.intl;

      ProjectStore.addNewProjectToGroup();
    };

    _this.getCategoryIcon = function (category) {
      switch (category) {
        case 'AGILE':
          return 'project';
        case 'PROGRAM':
          return 'project_program';
        case 'ANALYTICAL':
          return 'project_program_analyze';
        default:
          return 'project';
      }
    };

    _this.state = {
      sidebar: false,
      page: 0,
      id: '',
      open: false,
      projectDatas: {
        name: null
      },
      visible: false,
      visibleCreate: false,
      checkName: false,
      buttonClicked: false,
      filters: {
        params: []
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: ''
      },
      sort: {
        columnKey: null,
        order: null
      },
      submitting: false,
      isShowAvatar: false,
      imgUrl: null
    };
    _this.editFocusInput = _react2['default'].createRef();
    _this.createFocusInput = _react2['default'].createRef();
    return _this;
  }

  (0, _createClass3['default'])(Project, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.setState({
        isLoading: true
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadProjects();
      this.loadProjectTypes();
    }

    /**
     * 获得所有的在前端被选择过的项目id
     * @returns {any[]}
     */


    /**
     * 根据index获得不同的可选时间
     * @param startValue
     * @param index
     * @returns {boolean}
     */


    /**
     * 根据index获得不同的可选时间
     * @param endValue
     * @param index
     */


    /* 停用启用 */

  }, {
    key: 'handlePageChange',


    /* 分页处理 */
    value: function handlePageChange(pagination, filters, sorter, params) {
      filters.params = params;
      this.loadProjects(pagination, sorter, filters);
    }
  }, {
    key: 'handleDatePickerOpen',
    value: function () {
      var _ref7 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee(index) {
        var form;
        return _regenerator2['default'].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                form = this.props.form;

                if (form.getFieldValue('' + index)) {
                  form.validateFields(['' + index], { force: true });
                }
                this.forceUpdate();

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function handleDatePickerOpen(_x) {
        return _ref7.apply(this, arguments);
      }

      return handleDatePickerOpen;
    }()

    /**
     * 校验项目编码唯一性
     * @param value 项目编码
     * @param callback 回调函数
     */

  }, {
    key: 'renderSideTitle',
    value: function renderSideTitle() {
      switch (this.state.operation) {
        case 'create':
          return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.create' });
        case 'edit':
          return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.modify' });
        default:
          return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.config-sub-project' });
      }
    }
  }, {
    key: 'getSidebarContentInfo',
    value: function getSidebarContentInfo(operation) {
      var AppState = this.props.AppState;

      var menuType = AppState.currentMenuType;
      var orgname = menuType.name;
      switch (operation) {
        case 'create':
          return {
            code: intlPrefix + '.create',
            values: {
              name: orgname
            }
          };
        case 'edit':
          return {
            code: intlPrefix + '.modify',
            values: {
              name: this.state.projectDatas.code
            }
          };
        default:
          return {
            code: intlPrefix + '.config-sub-project',
            values: {
              app: this.state.projectDatas.category === 'ANALYTICAL' ? '分析型项目群' : '普通项目群',
              name: this.state.projectDatas.code
            }
          };
      }
    }
  }, {
    key: 'renderSidebarContent',
    value: function renderSidebarContent() {
      var _this2 = this;

      var _props = this.props,
          intl = _props.intl,
          ProjectStore = _props.ProjectStore,
          form = _props.form;
      var getFieldDecorator = form.getFieldDecorator;
      var _state = this.state,
          operation = _state.operation,
          projectDatas = _state.projectDatas;

      var types = ProjectStore.getProjectTypes;
      var inputWidth = 512;
      var contentInfo = this.getSidebarContentInfo(operation);

      return _react2['default'].createElement(
        _choerodonBootCombine.Content,
        (0, _extends3['default'])({}, contentInfo, {
          className: 'sidebar-content'
        }),
        _react2['default'].createElement(
          _form2['default'],
          { layout: 'vertical', className: 'rightForm', style: { width: operation === 'add' ? 512 : 800 } },
          operation === 'create' && operation !== 'add' && _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('category', {
              initialValue: 'AGILE'
            })(_react2['default'].createElement(
              _select2['default'],
              { label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.type.category' }), style: { width: 512 } },
              ['AGILE', 'PROGRAM'].map(function (value) {
                return _react2['default'].createElement(
                  Option,
                  { value: value, key: value },
                  intl.formatMessage({ id: intlPrefix + '.' + value.toLowerCase() + '.project' })
                );
              })
            ))
          ),
          operation === 'create' && operation !== 'add' && _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('code', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: intlPrefix + '.code.require.msg' })
              }, {
                max: 14,
                message: intl.formatMessage({ id: intlPrefix + '.code.length.msg' })
              }, {
                pattern: /^[a-z](([a-z0-9]|-(?!-))*[a-z0-9])*$/,
                message: intl.formatMessage({ id: intlPrefix + '.code.pattern.msg' })
              }, {
                validator: this.checkCode
              }],
              validateTrigger: 'onBlur',
              validateFirst: true
            })(_react2['default'].createElement(_input2['default'], {
              autoComplete: 'off',
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.code' }),
              style: { width: inputWidth },
              ref: function ref(e) {
                _this2.createFocusInput = e;
              },
              maxLength: 14,
              showLengthInfo: false
            }))
          ),
          operation !== 'add' && _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('name', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: intlPrefix + '.name.require.msg' })
              }, {
                /* eslint-disable-next-line */
                pattern: /^[-—\.\w\s\u4e00-\u9fa5]{1,32}$/,
                message: intl.formatMessage({ id: intlPrefix + '.name.pattern.msg' })
              }],
              initialValue: operation === 'create' ? undefined : projectDatas.name
            })(_react2['default'].createElement(_input2['default'], {
              autoComplete: 'off',
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.name' }),
              style: { width: inputWidth },
              ref: function ref(e) {
                _this2.editFocusInput = e;
              },
              maxLength: 32,
              showLengthInfo: false
            }))
          ),
          operation !== 'add' && _react2['default'].createElement(
            FormItem,
            null,
            getFieldDecorator('type', {
              initialValue: operation === 'create' ? undefined : projectDatas.type ? projectDatas.type : undefined
            })(_react2['default'].createElement(
              _select2['default'],
              {
                style: { width: '300px' },
                label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.type' }),
                getPopupContainer: function getPopupContainer() {
                  return document.getElementsByClassName('sidebar-content')[0].parentNode;
                },
                filterOption: function filterOption(input, option) {
                  return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                },
                filter: true
              },
              types && types.length ? [_react2['default'].createElement(
                Option,
                { key: 'no', value: 'no' },
                intl.formatMessage({ id: intlPrefix + '.empty' })
              )].concat(types.map(function (_ref8) {
                var name = _ref8.name,
                    code = _ref8.code;
                return _react2['default'].createElement(
                  Option,
                  { key: code, value: code },
                  name
                );
              })) : _react2['default'].createElement(
                Option,
                { key: 'empty' },
                intl.formatMessage({ id: intlPrefix + '.type.empty' })
              )
            ))
          ),
          operation !== 'add' && _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              'span',
              { style: { color: 'rgba(0,0,0,.6)' } },
              intl.formatMessage({ id: intlPrefix + '.avatar' })
            ),
            this.getAvatar()
          ),
          this.getAddGroupProjectContent(operation)
        )
      );
    }
  }, {
    key: 'getAvatar',
    value: function getAvatar() {
      var _state2 = this.state,
          isShowAvatar = _state2.isShowAvatar,
          imgUrl = _state2.imgUrl,
          projectDatas = _state2.projectDatas;

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-project-avatar' },
        _react2['default'].createElement(
          'div',
          {
            className: 'c7n-iam-project-avatar-wrap',
            style: {
              backgroundColor: projectDatas.name ? ' #c5cbe8' : '#ccc',
              backgroundImage: imgUrl ? 'url(' + Choerodon.fileServer(imgUrl) + ')' : ''
            }
          },
          !imgUrl && projectDatas && projectDatas.name && projectDatas.name.charAt(0),
          _react2['default'].createElement(
            _button2['default'],
            { className: (0, _classnames2['default'])('c7n-iam-project-avatar-button', { 'c7n-iam-project-avatar-button-create': !projectDatas.name, 'c7n-iam-project-avatar-button-edit': projectDatas.name }), onClick: this.openAvatarUploader },
            _react2['default'].createElement(
              'div',
              { className: 'c7n-iam-project-avatar-button-icon' },
              _react2['default'].createElement(_icon2['default'], { type: 'photo_camera' })
            )
          ),
          _react2['default'].createElement(_avatarUploader2['default'], { visible: isShowAvatar, intlPrefix: 'organization.project.avatar.edit', onVisibleChange: this.closeAvatarUploader, onUploadOk: this.handleUploadOk })
        )
      );
    }

    /**
     * 打开上传图片模态框
     */


    /**
     * 关闭上传图片模态框
     * @param visible 模态框是否可见
     */

  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props2 = this.props,
          ProjectStore = _props2.ProjectStore,
          AppState = _props2.AppState,
          intl = _props2.intl;

      var projectData = ProjectStore.getProjectData;
      var projectTypes = ProjectStore.getProjectTypes;
      var menuType = AppState.currentMenuType;
      var orgId = menuType.id;
      var orgname = menuType.name;
      var _state3 = this.state,
          filters = _state3.filters,
          operation = _state3.operation;

      var type = menuType.type;
      var filtersType = projectTypes && projectTypes.map(function (_ref9) {
        var name = _ref9.name;
        return {
          value: name,
          text: name
        };
      });
      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'name' }),
        dataIndex: 'name',
        key: 'name',
        filters: [],
        filteredValue: filters.name || [],
        width: '25%',
        render: function render(text, record) {
          return _react2['default'].createElement(
            'div',
            { className: 'c7n-iam-project-name-link', onClick: function onClick() {
                return _this3.goToProject(record);
              } },
            _react2['default'].createElement(
              'div',
              { className: 'c7n-iam-project-name-avatar' },
              record.imageUrl ? _react2['default'].createElement('img', { src: record.imageUrl, alt: 'avatar', style: { width: '100%' } }) : _react2['default'].createElement(
                _react2['default'].Fragment,
                null,
                text.split('')[0]
              )
            ),
            _react2['default'].createElement(
              _mouseOverWrapper2['default'],
              { text: text, width: 0.2 },
              text
            )
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'code' }),
        dataIndex: 'code',
        filters: [],
        filteredValue: filters.code || [],
        key: 'code',
        width: '20%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.2 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.type' }),
        dataIndex: 'typeName',
        key: 'typeName',
        width: '15%',
        filters: filtersType,
        filteredValue: filters.typeName || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'status' }),
        dataIndex: 'enabled',
        filters: [{
          text: intl.formatMessage({ id: 'enable' }),
          value: 'true'
        }, {
          text: intl.formatMessage({ id: 'disable' }),
          value: 'false'
        }],
        filteredValue: filters.enabled || [],
        key: 'enabled',
        render: function render(enabled) {
          return _react2['default'].createElement(_statusTag2['default'], { mode: 'icon', name: intl.formatMessage({ id: enabled ? 'enable' : 'disable' }), colorCode: enabled ? 'COMPLETED' : 'DISABLE' });
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.type.category' }),
        dataIndex: 'category',
        key: 'category',
        width: '15%',
        render: function render(category) {
          return _react2['default'].createElement(_statusTag2['default'], { mode: 'icon', name: intl.formatMessage({ id: intlPrefix + '.' + category.toLowerCase() + '.project' }), iconType: _this3.getCategoryIcon(category) });
        }
        // filters: filtersType,
        // filteredValue: filters.typeName || [],
      }, {
        title: '',
        key: 'action',
        width: '120px',
        align: 'right',
        render: function render(text, record) {
          return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              _choerodonBootCombine.Permission,
              { service: ['iam-service.organization-project.update'], type: type, organizationId: orgId },
              _react2['default'].createElement(
                _tooltip2['default'],
                {
                  title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'modify' }),
                  placement: 'bottom'
                },
                _react2['default'].createElement(_button2['default'], {
                  shape: 'circle',
                  size: 'small',
                  onClick: _this3.handleopenTab.bind(_this3, record, 'edit'),
                  icon: 'mode_edit'
                })
              )
            ),
            record.category !== 'AGILE' && _react2['default'].createElement(
              _tooltip2['default'],
              {
                title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.config' }),
                placement: 'bottom'
              },
              _react2['default'].createElement(_button2['default'], {
                shape: 'circle',
                size: 'small',
                onClick: _this3.handleopenTab.bind(_this3, record, 'add'),
                icon: 'predefine'
              })
            ),
            _react2['default'].createElement(
              _choerodonBootCombine.Permission,
              {
                service: ['iam-service.organization-project.disableProject', 'iam-service.organization-project.enableProject'],
                type: type,
                organizationId: orgId
              },
              _react2['default'].createElement(
                _tooltip2['default'],
                {
                  title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: record.enabled ? 'disable' : 'enable' }),
                  placement: 'bottom'
                },
                _react2['default'].createElement(_button2['default'], {
                  shape: 'circle',
                  size: 'small',
                  onClick: _this3.handleEnable.bind(_this3, record),
                  icon: record.enabled ? 'remove_circle_outline' : 'finished'
                })
              )
            )
          );
        }
      }];

      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['iam-service.organization-project.list', 'iam-service.organization-project.create', 'iam-service.organization-project.check', 'iam-service.organization-project.update', 'iam-service.organization-project.disableProject', 'iam-service.organization-project.enableProject']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' }) },
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            { service: ['iam-service.organization-project.create'], type: type, organizationId: orgId },
            _react2['default'].createElement(
              _button2['default'],
              {
                onClick: this.handleopenTab.bind(this, null, 'create'),
                icon: 'playlist_add'
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.create' })
            )
          ),
          _react2['default'].createElement(
            _button2['default'],
            {
              icon: 'refresh',
              onClick: function onClick() {
                ProjectStore.changeLoading(true);
                _this3.setState({
                  filters: {
                    params: []
                  },
                  pagination: {
                    current: 1,
                    pageSize: 10,
                    total: ''
                  },
                  sort: {
                    columnKey: null,
                    order: null
                  }
                }, function () {
                  _this3.loadProjects();
                });
              }
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'refresh' })
          )
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          {
            code: intlPrefix
          },
          _react2['default'].createElement(_table2['default'], {
            pagination: this.state.pagination,
            columns: columns,
            dataSource: projectData,
            rowKey: function rowKey(record) {
              return record.id;
            },
            filters: this.state.filters.params,
            onChange: this.handlePageChange.bind(this),
            loading: ProjectStore.isLoading,
            filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
          }),
          _react2['default'].createElement(
            Sidebar,
            {
              title: this.renderSideTitle(),
              visible: this.state.sidebar,
              onCancel: this.handleTabClose.bind(this),
              onOk: this.handleSubmit.bind(this),
              okText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: operation === 'create' ? 'create' : 'save' }),
              cancelText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'cancel' }),
              confirmLoading: this.state.submitting,
              className: 'c7n-iam-project-sidebar'
            },
            operation && this.renderSidebarContent(),
            operation === 'add' && this.getAddOtherBtn()
          )
        )
      );
    }
  }]);
  return Project;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = Project;