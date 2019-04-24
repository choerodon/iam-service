/**
 * Created by hulingfangzi on 2018/6/26.
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Content, Header, Page } from 'choerodon-boot-combine';
import { Col, Row, Table, Tabs, Spin } from 'choerodon-ui';
import { FormattedMessage, injectIntl } from 'react-intl';
import AceEditor from '../../../components/yamlAce';
import InstanceStore from '../../../stores/global/instance';
import './Instance.scss';

const { TabPane } = Tabs;
const intlPrefix = 'global.instance';

@withRouter
@injectIntl
export default class InstanceDetail extends Component {
  state = this.getInitState();

  instanceId = null;

  getInitState() {
    return {
      info: null,
      metadata: null,
      loading: true,
    };
  }

  constructor(props) {
    super(props);
    this.instanceId = props.match.params.id;
  }

  componentWillMount() {
    this.setState({
      loading: true,
    });
    InstanceStore.loadInstanceInfo(this.instanceId).then((data) => {
      if (data.failed) {
        this.setState({
          loading: false,
        });
        Choerodon.prompt(data.message);
      } else {
        let metadata = Object.assign({}, data.metadata);
        metadata = Object.entries(metadata).map(item => ({
          name: item[0],
          value: item[1],
        }));
        this.setState({
          info: data,
          metadata,
          loading: false,
        });
      }
    });
  }

  getInstanceInfo = () => {
    const { info, metadata } = this.state;
    const { intl: { formatMessage } } = this.props;
    const columns = [{
      title: <FormattedMessage id={`${intlPrefix}.name`} />,
      dataIndex: 'name',
      key: 'name',
    }, {
      title: <FormattedMessage id={`${intlPrefix}.value`} />,
      dataIndex: 'value',
      key: 'value',
    }];
    const infoList = [{
      key: formatMessage({ id: `${intlPrefix}.instanceid` }),
      value: info.instanceId,
    }, {
      key: formatMessage({ id: `${intlPrefix}.hostname` }),
      value: info.hostName,
    }, {
      key: formatMessage({ id: `${intlPrefix}.ip` }),
      value: info.ipAddr,
    }, {
      key: formatMessage({ id: `${intlPrefix}.service` }),
      value: info.app,
    }, {
      key: formatMessage({ id: `${intlPrefix}.port` }),
      value: info.port,
    }, {
      key: formatMessage({ id: `${intlPrefix}.version` }),
      value: info.version,
    }, {
      key: formatMessage({ id: `${intlPrefix}.registertime` }),
      value: info.registrationTime,
    }, {
      key: formatMessage({ id: `${intlPrefix}.metadata` }),
      value: '',
    }];
    return (
      <div className="instanceInfoContainer">
        <div className="instanceInfo">
          {
            infoList.map(({ key, value }) =>
              <Row key={key}>
                <Col span={5}>{key}:</Col>
                <Col span={19}>{value}</Col>
              </Row>,
            )
          }
        </div>
        <Table
          columns={columns}
          dataSource={metadata}
          rowKey="name"
          pagination={false}
          filterBarPlaceholder={formatMessage({ id: 'filtertable' })}
        />
      </div>
    );
  };

  getConfigInfo = () => {
    const { info } = this.state;
    return (
      <div className="configContainer">
        <div>
          <p><FormattedMessage id={`${intlPrefix}.configinfo`} /></p>
          <AceEditor
            readOnly="nocursor"
            value={info.configInfoYml.yaml || ''}
          />
        </div>
        <div>
          <p><FormattedMessage id={`${intlPrefix}.envinfo`} /></p>
          <AceEditor
            readOnly="nocursor"
            value={info.envInfoYml.yaml || ''}
          />
        </div>
      </div>
    );
  };

  render() {
    const { loading } = this.state;
    return (
      <Page>
        <Header
          title={<FormattedMessage id={`${intlPrefix}.detail`} />}
          backPath="/iam/instance"
        />
        {
          loading ? <Spin size="large" style={{ paddingTop: 242 }} /> :
          <Content
            code={`${intlPrefix}.detail`}
            values={{ name: this.instanceId }}
          >
            <Tabs>
              <TabPane
                tab={<FormattedMessage id={`${intlPrefix}.instanceinfo`} />}
                key="instanceinfo"
              >{this.getInstanceInfo()}</TabPane>
              <TabPane
                tab={<FormattedMessage id={`${intlPrefix}.configenvInfo`} />}
                key="configenvInfo"
              >{this.getConfigInfo()}</TabPane>
            </Tabs>
          </Content>
        }
      </Page>
    );
  }
}
