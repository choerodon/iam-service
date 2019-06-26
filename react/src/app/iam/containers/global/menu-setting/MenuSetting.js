import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Prompt } from 'react-router-dom';
import { Button, Form, Icon, IconSelect, Input, Modal, Table, Tabs, Tooltip } from 'choerodon-ui';
import { axios, Content, Header, Page, Permission, stores } from '@choerodon/boot';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';
import { RESOURCES_LEVEL } from '@choerodon/boot/lib/containers/common/constants';
import { adjustSort, canDelete, defineLevel, deleteNode, findParent, hasDirChild, isChild, normalizeMenus } from './util';
import './MenuSetting.scss';
import '../../../common/ConfirmModal.scss';
import MouseOverWrapper from '../../../components/mouseOverWrapper';

const { MenuStore } = stores;
const intlPrefix = 'global.menusetting';
const STRING_DEVIDER = '__@.@__';

let currentDropOverItem;
let currentDropSide;
let dropItem;
let edited;
let saved;

function dropSideClassName(side) {
  return `drop-row-${side}`;
}

function addDragClass(currentTarget, dropSide) {
  if (dropSide) {
    currentDropOverItem = currentTarget;
    currentDropSide = dropSide;
    currentDropOverItem.classList.add(dropSideClassName(currentDropSide));
  }
}

function removeDragClass() {
  if (currentDropOverItem && currentDropSide) {
    currentDropOverItem.classList.remove(dropSideClassName(currentDropSide));
  }
}

const { Sidebar } = Modal;
const FormItem = Form.Item;
const { TabPane } = Tabs;
const inputWidth = 512;
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

function findFirstLevel() {
  return ['site', 'organization', 'project', 'user']
    .find(l => RESOURCES_LEVEL.indexOf(l) !== -1);
}

function hasLevel(level) {
  return RESOURCES_LEVEL.indexOf(level) !== -1;
}

