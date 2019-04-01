import React, { Component } from 'react';
import { Tree, Input, Icon, Tooltip } from 'choerodon-ui';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { axios } from 'choerodon-front-boot';
import _ from 'lodash';
import querystring from 'query-string';
import classnames from 'classnames';
import './ApiTree.scss';
import APITestStore from '../../../../stores/global/api-test';

const TreeNode = Tree.TreeNode;

@injectIntl
@inject('AppState')
@observer
export default class ApiTree extends Component {
  state = {
    searchValue: '',
    treeData: [],
    dataList: [],
    pagination: {
      current: 1,
      pageSize: 200,
      total: 0,
    },
    expandedKeys: [],
    autoExpandParent: false,
    eventKey: null, // 当前点击节点的key
    selectedKeys: [],
  }


  componentDidMount() {
    this.loadInitData();
  }

  loadInitData = () => {
    // APITestStore.setLoading(true);
    APITestStore.loadApis().then((res) => {
      if (res.failed) {
        Choerodon.prompt(res.message);
        // APITestStore.setLoading(false);
      } else if (res.service.length) {
        APITestStore.setService(res.service);
        APITestStore.setPageLoading(false);
        this.generateList(res.service);
        this.setState({
          treeData: res.service,
        });
      }
    });
  };

  generateList = (data) => {
    for (let i = 0; i < data.length; i += 1) {
      const node = data[i];
      const key = node.key;
      const title = node.title;
      this.state.dataList.push({ key, title });
      if (node.children) {
        this.generateList(node.children, node.key);
      }
    }
  };

  // 展开或关闭树节点
  onExpand = (newExpandedKeys) => {
    this.setState({
      expandedKeys: newExpandedKeys,
      autoExpandParent: false,
    });
    // APITestStore.setExpandedKeys(expandedKeys);
    // const { expandedKeys } = this.state;
    // let newKey;
    // if (expanded) {
    //   // newKey = expandedKeys.filter(el => el !== newExpandedKeys[0]);
    //   this.setState({
    //     expandedKeys: newExpandedKeys,
    //     autoExpandParent: false,
    //   });
    // } else {
    //   window.console.log('test');
    // }
    // this.setState({ expandedKeys, autoExpandParent: false });
  }


  onSelect = (selectedKey, info) => {
    if (info.selectedNodes[0].props.children && !info.selectedNodes[0].props.children.length) {
      return;
    }

    if (!info.selectedNodes[0].props.children) {
      const { getDetail } = this.props;
      APITestStore.setCurrentNode(info.selectedNodes);
      getDetail(info.selectedNodes);
    } else {
      const { expandedKeys } = this.state;
      const index = expandedKeys.indexOf(selectedKey[0]);
      let newExpandedKey;
      if (index === -1) {
        newExpandedKey = expandedKeys;
        newExpandedKey.push(selectedKey[0]);
      } else {
        newExpandedKey = expandedKeys.filter(el => el !== selectedKey[0]);
      }
      this.setState({
        expandedKeys: newExpandedKey,
      }, () => {
        APITestStore.setDetailFlag('empty');
        APITestStore.setCurrentNode(null);
      });
    }
  }
  // const { getDetail } = this.props;
  // const eventKey = APITestStore.getEventKey;
  // if (eventKey !== node.props.eventKey) {
  //   APITestStore.setEventKey(node.props.eventKey);
  //   if (selectedNodes[0].props.method) {
  //     APITestStore.setCurrentNode(selectedNodes);
  //     getDetail(selectedNodes);
  //   } else {
  //     APITestStore.setDetailFlag('empty');
  //     APITestStore.setCurrentNode(null);
  //   }
  // }
  // }

  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i += 1) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  filterApi = _.debounce((value) => {
    const expandedKeys = this.state.dataList.map((item) => {
      if (item.title.indexOf(value) > -1) {
        return this.getParentKey(item.key, this.state.treeData);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    // APITestStore.setExpandedKeys(expandedKeys);
    this.setState({
      expandedKeys: value.length ? expandedKeys : [],
      searchValue: value,
      autoExpandParent: true,
    });
  }, 1000);

  renderTreeNodes = (data) => {
    const expandedKeys = this.state.expandedKeys;
    const { searchValue } = this.state;
    let icon = <Icon
      style={{ color: '#3F51B5' }}
      type="folder_open"
    />;

    return data.map((item) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const titleLength = item.title.length;
      const splitNum = 24;
      let apiWrapper;
      if (titleLength < splitNum) {
        apiWrapper = 'c7n-iam-apitest-api-wrapper-1';
      } else if (titleLength >= splitNum && titleLength < splitNum * 2) {
        apiWrapper = 'c7n-iam-apitest-api-wrapper-2';
      } else if (titleLength >= splitNum * 2 && titleLength < splitNum * 3) {
        apiWrapper = 'c7n-iam-apitest-api-wrapper-3';
      } else if (titleLength >= splitNum * 3 && titleLength < splitNum * 4) {
        apiWrapper = 'c7n-iam-apitest-api-wrapper-4';
      } else {
        apiWrapper = 'c7n-iam-apitest-api-wrapper-5';
      }

      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.title}</span>;
      if (item.method) {
        icon = <div className={classnames(`c7n-iam-apitest-tree-${item.key}`, 'c7n-iam-apitest-tree-methodTag', `c7n-iam-apitest-tree-methodTag-${item.method}`)}><div>{item.method}</div></div>;
      }

      if (item.children) {
        const icon2 = (
          <Icon
            style={{ color: '#3F51B5' }}
            type={expandedKeys.includes(item.key) ? 'folder_open2' : 'folder_open'}
            className={`c7n-iam-apitest-tree-${item.key}`}
          />
        );
        return (
          <TreeNode title={<Tooltip title={title} getPopupContainer={() => document.getElementsByClassName(`c7n-iam-apitest-tree-${item.key}`)[0]}><div className="ant-tree-title-ellipsis">{title}</div></Tooltip>} key={item.key} dataRef={item} icon={icon2}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} title={<Tooltip title={item.description || title} getPopupContainer={() => document.getElementsByClassName(`c7n-iam-apitest-tree-${item.key}`)[0].parentNode.parentNode}><div>{title}</div></Tooltip>} dataRef={item} icon={icon} className={classnames({ [apiWrapper]: item.method })} />;
    });
  }

  render() {
    const { onClose, intl, getDetail } = this.props;
    const { autoExpandParent } = this.state;
    return (
      <div className="c7n-iam-apitest-tree-content">
        <div className="c7n-iam-apitest-tree-top">
          <Input
            prefix={<Icon type="filter_list" style={{ color: 'black' }} />}
            placeholder={intl.formatMessage({ id: 'global.apitest.filter' })}
            onChange={e => this.filterApi.call(null, e.target.value)}
          />
          <div
            role="none"
            className="c7n-iam-apitest-tree-top-button"
            onClick={onClose}
          >
            <Icon type="navigate_before" />
          </div>
        </div>
        <div className="c7n-iam-apitest-tree-main">
          <Tree
            expandedKeys={this.state.expandedKeys}
            selectedKeys={this.state.selectedKeys}
            showIcon
            onSelect={this.onSelect}
            onExpand={this.onExpand}
            autoExpandParent={autoExpandParent}
          >
            {this.renderTreeNodes(this.state.treeData)}
          </Tree>
        </div>
      </div>
    );
  }
}
