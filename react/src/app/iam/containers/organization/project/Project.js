import React, {Component} from 'react';
import {Button, Checkbox, Form, Icon, Input, Modal, Radio, Select, Table, Tooltip} from 'choerodon-ui';
import moment from 'moment';
import {inject, observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import {axios, Content, Header, Page, Permission, stores} from '@choerodon/boot';
import {FormattedMessage, injectIntl} from 'react-intl';
import classnames from 'classnames';
import {PREFIX_CLS} from '@choerodon/boot/lib/containers/common/constants';
import './Project.less';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import StatusTag from '../../../components/statusTag';
import {handleFiltersParams} from '../../../common/util';
import AvatarUploader from '../../../components/avatarUploader';

let timer;
const prefixCls = `${PREFIX_CLS}`;
const {HeaderStore} = stores;
const FormItem = Form.Item;
const ORGANIZATION_TYPE = 'organization';
const PROJECT_TYPE = 'project';
const {Sidebar} = Modal;
const {Option} = Select;
const RadioGroup = Radio.Group;
const intlPrefix = 'organization.project';
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 16},
  },
};
const isNum = /^\d+$/;

@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overflow: false,
      categoryEnabled: false,
      selectLoading: true,
      sidebar: false,
      page: 1,
      id: '',
      open: false,
      projectDatas: {
        name: null,
      },
      visible: false,
      visibleCreate: false,
      checkName: false,
      buttonClicked: false,
      filters: {
        params: [],
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: '',
      },
      sort: {
        columnKey: null,
        order: null,
      },
      submitting: false,
      isShowAvatar: false,
      imgUrl: null,
      expandedRowKeys: [],
    };
    this.editFocusInput = React.createRef();
    this.createFocusInput = React.createRef();
  }


  componentWillMount() {
    this.setState({
      isLoading: true,
    });
    this.loadEnableCategory();
    this.loadProjectCategories({});
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    clearTimeout(timer);
  }

  loadEnableCategory = () => {
    axios.get(`/iam/v1/system/setting/enable_category`)
        .then((response) => {
          this.setState({
            categoryEnabled: response,
          });
        });
  };

  componentDidMount() {
    this.loadProjects();
    this.loadProjectTypes();
    this.updateSelectContainer();
  }

  updateSelectContainer() {
    const body = this.sidebarBody;
    if (body) {
      const {overflow} = this.state;
      const bodyOverflow = body.clientHeight < body.scrollHeight;
      if (bodyOverflow !== overflow) {
        this.setState({
          overflow: bodyOverflow,
        });
      }
    }
  }

  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  };

  loadProjectTypes = () => {
    const {ProjectStore} = this.props;
    ProjectStore.loadProjectTypes().then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        ProjectStore.setProjectTypes(data);
      }
    }).catch((error) => {
      Choerodon.handleResponseError(error);
    });
  };

  loadProjects = (paginationIn, sortIn, filtersIn) => {
    const {
      pagination: paginationState,
      sort: sortState,
      filters: filtersState,
    } = this.state;
    const pagination = paginationIn || paginationState;
    const sort = sortIn || sortState;
    const filters = filtersIn || filtersState;
    const {AppState, ProjectStore} = this.props;
    const menuType = AppState.currentMenuType;
    const organizationId = menuType.id;
    ProjectStore.changeLoading(true);
    // 防止标签闪烁
    this.setState({filters});
    // 若params或filters含特殊字符表格数据置空
    const currentParams = filters.params;
    const currentFilters = {
      name: filters.name,
      code: filters.code,
      enabled: filters.enabled,
    };
    const isIncludeSpecialCode = handleFiltersParams(currentParams, currentFilters);
    if (isIncludeSpecialCode) {
      ProjectStore.changeLoading(false);
      ProjectStore.setProjectData([]);
      this.setState({
        sort,
        pagination: {
          total: 0,
        },
      });
      return;
    }

    ProjectStore.loadProject(organizationId, pagination, sort, filters)
      .then((data) => {
        ProjectStore.changeLoading(false);
        ProjectStore.setProjectData(data.list || []);
        const expandedRowKeys = this.state.expandedRowKeys.filter(v => data.list.find(l => l.id === v).projects.length);
        this.setState({
          sort,
          pagination: {
            current: data.pageNum,
            pageSize: data.pageSize,
            total: data.total,
            expandedRowKeys,
          },
        });
      })
      .catch(error =>
        Choerodon.handleResponseError(error),
      );
  };

  handleopenTab = (data, operation) => {
    const {form, ProjectStore, AppState} = this.props;
    const menuType = AppState.currentMenuType;
    const organizationId = menuType.id;
    form.resetFields();
    this.setState({
      errorMeg: '',
      successMeg: '',
      projectDatas: data || {name: null},
      operation,
      imgUrl: operation === 'edit' ? data.imageUrl : null,
      sidebar: true,
    });
    if (operation === 'edit') {
      setTimeout(() => {
        this.editFocusInput.input.focus();
      }, 10);
    } else if (operation === 'create') {
      setTimeout(() => {
        this.createFocusInput.input.focus();
      }, 10);
    } else {
      form.resetFields();
      ProjectStore.getProjectsByGroupId(data.id).then((groupData) => {
        if (groupData.failed) {
          Choerodon.prompt(groupData.message);
        } else {
          ProjectStore.setCurrentGroup(data);
          ProjectStore.setGroupProjects(groupData);
          if (groupData.length === 0) {
            ProjectStore.addNewProjectToGroup();
          }
        }
        ProjectStore.getAgileProject(organizationId, data.id).then((optionAgileData) => {
          if (optionAgileData.failed) {
            Choerodon.prompt(optionAgileData.message);
          } else {
            ProjectStore.setOptionAgileData(optionAgileData);
          }
        });
      });
    }
  };

  handleTabClose = () => {
    if (this.state.isShowAvatar) {
      this.setState({
        isShowAvatar: false,
      });
      return;
    }
    this.setState({
      sidebar: false,
      submitting: false,
    });
    this.props.ProjectStore.setGroupProjects([]);
    this.props.ProjectStore.setCurrentGroup(null);
    this.props.ProjectStore.clearProjectRelationNeedRemove();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {AppState, ProjectStore} = this.props;
    const {projectDatas, imgUrl} = this.state;
    const menuType = AppState.currentMenuType;
    const organizationId = menuType.id;
    let data;
    if (this.state.operation === 'create') {
      const {validateFields} = this.props.form;
      validateFields((err, {code, name, type, category}) => {
        let find = ProjectStore.getProjectCategories.find(item => item.code === category);
        if (find) {
          category = find.id;
        } else {
          category = undefined;
        }
        {
          data = {
            code,
            name: name.trim(),
            organizationId,
            categoryIds: [category],
            type: type === 'no' || undefined ? null : type,
            imageUrl: imgUrl || null,
          };

          this.setState({submitting: true});
          ProjectStore.createProject(organizationId, data)
              .then((value) => {
                this.setState({submitting: false});
                if (value) {
                  Choerodon.prompt(this.props.intl.formatMessage({id: 'create.success'}));
                  this.handleTabClose();
                  this.loadProjects();
                  const targetType = (ProjectStore.getProjectTypes.find(item => item.code === value.type));
                  value.typeName = targetType ? targetType.name : null;
                  value.type = 'project';
                  value.categories = [find && find.name];
                  HeaderStore.addProject(value);
                }
              }).catch((error) => {
            Choerodon.handleResponseError(error);
            this.setState({
              submitting: false,
              visibleCreate: false,
            });
          });
        }
      });
    } else if (this.state.operation === 'edit') {
      const {validateFields} = this.props.form;
      validateFields((err, {name, type}, modify) => {
        if (!err) {
          if (projectDatas.imageUrl !== imgUrl) modify = true;
          if (!modify) {
            Choerodon.prompt(this.props.intl.formatMessage({id: 'modify.success'}));
            this.handleTabClose();
            return;
          }
          data = {
            name: name.trim(),
            type: type === 'no' || undefined ? null : type,
            imageUrl: imgUrl || null,
          };
          this.setState({submitting: true, buttonClicked: true});
          ProjectStore.updateProject(organizationId,
              {
                ...data,
                objectVersionNumber: projectDatas.objectVersionNumber,
                code: projectDatas.code,
              },
              this.state.projectDatas.id).then((value) => {
            this.setState({submitting: false, buttonClicked: false});
            if (value) {
              Choerodon.prompt(this.props.intl.formatMessage({id: 'modify.success'}));
              this.handleTabClose();
              this.loadProjects();
              value.type = 'project';
              HeaderStore.updateProject(value);
            }
          }).catch((error) => {
            Choerodon.handleResponseError(error);
          });
        }
      });
    } else {
      const {validateFields} = this.props.form;
      validateFields((err, rawData) => {
        if (!err) {
          this.setState({ submitting: true, buttonClicked: true });
          ProjectStore.axiosDeleteProjectsFromGroup(this.loadProjects);
          ProjectStore.saveProjectGroup(rawData).then((savedData) => {
            if (savedData.empty) {
              this.setState({submitting: false, buttonClicked: false, sidebar: false});
              this.loadProjects();
            }
            if (savedData.failed) {
              Choerodon.prompt(this.props.intl.formatMessage({id: savedData.message}));
              this.setState({submitting: false, buttonClicked: false, sidebar: true});
            } else {
              Choerodon.prompt(this.props.intl.formatMessage({id: 'save.success'}));
              this.setState({submitting: false, buttonClicked: false, sidebar: false});
              this.loadProjects();
            }
          }).catch((error) => {
            Choerodon.prompt(this.props.intl.formatMessage({id: 'save.error'}));
            Choerodon.handleResponseError(error);
          }).finally(() => {
            this.setState({submitting: false});
          });
        }
      });
    }
  };

  /**
   * 获得所有的在前端被选择过的项目id
   * @returns {any[]}
   */
  getSelectedProject = () => {
    const fieldsValue = this.props.form.getFieldsValue();
    return Object.keys(fieldsValue).filter(v => isNum.test(v)).map(v => fieldsValue[v]);
  };

  /**
   * 根据index获得不同的可选时间
   * @param startValue
   * @param index
   * @returns {boolean}
   */
  disabledStartDate = (startValue, index) => {
    const {ProjectStore: {disabledTime, currentGroup}, form} = this.props;
    const projectId = form.getFieldValue(index);
    const endDate = form.getFieldValue(`endDate-${index}`);
    if (!startValue) return false;
    if (currentGroup.category === 'ANALYTICAL') return false;
    if (!startValue) return false;
    // 结束时间没有选的时候
    if (!endDate) {
      return disabledTime[projectId] && disabledTime[projectId].some(({start, end}) => {
        if (end === null) {
          end = '2199-12-31';
        }
        // 若有不在可选范围之内的（开始前，结束后是可选的）则返回true
        return !(startValue.isBefore(moment(start)) || startValue.isAfter(moment(end).add(1, 'hours')));
      });
    }
    if (endDate && startValue && startValue.isAfter(moment(endDate).add(1, 'hours'))) {
      return true;
    }
    let lastDate = moment('1970-12-31');
    if (disabledTime[projectId]) {
      disabledTime[projectId].forEach((data) => {
        if (data.end && moment(data.end).isAfter(lastDate) && moment(data.end).isBefore(moment(endDate))) lastDate = moment(data.end);
      });
    }
    return !(startValue.isBefore(moment(endDate).add(1, 'hours')) && startValue.isAfter(moment(lastDate).add(1, 'hours')));
  };

  /**
   * 根据index获得不同的可选时间
   * @param endValue
   * @param index
   */
  disabledEndDate = (endValue, index) => {
    const {ProjectStore: {disabledTime, currentGroup}, form} = this.props;
    const projectId = form.getFieldValue(index);
    const startDate = form.getFieldValue(`startDate-${index}`);
    if (!endValue) return false;

    // 开始时间没有选的时候
    if (!startDate) {
      return disabledTime[projectId] && disabledTime[projectId].some(({start, end}) => {
        if (end === null) {
          end = '2199-12-31';
        }
        // 若有不在可选范围之内的（开始前，结束后是可选的）则返回true
        return !(endValue.isBefore(moment(start)) || endValue.isAfter(moment(end).add(1, 'hours')));
      });
    }
    if (startDate && endValue && endValue.isBefore(startDate)) {
      return true;
    }

    if (currentGroup.category === 'ANALYTICAL') return false;
    let earlyDate = moment('2199-12-31');
    if (disabledTime[projectId]) {
      disabledTime[projectId].forEach((data) => {
        if (moment(data.start).isBefore(earlyDate) && moment(data.start).isAfter(startDate)) earlyDate = moment(data.start);
      });
    }
    return !(endValue.isAfter(moment(startDate).subtract(1, 'hours')) && endValue.isBefore(earlyDate));
  };

  /* 停用启用 */
  handleEnable = (record) => {
    const {ProjectStore, AppState, intl} = this.props;
    const userId = AppState.getUserId;
    const menuType = AppState.currentMenuType;
    const orgId = menuType.id;
    ProjectStore.enableProject(orgId, record.id, record.enabled).then((value) => {
      Choerodon.prompt(intl.formatMessage({id: record.enabled ? 'disable.success' : 'enable.success'}));
      this.loadProjects();
      HeaderStore.axiosGetOrgAndPro(sessionStorage.userId || userId).then((org) => {
        org[0].forEach((item) => {
          item.type = ORGANIZATION_TYPE;
        });
        org[1].forEach((item) => {
          item.type = PROJECT_TYPE;
        });
        HeaderStore.setProData(org[0]);
        HeaderStore.setProData(org[1]);
        this.forceUpdate();
      });
    }).catch((error) => {
      Choerodon.prompt(intl.formatMessage({id: 'operation.error'}));
    });
  };

  /* 分页处理 */
  handlePageChange(pagination, filters, sorter, params) {
    filters.params = params;
    this.loadProjects(pagination, sorter, filters);
  }

  async handleDatePickerOpen(index) {
    const {form} = this.props;
    if (form.getFieldValue(`${index}`)) {
      form.validateFields([`${index}`], {force: true});
    }
    this.forceUpdate();
  }

  /**
   * 校验项目编码唯一性
   * @param value 项目编码
   * @param callback 回调函数
   */
  checkCode = (rule, value, callback) => {
    const {AppState, ProjectStore, intl} = this.props;
    const menuType = AppState.currentMenuType;
    const organizationId = menuType.id;
    const params = {code: value};
    ProjectStore.checkProjectCode(organizationId, params)
        .then((mes) => {
          if (mes.failed) {
            callback(intl.formatMessage({id: `${intlPrefix}.code.exist.msg`}));
          } else {
            callback();
          }
        });
  };


  renderSideTitle() {
    switch (this.state.operation) {
      case 'create':
        return <FormattedMessage id={`${intlPrefix}.create`}/>;
      case 'edit':
        return <FormattedMessage id={`${intlPrefix}.modify`}/>;
      default:
        return <FormattedMessage id={`${intlPrefix}.config-sub-project`}/>;
    }
  }

  getSidebarContentInfo(operation) {
    const {AppState} = this.props;
    const menuType = AppState.currentMenuType;
    const orgname = menuType.name;
    switch (operation) {
      case 'create':
        return {
          code: `${intlPrefix}.create`,
          values: {
            name: orgname,
          },
        };
      case 'edit':
        return {
          code: `${intlPrefix}.modify`,
          values: {
            name: this.state.projectDatas.code,
          },
        };
      default:
        return {
          code: `${intlPrefix}.config-sub-project`,
          values: {
            app: this.state.projectDatas.category === 'ANALYTICAL' ? '分析型项目群' : '普通项目群',
            name: this.state.projectDatas.code,
          },
        };
    }
  }

  getOption = (current) => {
    const {ProjectStore: {optionAgileData, groupProjects}, form} = this.props;
    if (groupProjects[current].id) {
      const {projectId, projName, code} = groupProjects[current];
      const options = [];
      options.push(<Option value={projectId} key={projectId} title={projName}>
        <Tooltip title={code} placement="right" align={{offset: [20, 0]}}>
          <span style={{display: 'inline-block', width: '100%'}}>{projName}</span>
        </Tooltip>
      </Option>);
      return options;
    }
    return optionAgileData.filter(value => this.getSelectedProject().every(existProject =>
        existProject !== value.id || existProject === form.getFieldValue(current),
    )).filter(v => v.code).reduce((options, {id, name, enabled, code}) => {
      options.push(
          <Option value={id} key={id} title={name}>
            <Tooltip title={code} placement="right" align={{offset: [20, 0]}}>
              <span style={{display: 'inline-block', width: '100%'}}>{name}</span>
            </Tooltip>
          </Option>,
      );
      return options;
    }, []);
  };


  handleSelectProject = (projectId, index) => {
    const {ProjectStore: {groupProjects}, ProjectStore} = this.props;
    ProjectStore.setGroupProjectByIndex(index, {
      projectId,
      startDate: groupProjects[index].startDate,
      endDate: groupProjects[index].endDate,
      enabled: groupProjects[index].enabled
    });
  };

  handleCheckboxChange = (value, index) => {
    const {form, ProjectStore, ProjectStore: {groupProjects, currentGroup}} = this.props;
    if (currentGroup.category === 'ANALYTICAL') return;
    if (value && groupProjects[index].id) {
      const newValue = {};
      newValue[`enabled-${index}`] = value.target.checked;
      form.setFieldsValue(newValue);
      ProjectStore.setGroupProjectByIndex(index, {...groupProjects[index], enabled: value.target.checked});
      form.resetFields(`enabled-${index}`);
    }
  };

  validateDate = (projectId, index, callback) => {
    callback();
    // const { ProjectStore: { disabledTime, groupProjects }, form, ProjectStore } = this.props;
    // if (!projectId) callback();
    // if (groupProjects[projectId] && groupProjects[projectId].id) callback();
    // if (projectId) {
    //   ProjectStore.setDisabledTime(projectId).then(() => {
    //     if (disabledTime[projectId]) {
    //       const startValue = form.getFieldValue(`startDate-${index}`);
    //       const endValue = form.getFieldValue(`endDate-${index}`);
    //       if (this.disabledStartDate(startValue, index) || this.disabledEndDate(endValue, index)) {
    //         callback('日期冲突，请重新选择日期');
    //       } else {
    //         callback();
    //       }
    //     }
    //   }).catch((err) => {
    //     callback('网络错误');
    //     Choerodon.handleResponseError(err);
    //   });
    // }
  };

  getAddGroupProjectContent = (operation) => {
    const {intl, ProjectStore: {groupProjects}, form} = this.props;
    const {getFieldDecorator} = form;
    if (operation !== 'add') return;
    const formItems = groupProjects.map(({projectId, enabled, id}, index) => {
      const key = !projectId ? `project-index-${index}` : String(projectId);
      return (
          <React.Fragment>
            <FormItem
                {...formItemLayout}
                key={key}
                className="c7n-iam-project-inline-formitem"
            >
              {getFieldDecorator(`${index}`, {
                initialValue: projectId,
                rules: [{
                  required: true,
                  message: '请选择项目',
                }, {
                  validator: (rule, value, callback) => this.validateDate(value, index, callback),
                }],
              })(
                  <Select
                      className="member-role-select"
                      style={{width: 200, marginTop: -2}}
                      label={<FormattedMessage id="organization.project.name"/>}
                      disabled={!!id}
                      onChange={e => this.handleSelectProject(e, index)}
                      filterOption={(input, option) => {
                        const childNode = option.props.children;
                        if (childNode && React.isValidElement(childNode)) {
                          return childNode.props.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                        }
                        return false;
                      }}
                      filter
                  >
                    {this.getOption(index)}
                  </Select>,
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                className="c7n-iam-project-inline-formitem c7n-iam-project-inline-formitem-checkbox"
            >
              {getFieldDecorator(`enabled-${index}`, {
                initialValue: enabled,
              })(
                  <Checkbox onChange={value => this.handleCheckboxChange(value, index)}
                            checked={form.getFieldValue(`enabled-${index}`)}>是否启用</Checkbox>,
              )}
            </FormItem>
            <Button
                size="small"
                icon="delete"
                shape="circle"
                onClick={() => this.removeProjectFromGroup(index)}
                // disabled={roleIds.length === 1 && selectType === 'create'}
                className="c7n-iam-project-inline-formitem-button"
            />
          </React.Fragment>
      );
    });
    return formItems;
  };

  removeProjectFromGroup = (index) => {
    this.props.ProjectStore.removeProjectFromGroup(index);
    this.props.form.resetFields();
  };

  renderSidebarContent() {
    const {intl, ProjectStore, form} = this.props;
    const {getFieldDecorator} = form;
    const {operation, projectDatas, categoryEnabled, overflow} = this.state;
    const types = ProjectStore.getProjectTypes;
    const inputWidth = 512;
    const contentInfo = this.getSidebarContentInfo(operation);

    return (
        <Content
            {...contentInfo}
            className="sidebar-content"
        >
          <Form layout="vertical" className="rightForm" style={{width: operation === 'add' ? 512 : 800}}>
            {operation === 'create' && operation !== 'add' && (<FormItem
                {...formItemLayout}
            >
              {getFieldDecorator('code', {
                rules: [{
                  required: true,
                  whitespace: true,
                  message: intl.formatMessage({id: `${intlPrefix}.code.require.msg`}),
                }, {
                  max: 14,
                  message: intl.formatMessage({id: `${intlPrefix}.code.length.msg`}),
                }, {
                  pattern: /^[a-z](([a-z0-9]|-(?!-))*[a-z0-9])*$/,
                  message: intl.formatMessage({id: `${intlPrefix}.code.pattern.msg`}),
                }, {
                  validator: this.checkCode,
                }],
                validateTrigger: 'onBlur',
                validateFirst: true,
              })(
                  <Input
                      autoComplete="off"
                      label={<FormattedMessage id={`${intlPrefix}.code`}/>}
                      style={{width: inputWidth}}
                      ref={(e) => {
                        this.createFocusInput = e;
                      }}
                      maxLength={14}
                      showLengthInfo={false}
                  />,
              )}
            </FormItem>)}
            {operation !== 'add' && (
                <FormItem
                    {...formItemLayout}
                >
                  {getFieldDecorator('name', {
                    rules: [{
                      required: true,
                      whitespace: true,
                      message: intl.formatMessage({id: `${intlPrefix}.name.require.msg`}),
                    }, {
                      /* eslint-disable-next-line */
                      pattern: /^[-—\.\w\s\u4e00-\u9fa5]{1,32}$/,
                      message: intl.formatMessage({id: `${intlPrefix}.name.pattern.msg`}),
                    }],
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                    initialValue: operation === 'create' ? undefined : projectDatas.name,
                  })(
                      <Input
                          autoComplete="off"
                          label={<FormattedMessage id={`${intlPrefix}.name`}/>}
                          style={{width: inputWidth}}
                          ref={(e) => {
                            this.editFocusInput = e;
                          }}
                          maxLength={32}
                          showLengthInfo={false}
                      />,
                  )}
                </FormItem>
            )}
            {operation === 'create' && operation !== 'add' && categoryEnabled && (
                <FormItem
                    {...formItemLayout}
                >
                  {getFieldDecorator('category', {
                    rules: [{
                      required: true,
                      whitespace: true,
                      message: intl.formatMessage({id: `${intlPrefix}.category.require.msg`}),
                    }],
                    initialValue: 'AGILE',
                  })(
                      <Select
                          style={{width: 512}}
                          label={<FormattedMessage id={`${intlPrefix}.category`}/>}
                          notFoundContent={intl.formatMessage({id: 'organization.project.category.notfound'})}
                          onFilterChange={this.handleCategorySelectFilter}
                          getPopupContainer={() => document.getElementsByClassName('sidebar-content')[0].parentNode}
                          filterOption={false}
                          optionFilterProp="children"
                          loading={this.state.selectLoading}
                          filter
                      >
                        {this.getCategoriesOption()}
                      </Select>,
                  )}
                </FormItem>
            )}
            {operation !== 'add' && (
                <div>
                  <span style={{color: 'rgba(0,0,0,.6)'}}>{intl.formatMessage({id: `${intlPrefix}.avatar`})}</span>
                  {this.getAvatar()}
                </div>
            )}
            {this.getAddGroupProjectContent(operation)}
          </Form>
        </Content>
    );
  }

  getAvatar() {
    const {isShowAvatar, imgUrl, projectDatas} = this.state;
    return (
        <div className="c7n-iam-project-avatar">
          <div
              className="c7n-iam-project-avatar-wrap"
              style={{
                backgroundColor: projectDatas.name ? ' #c5cbe8' : '#ccc',
                backgroundImage: imgUrl ? `url(${Choerodon.fileServer(imgUrl)})` : '',
              }}
          >
            {!imgUrl && projectDatas && projectDatas.name && projectDatas.name.charAt(0)}
            <Button className={classnames('c7n-iam-project-avatar-button', {
              'c7n-iam-project-avatar-button-create': !projectDatas.name,
              'c7n-iam-project-avatar-button-edit': projectDatas.name
            })} onClick={this.openAvatarUploader}>
              <div className="c7n-iam-project-avatar-button-icon">
                <Icon type="photo_camera"/>
              </div>
            </Button>
            <AvatarUploader visible={isShowAvatar} intlPrefix="organization.project.avatar.edit"
                            onVisibleChange={this.closeAvatarUploader} onUploadOk={this.handleUploadOk}/>
          </div>
        </div>
    );
  }

  /**
   * 打开上传图片模态框
   */
  openAvatarUploader = () => {
    this.setState({
      isShowAvatar: true,
    });
  }

  /**
   * 关闭上传图片模态框
   * @param visible 模态框是否可见
   */
  closeAvatarUploader = (visible) => {
    this.setState({
      isShowAvatar: visible,
    });
  }

  handleUploadOk = (res) => {
    this.setState({
      imgUrl: res,
      isShowAvatar: false,
    });
  }

  handleExpand = (expanded, record) => {
    const { expandedRowKeys } = this.state;
    if (expanded) {
      expandedRowKeys.push(record.id);
    } else {
      expandedRowKeys.splice(expandedRowKeys.findIndex(v => v === record.id), 1);
    }
    this.setState({
      expandedRowKeys,
    });
  }

  goToProject = (record) => {
    if (this.canGotoProject(record)) {
      window.location = `#/?type=project&id=${record.id}&name=${record.name}&organizationId=${record.organizationId}`;
    }
  };

  handleCategorySelectFilter = (value) => {
    this.setState({
      selectLoading: true,
    });

    const queryObj = {
      param: value,
    };

    if (timer) {
      clearTimeout(timer);
    }

    if (value) {
      timer = setTimeout(() => this.loadProjectCategories(queryObj), 300);
    } else {
      return this.loadProjectCategories(queryObj);
    }
  }


  // 加载全部项目类别
  loadProjectCategories = (queryObj) => {
    const { ProjectStore } = this.props;
    ProjectStore.loadProjectCategories(queryObj).then((data) => {
      ProjectStore.setProjectCategories((data.list || []).slice());
      this.setState({
        selectLoading: false,
      });
    });
  }
  /**
   * 获取项目类型下拉选项
   * @returns {any[]}
   */

  getCategoriesOption = () => {
    const { ProjectStore } = this.props;
    const projectCategories = ProjectStore.getProjectCategories;
    return projectCategories && projectCategories.length > 0 ? (
        projectCategories.map(({code, name}) => (
            <Option key={code} value={`${code}`}>{name}</Option>
        ))
    ) : null;
  }

  canGotoProject = record => HeaderStore.proData.some(v => v.id === record.id);

  getGotoTips = (record) => {
    if (this.canGotoProject(record)) {
      return (<FormattedMessage id={`${intlPrefix}.redirect`} values={{name: record.name}}/>);
    } else if (!record.enabled) {
      return (<FormattedMessage id={`${intlPrefix}.redirect.disable`}/>);
    } else {
      return (<FormattedMessage id={`${intlPrefix}.redirect.no-permission`}/>);
    }
  };

  getAddOtherBtn = () => (
      <Button type="primary" className="add-other-project" icon="add" onClick={this.addProjectList}>
        <FormattedMessage id="organization.project.add.project"/>
      </Button>
  );

  addProjectList = () => {
    const {ProjectStore, AppState, intl} = this.props;
    ProjectStore.addNewProjectToGroup();
  };


  getCategoryIcon = (category) => {
    switch (category) {
      case 'AGILE':
        return 'project_line';
      case 'PROGRAM':
        return 'project_group';
      case 'ANALYTICAL':
        return 'project_group_analyze';
      default:
        return 'project_line';
    }
  };

  renderExpandRowRender(source) {
    const {intl} = this.props;
    if (!source.category === 'PROGRAM') {
      return null;
    }
    const columns = [{
      title: <FormattedMessage id="name"/>,
      dataIndex: 'name',
      key: 'name',
      // width: '25%',
      width: '320px',
      render: (text, record) => (
          <div className="c7n-iam-project-name-link" onClick={() => this.goToProject(record)} style={{paddingLeft: 26}}>
            <MouseOverWrapper text={text} width={0.2}>
              <StatusTag mode="icon" name={text} colorCode={record.enabled ? 'COMPLETED' : 'DISABLE'}/>
              {/* {text} */}
            </MouseOverWrapper>
          </div>
      ),
    }, {
      title: <FormattedMessage id="code"/>,
      dataIndex: 'code',
    }];
    return (
        <Table
            pagination={false}
            filterBar={false}
            showHeader={false}
            bordered={false}
            columns={columns}
            dataSource={source.projects || []}
            rowKey={record => record.id}
        />
    );
  }

  render() {
    const {ProjectStore, AppState, intl} = this.props;
    const projectData = ProjectStore.getProjectData;
    const projectTypes = ProjectStore.getProjectTypes;
    const categories = ProjectStore.getProjectCategories;
    const menuType = AppState.currentMenuType;
    const orgId = menuType.id;
    const orgname = menuType.name;
    const {filters, operation, categoryEnabled} = this.state;
    const {type} = menuType;
    const filtersType = projectTypes && projectTypes.map(({name}) => ({
      value: name,
      text: name,
    }));
    const preColumn = [{
      title: <FormattedMessage id="name"/>,
      dataIndex: 'name',
      key: 'name',
      filters: [],
      filteredValue: filters.name || [],
      // width: categoryEnabled ? '20%' : '30%',
      width: '320px',
      render: (text, record) => (
          <div className="c7n-iam-project-name-link" onClick={() => this.goToProject(record)}>
            <MouseOverWrapper text={text} width={0.2}>
              <Icon type={record.category === 'PROGRAM' ? 'project_group' : 'project_line'}
                    style={{marginRight: 8}}/>{text}
            </MouseOverWrapper>
          </div>
      ),
    }, {
      title: <FormattedMessage id="code"/>,
      dataIndex: 'code',
      filters: [],
      filteredValue: filters.code || [],
      key: 'code',
      // width: categoryEnabled ? '20%' : '30%',
      render: text => (
          <MouseOverWrapper text={text} width={0.2}>
            {text}
          </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id="status"/>,
      width: '160px',
      dataIndex: 'enabled',
      filters: [{
        text: intl.formatMessage({id: 'enable'}),
        value: 'true',
      }, {
        text: intl.formatMessage({id: 'disable'}),
        value: 'false',
      }],
      filteredValue: filters.enabled || [],
      key: 'enabled',
      render: (enabled, record) => (
          <span style={{
            marginRight: 8,
            fontSize: '12px',
            lineHeight: '18px',
            padding: '2px 6px',
            background: record.enabled ? 'rgba(0, 191, 165, 0.1)' : 'rgba(244, 67, 54, 0.1)',
            color: record.enabled ? '#009688' : '#D50000',
            borderRadius: '2px',
            border: '1px solid',
            borderColor: record.enabled ? '#009688' : '#D50000'
          }}>
          {record.enabled ? '启用' : '停用'}
        </span>
      ),
    }];
    const nextColumn = [{
      title: '',
      key: 'action',
      width: '120px',
      align: 'right',
      render: (text, record) => (
          <div>
            {record.category === 'PROGRAM' && record.enabled && (
                <Tooltip
                    title={<FormattedMessage id={`${intlPrefix}.config`}/>}
                    placement="bottom"
                >
                  <Button
                      shape="circle"
                      size="small"
                      onClick={this.handleopenTab.bind(this, record, 'add')}
                      icon="predefine"
                  />
                </Tooltip>
            )}
            <Permission service={['iam-service.organization-project.update']} type={type} organizationId={orgId}>
            <Tooltip
                title={<FormattedMessage id="modify"/>}
                placement="bottom"
            >
              <Button
                  shape="circle"
                  size="small"
                  onClick={this.handleopenTab.bind(this, record, 'edit')}
                  icon="mode_edit"
              />
            </Tooltip>
            </Permission>
            <Permission
                service={['iam-service.organization-project.disableProject', 'iam-service.organization-project.enableProject']}
                type={type}
                organizationId={orgId}
            >
              <Tooltip
                  title={<FormattedMessage id={record.enabled ? 'disable' : 'enable'}/>}
                  placement="bottom"
              >
                <Button
                    shape="circle"
                    size="small"
                    onClick={this.handleEnable.bind(this, record)}
                    icon={record.enabled ? 'remove_circle_outline' : 'finished'}
                />
              </Tooltip>
            </Permission>
          </div>
      ),
    }];
    const middleColumn = categoryEnabled ? [{
      title: <FormattedMessage id={`${intlPrefix}.type.category`}/>,
      dataIndex: 'category',
      key: 'category',
      width: '15%',
      render: category => {
        let find = categories && categories.find(item => item.code === category);
        return (
          <span>{find ? find.name : ''}</span>)
      },
      // filters: filtersType,
      filteredValue: filters.typeName || [],
    }] : [];
    const columns = [
        ...preColumn,
        ...middleColumn,
        ...nextColumn,
    ];


    return (
        <Page
            className={`${prefixCls}-iam-project`}
            service={[
              'iam-service.organization-project.list',
              'iam-service.organization-project.create',
              'iam-service.organization-project.check',
              'iam-service.organization-project.update',
              'iam-service.organization-project.disableProject',
              'iam-service.organization-project.enableProject',
            ]}
        >
          <Header title={<FormattedMessage id={`${intlPrefix}.header.title`}/>}>
            <Permission service={['iam-service.organization-project.create']} type={type} organizationId={orgId}>
              <Button
                  onClick={this.handleopenTab.bind(this, null, 'create')}
                  icon="playlist_add"
              >
                <FormattedMessage id={`${intlPrefix}.create`}/>
              </Button>
            </Permission>
            <Button
                icon="refresh"
                onClick={() => {
                  ProjectStore.changeLoading(true);
                  this.setState({
                    filters: {
                      params: [],
                    },
                    pagination: {
                      current: 1,
                      pageSize: 10,
                      total: '',
                    },
                    sort: {
                      columnKey: null,
                      order: null,
                    },
                  }, () => {
                    this.loadProjects();
                  });
                }}
            >
              <FormattedMessage id="refresh"/>
            </Button>
          </Header>
          <Content
              code={intlPrefix}
          >
            <Table
                pagination={this.state.pagination}
                columns={columns}
                dataSource={projectData}
                rowKey={record => record.id}
                filters={this.state.filters.params}
                onChange={this.handlePageChange.bind(this)}
                loading={ProjectStore.isLoading}
                expandedRowRender={record => this.renderExpandRowRender(record)}
                filterBarPlaceholder={intl.formatMessage({id: 'filtertable'})}
                rowClassName={(record, index) => `${record.category === 'PROGRAM' && record.projects && record.projects.length ? '' : 'hidden-expand'}`}
            />
            <Sidebar
                title={this.renderSideTitle()}
                visible={this.state.sidebar}
                onCancel={this.handleTabClose.bind(this)}
                onOk={this.handleSubmit.bind(this)}
                okText={<FormattedMessage id={operation === 'create' ? 'create' : 'save'}/>}
                cancelText={<FormattedMessage id="cancel"/>}
                confirmLoading={this.state.submitting}
                className="c7n-iam-project-sidebar"
            >
              {operation && this.renderSidebarContent()}
              {operation === 'add' && this.getAddOtherBtn()}
            </Sidebar>
          </Content>
        </Page>
    );
  }
}