@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class MenuSetting extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      submitting: false,
      menuGroup: {},
      prevMenuGroup: {},
      type: findFirstLevel(),
      selectType: 'create',
      sidebar: false,
      selectMenuDetail: {},
      dragData: null,
      tempDirs: [],
    };
    this.changeMenuFocusInput = React.createRef();
    this.addDirFocusInput = React.createRef();
  }

  componentWillMount() {
    this.initMenu();
    edited = null;
    saved = null;
  }

  componentWillUpdate(nextProps, nextState) {
    if (saved) {
      edited = false;
    } else if (JSON.stringify(nextState.prevMenuGroup) !== JSON.stringify(nextState.menuGroup)) {
      edited = true;
    } else {
      edited = false;
    }
  }

  // 初始化类型
  initMenu(type) {
    const { menuGroup, type: typeState, prevMenuGroup } = this.state;
    type = type || typeState;
    const newPrevMenuGroup = prevMenuGroup;
    this.setState({ loading: true });
    axios.get(`/iam/v1/menus/menu_config?code=choerodon.code.top.${type}`)
      .then((res) => {
        const value = res.subMenus;
        menuGroup[type] = normalizeMenus(value);
        newPrevMenuGroup[type] = JSON.parse(JSON.stringify(menuGroup))[type];
        // 深拷贝
        this.setState({
          menuGroup,
          loading: false,
          prevMenuGroup: newPrevMenuGroup,
        });
      })
      .catch((error) => {
        Choerodon.handleResponseError(error);
        this.setState({ loading: false });
      });
  }

  // 选择菜单类型
  selectMenuType = (type) => {
    const { type: currentType, prevMenuGroup, menuGroup } = this.state;
    const { intl } = this.props;
    if (JSON.stringify(prevMenuGroup[currentType]) !== JSON.stringify(menuGroup[currentType])) {
      Modal.confirm({
        className: 'c7n-iam-confirm-modal',
        title: intl.formatMessage({ id: `${intlPrefix}.prompt.inform.title` }),
        content: intl.formatMessage({ id: `${intlPrefix}.prompt.inform.message` }),
        onOk: () => {
          if (!this.state.menuGroup[type]) {
            this.initMenu(type);
          }
          this.setState({
            type,
          });
        },
      });
    } else {
      if (!this.state.menuGroup[type]) {
        this.initMenu(type);
      }
      this.setState({
        type,
      });
    }
  };

  // 关闭sidebar
  closeSidebar = () => {
    this.setState({
      sidebar: false,
    });
  };

  // 创建目录，弹出sidebar
  addDir = () => {
    const { form: { resetFields } } = this.props;
    resetFields();
    this.setState({
      selectType: 'create',
      sidebar: true,
      selectMenuDetail: {},
    });
    setTimeout(() => {
      this.addDirFocusInput.input.focus();
    }, 10);
  };

  // 查看细节，弹出sidebar,设置选中的菜单或目录
  detailMenu = (record) => {
    const { form: { resetFields } } = this.props;
    resetFields();
    this.setState({
      selectType: 'detail',
      sidebar: true,
      selectMenuDetail: record,
    });
  };

  // 修改菜单,弹出sidebar,设置选中的菜单或目录
  changeMenu = (record) => {
    const { form: { resetFields } } = this.props;
    resetFields();
    this.setState({
      selectType: 'edit',
      sidebar: true,
      selectMenuDetail: record,
    });
    setTimeout(() => {
      this.changeMenuFocusInput.input.focus();
    }, 10);
  };

  checkCode = (rule, value, callback) => {
    const { intl } = this.props;
    const { type, tempDirs } = this.state;
    const errorMsg = intl.formatMessage({ id: `${intlPrefix}.directory.code.onlymsg` });
    if (tempDirs.find(({ code }) => code === value)) {
      callback(errorMsg);
    } else {
      axios.post('/iam/v1/menus/check', JSON.stringify({ code: value, level: type, type: 'menu' }))
        .then((mes) => {
          if (mes.failed) {
            callback(errorMsg);
          } else {
            callback();
          }
        })
        .catch((error) => {
          Choerodon.handleResponseError(error);
          callback(false);
        });
    }
  };

  // 删除菜单
  deleteMenu = (record) => {
    const { intl } = this.props;
    const { menuGroup, type, tempDirs } = this.state;
    const index = tempDirs.findIndex(({ code }) => code === record.code);
    if (index !== -1) {
      tempDirs.splice(index, 1);
    }
    deleteNode(menuGroup[type], record);
    this.setState({
      menuGroup,
      tempDirs,
    });
    Choerodon.prompt(intl.formatMessage({ id: `${intlPrefix}.delete.success` }));
  };

  handleDelete = (record) => {
    const { intl } = this.props;
    Modal.confirm({
      className: 'c7n-iam-confirm-modal',
      title: intl.formatMessage({ id: `${intlPrefix}.delete.owntitle` }),
      content: intl.formatMessage({
        id: record.subMenus && record.subMenus.length
          ? `${intlPrefix}.delete.owncontent.hassub`
          : `${intlPrefix}.delete.owncontent`,
      }, {
        name: record.name,
      }),
      onOk: () => {
        this.deleteMenu(record);
      },
    });
  };

  handleRefresh = () => {
    const { type, menuGroup } = this.state;
    this.setState({
      menuGroup: {
        [type]: menuGroup[type],
      },
    }, () => {
      this.initMenu();
    });
  };

  // 创建添加的状态请求
  handleOk = (e) => {
    e.preventDefault();
    const { intl } = this.props;
    this.props.form.validateFields((err, { code, name, icon }) => {
      if (!err) {
        const { selectType, menuGroup, selectMenuDetail, type, tempDirs } = this.state;
        let menu = {};
        switch (selectType) {
          case 'create':
            menu = {
              code,
              icon,
              name: name.trim(),
              default: false,
              level: type,
              type: 'menu',
              // parentId: 0,
              parentCode: `choerodon.code.top.${type}`,
              subMenus: null,
            };
            defineLevel(menu, 0);
            menuGroup[type].push(menu);
            tempDirs.push(menu);
            Choerodon.prompt(intl.formatMessage({ id: `${intlPrefix}.create.success` }));
            break;
          case 'edit':
            selectMenuDetail.name = name.trim();
            selectMenuDetail.icon = icon;
            Choerodon.prompt(intl.formatMessage({ id: `${intlPrefix}.modify.success` }));
            break;
          default:
            break;
        }
        this.setState({
          sidebar: false,
          menuGroup,
          tempDirs,
        });
      }
    });
  };

  // 创建目录的3个状态
  getSidebarTitle = (selectType) => {
    switch (selectType) {
      case 'create':
        return <FormattedMessage id={`${intlPrefix}.create.org`} />;
      case 'edit':
        return <FormattedMessage id={`${intlPrefix}.modify.org`} />;
      case 'detail':
        return <FormattedMessage id={`${intlPrefix}.detail`} />;
      default:
    }
  };

  // 创建3个状态的sidebar渲染
  getSidebarContent(selectType) {
    const { selectMenuDetail: { name } } = this.state;
    const { AppState } = this.props;
    let formDom;
    let code;
    let values;
    switch (selectType) {
      case 'create':
        code = `${intlPrefix}.create`;
        values = { name: AppState.getSiteInfo.systemName || 'Choerodon' };
        formDom = this.getDirNameDom();
        break;
      case 'edit':
        code = `${intlPrefix}.modify`;
        values = { name };
        formDom = this.getDirNameDom();
        break;
      case 'detail':
        code = `${intlPrefix}.detail`;
        values = { name };
        formDom = this.getDetailDom();
        break;
      default:
        break;
    }
    return (
      <div>
        <Content
          className="sidebar-content"
          code={code}
          values={values}
        >
          {formDom}
        </Content>
      </div>
    );
  }

  // 查看详情
  getDetailDom() {
    /* eslint-disable-next-line */
    const { name, code, resourceLevel: level, permissions, __parent_name__ } = this.state.selectMenuDetail;
    return (
      <div>
        <Form layout="vertical">
          <FormItem
            {...formItemLayout}
          >
            <Input
              value={name}
              autoComplete="off"
              label={<FormattedMessage id={`${intlPrefix}.menu.name`} />}
              disabled
              style={{ width: inputWidth }}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            <Input
              value={code}
              autoComplete="off"
              label={<FormattedMessage id={`${intlPrefix}.menu.code`} />}
              disabled
              style={{ width: inputWidth }}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            <Input
              value={level}
              label={<FormattedMessage id={`${intlPrefix}.menu.level`} />}
              autoComplete="off"
              disabled
              style={{ width: inputWidth }}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            <Input
              /* eslint-disable-next-line */
              value={__parent_name__}
              label={<FormattedMessage id={`${intlPrefix}.belong.root`} />}
              disabled
              autoComplete="off"
              style={{ width: inputWidth }}
            />
          </FormItem>
        </Form>
        <div className="permission-list" style={{ width: inputWidth }}>
          <p><FormattedMessage id={`${intlPrefix}.menu.permission`} /></p>
          {
            permissions && permissions.length > 0 ? permissions.map(
              ({ code: permissionCode }) => <div key={permissionCode}><span>{permissionCode}</span></div>,
            ) : <FormattedMessage id={`${intlPrefix}.menu.withoutpermission`} />
          }
        </div>
      </div>
    );
  }

  // created FormDom渲染
  getDirNameDom() {
    const { intl } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { selectType, selectMenuDetail = {} } = this.state;
    const codeRules = selectType === 'create' && [{
      required: true,
      whitespace: true,
      message: intl.formatMessage({ id: `${intlPrefix}.directory.code.require` }),
    }, {
      pattern: /^[a-z]([-.a-z0-9]*[a-z0-9])?$/,
      message: intl.formatMessage({ id: `${intlPrefix}.directory.code.pattern` }),
    }, {
      validator: this.checkCode,
    }];
    return (
      <Form layout="vertical">
        <FormItem
          {...formItemLayout}
        >
          {getFieldDecorator('code', {
            rules: codeRules || [],
            validateTrigger: 'onBlur',
            validateFirst: true,
            initialValue: selectMenuDetail.code,
          })(
            <Input
              autoComplete="off"
              label={<FormattedMessage id={`${intlPrefix}.directory.code`} />}
              style={{ width: inputWidth }}
              disabled={selectType === 'edit'}
              ref={(e) => { this.addDirFocusInput = e; }}
              maxLength={64}
              showLengthInfo={false}
            />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true,
              whitespace: true,
              message: intl.formatMessage({ id: `${intlPrefix}.directory.name.require` }),
            }],
            validateTrigger: 'onBlur',
            initialValue: selectMenuDetail.name,
          })(
            <Input
              autoComplete="off"
              label={<FormattedMessage id={`${intlPrefix}.directory.name`} />}
              style={{ width: inputWidth }}
              ref={(e) => { this.changeMenuFocusInput = e; }}
              maxLength={32}
              showLengthInfo={false}
            />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
        >
          {getFieldDecorator('icon', {
            rules: [{
              required: true,
              message: intl.formatMessage({ id: `${intlPrefix}.icon.require` }),
            }],
            validateTrigger: 'onChange',
            initialValue: selectMenuDetail.icon,
          })(
            <IconSelect
              label={<FormattedMessage id={`${intlPrefix}.icon`} />}
              style={{ width: inputWidth }}
              showArrow
              showAll
            />,
          )}
        </FormItem>
      </Form>
    );
  }

  getRowKey = record => `${record.parentId} - ${record.code}`;

  // 判断是否能拖拽
  checkDraggable(record) {
    const { dragData } = this.state;
    return !dragData || (dragData !== record && !isChild(dragData, record));
  }

  // 判断是否能拖放
  checkDroppable(record) {
    const { dragData } = this.state;
    return dragData && dragData !== record 
      && (this.checkDropIn(record) || this.checkDropBesides(record)) && !isChild(dragData, record);
  }

  // 判断是否能拖入
  checkDropIn(record) {
    const { dragData } = this.state;
    return dragData && record.type !== 'menu_item' && dragData.type !== 'root' && !hasDirChild(dragData) 
      // eslint-disable-next-line no-underscore-dangle
      && record.__level__ < (dragData.type === 'menu' ? 1 : 2);
  }

  // 判断是否能插在前后
  checkDropBesides(record) {
    const { dragData } = this.state;
    return dragData && (
      /* eslint-disable-next-line */
      record.__level__ === 0 ? dragData.type !== 'menu_item' :
        (dragData.type !== 'root' && !hasDirChild(dragData))
    );
  }

  // 拖拽离开目标
  handleDragLeave() {
    removeDragClass();
    dropItem = null;
  }

  // 拖拽开始
  handleDragtStart(dragData, e) {
    e.dataTransfer.setData('text', 'choerodon');
    document.body.ondrop = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    this.setState({
      dragData,
    });
  }

  // 拖拽结束
  handleDragEnd = () => {
    removeDragClass();
    if (dropItem) {
      this.handleDrop(dropItem);
    }
    this.setState({
      dragData: null,
    });
  };

  // 拖拽目标位置
  handleDragOver(record, e) {
    e.preventDefault();
    const canAddIn = this.checkDropIn(record);
    const canAddBesides = this.checkDropBesides(record);
    if (canAddIn || canAddBesides) {
      dropItem = record;
      const { currentTarget, pageY, dataTransfer } = e;
      const { top, height } = currentTarget.getBoundingClientRect();
      let before = height / 2;
      let after = before;
      let dropSide;
      if (canAddIn) {
        before = height / 3;
        after = before * 2;
        dropSide = 'in';
        dataTransfer.dropEffect = 'copy';
      }
      if (canAddBesides) {
        const y = pageY - top;
        if (y < before) {
          dropSide = 'before';
          dataTransfer.dropEffect = 'move';
        } else if (y >= after) {
          dropSide = 'after';
          dataTransfer.dropEffect = 'move';
        }
      }
      removeDragClass();
      addDragClass(currentTarget, dropSide);
    }
  }

  // 拖放
  handleDrop(record) {
    removeDragClass();
    const { dragData, menuGroup, type } = this.state;
    const menuData = menuGroup[type];
    if (dragData && record) {
      deleteNode(menuData, dragData);
      if (currentDropSide === 'in') {
        dragData.parentCode = record.code;
        record.subMenus = record.subMenus || [];
        record.subMenus.unshift(dragData);
        /* eslint-disable-next-line */
        normalizeMenus([dragData], record.__level__, record.name);
      } else {
        const { parent, index, parentData: { code = `choerodon.code.top.${type}`, __level__, name } = {} } = findParent(menuData, record);
        dragData.parentCode = code;
        parent.splice(index + (currentDropSide === 'after' ? 1 : 0), 0, dragData);
        normalizeMenus([dragData], __level__, name);
      }
      this.setState({
        menuGroup,
        dragData: null,
      });
    }
  }

  handleRow = (record) => {
    const droppable = this.checkDroppable(record);
    const rowProps = droppable ? {
      draggable: true,
      onDragLeave: this.handleDragLeave,
      onDragOver: this.handleDragOver.bind(this, record),
      onDrop: this.handleDrop.bind(this, record),
    } : {};
    return rowProps;
  };

  handleCell = (record) => {
    const draggable = this.checkDraggable(record);
    const cellProps = {
      onDragEnd: this.handleDragEnd,
    };
    if (draggable) {
      Object.assign(cellProps, {
        draggable: true,
        onDragStart: this.handleDragtStart.bind(this, record),
        className: 'drag-cell',
      });
    }
    return cellProps;
  };

  // 储存菜单
  saveMenu = () => {
    const { intl } = this.props;
    const { type, menuGroup, prevMenuGroup } = this.state;
    const newPrevMenuGroup = prevMenuGroup;
    if (JSON.stringify(prevMenuGroup) !== JSON.stringify(menuGroup)) {
      this.setState({ submitting: true });
      axios.post(`/iam/v1/menus/menu_config?code=choerodon.code.top.${type}`, JSON.stringify(adjustSort(menuGroup[type])))
        .then((menus) => {
          this.setState({ submitting: false });
          if (menus.failed) {
            Choerodon.prompt(menus.message);
          } else {
            MenuStore.setMenuData(_.cloneDeep(menus), type);
            Choerodon.prompt(intl.formatMessage({
              id: 'save.success',
            }));
            saved = true;
            menuGroup[type] = normalizeMenus(menus);
            newPrevMenuGroup[type] = JSON.parse(JSON.stringify(menuGroup))[type];
            this.setState({
              menuGroup,
              prevMenuGroup: newPrevMenuGroup,
              tempDirs: [],
            });
          }
        })
        .catch((error) => {
          Choerodon.handleResponseError(error);
          this.setState({ submitting: false });
        });
    }
  };

  getOkText = (selectType) => {
    switch (selectType) {
      case 'create':
        return <FormattedMessage id="add" />;
      case 'detail':
        return <FormattedMessage id="close" />;
      default:
        return <FormattedMessage id="save" />;
    }
  };

  render() {
    const { intl, AppState } = this.props;
    const menuType = this.props.AppState.currentMenuType.type;
    const { menuGroup, type: typeState, selectType, sidebar, submitting, loading } = this.state;
    // Prompt 只能传单个字符串，所以用 STRING_DEVIDER 对 title 和 msg 进行了分离
    const promptMsg = intl.formatMessage({ id: `${intlPrefix}.prompt.inform.title` }) + STRING_DEVIDER + intl.formatMessage({ id: `${intlPrefix}.prompt.inform.message` });
    const columns = [{
      title: <FormattedMessage id={`${intlPrefix}.directory`} />,
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      render: (text, { type, default: dft }) => {
        let icon = '';
        if (type === 'menu') {
          icon = 'dehaze';
        } else if (!dft) {
          icon = 'folder';
        } else {
          icon = 'custom_Directory';
        }
        return (
          <MouseOverWrapper text={text} width={0.2} className="c7n-iam-menusetting-name">
            <Icon type={icon} style={{ verticalAlign: 'text-bottom' }} /> {text}
          </MouseOverWrapper>
        );
      },
      onCell: this.handleCell,
    }, {
      title: <FormattedMessage id={`${intlPrefix}.icon`} />,
      dataIndex: 'icon',
      key: 'icon',
      width: '10%',
      render: text => (
        <MouseOverWrapper text={text} width={0.8}>
          <Icon type={text} style={{ fontSize: 18 }} />
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.code`} />,
      dataIndex: 'code',
      key: 'code',
      width: '35%',
      render: text => (
        <MouseOverWrapper text={text} width={0.3}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.type`} />,
      dataIndex: 'default',
      key: 'default',
      width: '15%',
      render: (text, { type, default: dft }) => {
        if (type === 'menu_item') {
          return (
            <MouseOverWrapper text={text} width={0.10}>
              <span style={{ cursor: 'default' }}>菜单</span>
            </MouseOverWrapper>
          );
        } else if (!dft) {
          return (
            <MouseOverWrapper text={text} width={0.10}>
              <span style={{ cursor: 'default' }}>自设目录</span>
            </MouseOverWrapper>
          );
        } else {
          return (
            <MouseOverWrapper text={text} width={0.10}>
              <span style={{ cursor: 'default' }}>预置目录</span>
            </MouseOverWrapper>
          );
        }
      },
    }, {
      title: '',
      width: '15%',
      key: 'action',
      align: 'right',
      render: (text, record) => {
        const { type, default: dft } = record;
        if (type === 'menu_item') {
          return (
            <Permission service={['iam-service.menu.query']} type={menuType}>
              <Tooltip
                title={<FormattedMessage id="detail" />}
                placement="bottom"
              >
                <Button
                  shape="circle"
                  icon="find_in_page"
                  size="small"
                  onClick={this.detailMenu.bind(this, record)}
                />
              </Tooltip>
            </Permission>
          );
        } else if (!dft) {
          const canDel = canDelete(record);
          return (
            <span>
              <Permission service={['iam-service.menu.update']} type={menuType}>
                <Tooltip
                  title={<FormattedMessage id="modify" />}
                  placement="bottom"
                >
                  <Button
                    shape="circle"
                    size="small"
                    onClick={this.changeMenu.bind(this, record)}
                    icon="mode_edit"
                  />
                </Tooltip>
              </Permission>
              <Permission service={['iam-service.menu.delete']} type={menuType}>
                {canDel ? (
                  <Tooltip
                    title={<FormattedMessage id="delete" />}
                    placement="bottom"
                  >
                    <Button
                      onClick={this.handleDelete.bind(this, record)}
                      shape="circle"
                      size="small"
                      icon="delete_forever"
                    />
                  </Tooltip>
                ) : (
                  <Tooltip
                    title={<FormattedMessage id={`${intlPrefix}.delete.disable.tooltip`} />}
                    overlayStyle={{ width: '200px' }}
                    placement="bottomRight"
                  >
                    <Button
                      disabled
                      shape="circle"
                      size="small"
                      icon="delete_forever"
                    />
                  </Tooltip>
                )}
              </Permission>
            </span>
          );
        }
      },
    }];
    return (
      <Page
        service={[
          'iam-service.menu.create',
          'iam-service.menu.saveListTree',
          'iam-service.menu.query',
          'iam-service.menu.update',
          'iam-service.menu.delete',
          'iam-service.menu.queryMenusWithPermissions',
          'iam-service.menu.listTree',
          'iam-service.menu.listAfterTestPermission',
          'iam-service.menu.listTreeMenusWithPermissions',
        ]}
      >
        <Header title={<FormattedMessage id={`${intlPrefix}.header.title`} />}>
          <Prompt message={promptMsg} wrapper="c7n-iam-confirm-modal" when={edited} />
          <Permission service={['iam-service.menu.create']}>
            <Button
              onClick={this.addDir}
              icon="playlist_add"
            >
              <FormattedMessage id={`${intlPrefix}.create.org`} />
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
          values={{ name: AppState.getSiteInfo.systemName || 'Choerodon' }}
        >
          <Tabs defaultActiveKey="site" onChange={this.selectMenuType} activeKey={typeState}>
            {hasLevel('site') ? <TabPane tab={<FormattedMessage id={`${intlPrefix}.global`} />} key="site" /> : null}
            {hasLevel('organization') ? <TabPane tab={<FormattedMessage id={`${intlPrefix}.org`} />} key="organization" /> : null}
            {hasLevel('project') ? <TabPane tab={<FormattedMessage id={`${intlPrefix}.pro`} />} key="project" /> : null}
            {hasLevel('user') ? <TabPane tab={<FormattedMessage id={`${intlPrefix}.personcenter`} />} key="user" /> : null}
            {/* <TabPane tab={<FormattedMessage id={`${intlPrefix}.global`} />} key="site" />
            <TabPane tab={<FormattedMessage id={`${intlPrefix}.org`} />} key="organization" />
            <TabPane tab={<FormattedMessage id={`${intlPrefix}.pro`} />} key="project" />
            <TabPane tab={<FormattedMessage id={`${intlPrefix}.personcenter`} />} key="user" /> */}
          </Tabs>
          <Table
            loading={loading}
            className="menu-table"
            filterBar={false}
            pagination={false}
            columns={columns}
            defaultExpandAllRows={false}
            dataSource={menuGroup[typeState]}
            childrenColumnName="subMenus"
            rowKey={this.getRowKey}
            onRow={this.handleRow}
          />
          <Sidebar
            title={this.getSidebarTitle(selectType)}
            onOk={selectType === 'detail' ? this.closeSidebar : this.handleOk}
            okText={this.getOkText(selectType)}
            cancelText={<FormattedMessage id="cancel" />}
            okCancel={selectType !== 'detail'}
            onCancel={this.closeSidebar}
            visible={sidebar}
          >
            {this.getSidebarContent(selectType)}
          </Sidebar>
          <Permission service={['iam-service.menu.saveListTree']}>
            <div style={{ marginTop: 25 }}>
              <Button
                funcType="raised"
                type="primary"
                onClick={this.saveMenu}
                loading={submitting}
              >
                <FormattedMessage id="save" />
              </Button>
              <Button
                funcType="raised"
                onClick={this.handleRefresh}
                style={{ marginLeft: 16, color: '#3F51B5' }}
                disabled={submitting}
              >
                <FormattedMessage id="cancel" />
              </Button>
            </div>
          </Permission>
        </Content>
      </Page>
    );
  }
}
