import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col, Tooltip, Modal, Popover } from 'choerodon-ui';
import { axios } from 'choerodon-boot-combine';
import { injectIntl } from 'react-intl';

@injectIntl
@inject('AppState')
@observer
export default class InstanceExpandRow extends Component {
  state = {
    detail: null,
  };

  componentDidMount() {
    const { record: { id }, apiGateWay } = this.props;
    axios.get(`${apiGateWay}instances/${id}/details`).then((data) => {
      this.setState({
        detail: data,
      });
    });
  }

  getCircle() {
    const { completedCount: completed, failedCount: failed, runningCount: running, waitToBePulledCount: waitToBePulled } = this.state.detail;
    const { intl, expand } = this.props;
    const sum = completed + failed + running + waitToBePulled;
    const { status } = this.props.record;
    const completedCorrect = sum > 0 ? ((completed + running + waitToBePulled) / sum) * (Math.PI * 2 * 30) : 0;
    const runningCorrect = sum > 0 ? ((running + waitToBePulled) / sum) * (Math.PI * 2 * 30) : 0;
    const waitToBePulledCorrect = sum > 0 ? ((waitToBePulled) / sum) * (Math.PI * 2 * 30) : 0;
    return (<svg width="80" height="80" onClick={expand}>
      <Popover placement="left" content={<div><div className="c7n-saga-spot c7n-saga-spot-error" />{`失败任务：${failed}`}</div>}>
        <circle
          cx="40"
          cy="40"
          r="30"
          strokeWidth={5}
          stroke={failed > 0 ? '#f44336' : '#f3f3f3'}
          className="c7n-saga-circle-error"
        />
      </Popover>
      <Popover placement="left" content={<div><div className="c7n-saga-spot c7n-saga-spot-completed" />{`完成任务：${completed}`}</div>}>
        <circle
          cx="40"
          cy="40"
          r="30"
          stroke={completed > 0 ? '#00bfa5' : '#f3f3f3'}
          className="c7n-saga-circle"
          strokeDasharray={`${completedCorrect}, 10000`}
        />
      </Popover>
      <Popover placement="left" content={<div><div className="c7n-saga-spot c7n-saga-spot-running" />{`进行中任务：${running}`}</div>}>
        <circle
          cx="40"
          cy="40"
          r="30"
          stroke={running > 0 ? '#4d90fe' : '#f3f3f3'}
          className="c7n-saga-circle-running"
          strokeDasharray={`${runningCorrect}, 10000`}
        />
      </Popover>
      <Popover placement="left" content={<div><div className="c7n-saga-spot c7n-saga-spot-queue" />{`等待被拉取：${waitToBePulled}`}</div>}>
        <circle
          cx="40"
          cy="40"
          r="30"
          stroke={waitToBePulled > 0 ? '#ffb100' : '#f3f3f3'}
          className="c7n-saga-circle-queue"
          strokeDasharray={`${waitToBePulledCorrect}, 10000`}
        />
      </Popover>
      <text x="50%" y="39.5" className="c7n-saga-circle-num">{`${completed}/${sum}`}</text>
      <text x="50%" y="54" fontSize="12" className="c7n-saga-circle-text">{intl.formatMessage({ id: status.toLowerCase() })}</text>
    </svg>);
  }

  render() {
    const { detail } = this.state;
    const { intl } = this.props;
    if (!detail) {
      return null;
    }
    const { id, sagaCode, description, service, level, startTime, endTime, refType, refId, completed, failed, running } = detail;

    return (
      <React.Fragment>
        <Row style={{ marginTop: 25 }}>
          <Col span={14}>
            <Row className="c7n-saga-expand-row">
              <Col span={7}>ID:</Col>
              <Col span={14}>{id}</Col>
            </Row>
            <Row className="c7n-saga-expand-row">
              <Col span={7}>所属事务定义:</Col>
              <Col span={14}>{sagaCode}</Col>
            </Row>
            <Row className="c7n-saga-expand-row">
              <Col span={7}>描述:</Col>
              <Col span={14}>{description}</Col>
            </Row>
            <Row className="c7n-saga-expand-row">
              <Col span={7}>所属微服务:</Col>
              <Col span={14}>{service}</Col>
            </Row>
            <Row className="c7n-saga-expand-row">
              <Col span={7}>触发层级:</Col>
              <Col span={14}>{level}</Col>
            </Row>
          </Col>
          <Col span={10}>
            <div className="c7n-saga-expand-circle">
              {this.getCircle()}
            </div>
          </Col>
        </Row>
        <Row className="c7n-saga-expand-row">
          <Col span={4}>开始时间:</Col>
          <Col span={5}><div style={{ width: 3, height: 1, display: 'inline-block' }} />{startTime}</Col>
          <Col span={3}>结束时间:</Col>
          <Col span={5}>{endTime}</Col>
        </Row>

        <Row className="c7n-saga-expand-row-divider" span={14}>关联业务</Row>
        <Row style={{ marginBottom: 24 }}>
          <Col span={14}>
            <Row className="c7n-saga-expand-row">
              <Col span={7}>关联业务类型:</Col>
              <Col span={14}>{refType}</Col>
            </Row>
            <Row className="c7n-saga-expand-row">
              <Col span={7}>关联业务ID:</Col>
              <Col span={14}>{refId}</Col>
            </Row>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
