/**
 * Created by hulingfangzi on 2018/6/11.
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { axios, Content, Header, Page, Permission } from 'choerodon-boot-combine';
import { Button, Col, Form, Input, Modal, Row, Select, Steps } from 'choerodon-ui';
import querystring from 'query-string';
import { FormattedMessage, injectIntl } from 'react-intl';
import AceEditor from '../../../components/yamlAce';
import ConfigurationStore from '../../../stores/global/configuration';
import './Configuration.scss';

const { Step } = Steps;
const FormItem = Form.Item;
const { Option } = Select;
const intlPrefix = 'global.configuration';

@inject('AppState')
@observer

class EditConfig extends Component {
  state = this.getInitState();

  oldAce = null;

  newAce = null;

  scrollTarget = null;

  getInitState() {
    return {
      current: 1,
      templateDisable: true,
      currentServiceConfig: null, // 配置模板下拉内容
      initVersion: undefined,
      yamlData: null,
      oldYamlData: '',
      id: this.props.match.params.id,
      service: this.props.match.params.name,
    };
  }

  componentWillMount() {
    ConfigurationStore.setRelatedService({}); // 保存时的微服务信息
    if (!ConfigurationStore.service.length) this.loadInitData();
    ConfigurationStore.getEditConfigData(this.state.id).then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        ConfigurationStore.setEditConfig(data);
      }
    });
    this.loadCurrentServiceConfig(this.state.service);
  }

  loadInitData = () => {
    ConfigurationStore.loadService().then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        ConfigurationStore.setService(data || []);
      }
    });
  };

  /**
   * 根据所选微服务 获取配置模板
   * @param serviceName 微服务名称
   */
  loadCurrentServiceConfig(serviceName) {
    const queryObj = {
      page: 1,
      size: 20,
    };
    axios.get(`/manager/v1/services/${serviceName}/configs?${querystring.stringify(queryObj)}`).then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        this.setState({
          yamlData: null,
          currentServiceConfig: data.list,
        });
      }
    });
  }

  /* 渲染配置模板下拉框 */
  getSelect() {
    const { templateDisable, currentServiceConfig } = this.state;
    return (
      <Select
        disabled
        style={{ width: '512px' }}
        label={<FormattedMessage id={`${intlPrefix}.template`} />}
        getPopupContainer={() => document.getElementsByClassName('page-content')[0]}
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        filter
      >
        {
          currentServiceConfig && currentServiceConfig.map(({ name, id }) => (
            <Option value={id} key={name}>{name}</Option>
          ))
        }
      </Select>
    );
  }

  /* 第一步 下一步 */
  goSecStep = () => {
    if (!this.state.yamlData) {
      this.getConfigYaml();
    } else {
      this.setState({
        current: 2,
      });
    }
  };

  /* 获取配置yaml */
  getConfigYaml() {
    const { id } = this.state;
    axios.get(`manager/v1/configs/${id}/yaml`).then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        this.setState({
          yamlData: data.yaml,
          oldYamlData: data.yaml,
          totalLine: data.totalLine,
          current: 2,
        });
      }
    });
  }

  /* 获取步骤条状态 */
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
   * 上一步
   * @param index
   */
  changeStep = (index) => {
    if (index === 1) {
      this.setState({ yamlData: this.state.oldYamlData });
    }
    this.setState({ current: index });
  };

  /**
   * 获取编辑器内容
   * @param value 编辑器内容
   */
  handleChangeValue = (e) => {
    this.setState({ yamlData: e });
  };

  /* 修改配置 */
  editConfig = () => {
    const { intl } = this.props;
    const data = JSON.parse(JSON.stringify(ConfigurationStore.getEditConfig));
    data.txt = this.state.yamlData;
    const configId = this.state.id;
    ConfigurationStore.modifyConfig(configId, 'yaml', data).then((res) => {
      if (res.failed) {
        Choerodon.prompt(res.message);
      } else {
        const currentService = ConfigurationStore.service.find(service => service.name === this.state.service);
        ConfigurationStore.setRelatedService(currentService);
        ConfigurationStore.setStatus('');
        Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
        this.props.history.push('/iam/configuration');
      }
    });
  };

  /* 取消 */
  cancelAll = () => {
    const currentService = ConfigurationStore.service.find(service => service.name === this.state.service);
    ConfigurationStore.setRelatedService(currentService);
    ConfigurationStore.setStatus('');
    this.props.history.push('/iam/configuration');
  };


  /* 渲染第一步 */
  handleRenderService = () => {
    const { intl } = this.props;
    const { templateDisable, service, template, version } = this.state;
    const { getFieldDecorator } = this.props.form;
    const inputWidth = 512;
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
    return (
      <div>
        <p>
          <FormattedMessage id={`${intlPrefix}.step1.description`} />
        </p>
        <Form>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('service', {
              rules: [{
                required: true,
              }],
              initialValue: service,
            })(
              <Select
                disabled
                style={{ width: inputWidth }}
                getPopupContainer={() => document.getElementsByClassName('page-content')[0]}
                label={<FormattedMessage id={`${intlPrefix}.service`} />}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                filter
              >
                {
                  ConfigurationStore.service.map(({ name }) => (
                    <Option value={name} key={name}>{name}</Option>
                  ))
                }
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('template', {
              rules: [{
                required: true,
                message: intl.formatMessage({ id: `${intlPrefix}.template.require.msg` }),
              }],
              initialValue: ConfigurationStore.getEditConfig && ConfigurationStore.getEditConfig.name,
            })(
              this.getSelect(),
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('version', {
              rules: [{
                required: true,
              }],
              initialValue: ConfigurationStore.getEditConfig && ConfigurationStore.getEditConfig.configVersion,
            })(
              <Input
                disabled
                label={<FormattedMessage id={`${intlPrefix}.configversion`} />}
                autoComplete="off"
                style={{ width: inputWidth }}
              />,
            )}
          </FormItem>
        </Form>
        <section className="serviceSection">
          <Permission service={['manager-service.config.queryYaml']}>
            <Button
              type="primary"
              funcType="raised"
              onClick={this.goSecStep}
            >
              <FormattedMessage id={`${intlPrefix}.step.next`} />
            </Button>
          </Permission>
        </section>
      </div>
    );
  };

  /* 渲染第二步 */
  handleRenderInfo = () => {
    const { yamlData, totalLine } = this.state;
    return (
      <div key="step">
        <p>
          <FormattedMessage id={`${intlPrefix}.step2.description`} />
        </p>
        <span className="yamlInfoTitle"> <FormattedMessage id={`${intlPrefix}.info`} /></span>
        <Row key="ace-row">
          <Col key="ace-column" span={24}>
            <AceEditor
              key="ace"
              onChange={this.handleChangeValue}
              value={yamlData}
              style={{ height: totalLine ? `${totalLine * 16}px` : '500px', width: '100%' }}
            />
          </Col>
        </Row>
        <section className="serviceSection">
          <Button
            type="primary"
            funcType="raised"
            onClick={this.changeStep.bind(this, 3)}
          >
            <FormattedMessage id={`${intlPrefix}.step.next`} />
          </Button>
          <Button funcType="raised" onClick={this.changeStep.bind(this, 1)}>
            <FormattedMessage id={`${intlPrefix}.step.prev`} />
          </Button>
        </section>
      </div>
    );
  };

  syncOldAceScroll = (cm) => {
    if (this.scrollTarget === 'old') {
      this.scrollTarget = null;
    } else if (this.oldAce) {
      this.scrollTarget = 'new';
      this.oldAce.scrollTo(cm);
    }
  };

  syncNewAceScroll = (cm) => {
    if (this.scrollTarget === 'new') {
      this.scrollTarget = null;
    } else if (this.newAce) {
      this.scrollTarget = 'old';
      this.newAce.scrollTo(cm);
    }
  };

  saveOldAce = (node) => {
    this.oldAce = node;
  };

  saveNewAce = (node) => {
    this.newAce = node;
  };

  /* 渲染第三步 */
  handleRenderConfirm = () => {
    const { yamlData, totalLine, service, oldYamlData } = this.state;
    return (
      <div key="step" className="confirmContainer">
        <div>
          <Row>
            <Col span={3}><FormattedMessage id={`${intlPrefix}.configid`} />：</Col>
            <Col
              span={21}
            >
              {ConfigurationStore.getEditConfig.name}
            </Col>
          </Row>
          <Row>
            <Col span={3}><FormattedMessage id={`${intlPrefix}.configversion`} />：</Col><Col span={21}>{ConfigurationStore.getEditConfig.configVersion}</Col>
          </Row>
          <Row>
            <Col span={3}><FormattedMessage id={`${intlPrefix}.service`} />：</Col><Col span={13}>{service}</Col>
          </Row>
        </div>
        <span className="finalyamTitle"><FormattedMessage id={`${intlPrefix}.info`} />：</span>
        <Row key="ace-row">
          <Col key="ace-column" span={12}>
            <div>
              <FormattedMessage id={`${intlPrefix}.newYaml`} />
            </div>
            <AceEditor
              key="ace"
              ref={this.saveNewAce}
              readOnly="nocursor"
              value={yamlData}
              style={{ height: totalLine ? `${(totalLine + 2) * 16}px` : '500px', width: '100%' }}
              onScroll={this.syncOldAceScroll}
            />
          </Col>
          <Col span={12}>
            <div>
              <FormattedMessage id={`${intlPrefix}.oldYaml`} />
            </div>
            <AceEditor
              ref={this.saveOldAce}
              readOnly="nocursor"
              value={oldYamlData}
              style={{ height: totalLine ? `${(totalLine + 2) * 16}px` : '500px', width: '100%' }}
              onScroll={this.syncNewAceScroll}
            />
          </Col>
        </Row>
        <section className="serviceSection">
          <Button
            type="primary"
            funcType="raised"
            onClick={this.editConfig}
          >
            <FormattedMessage id="save" />
          </Button>
          <Button funcType="raised" onClick={this.changeStep.bind(this, 2)}>
            <FormattedMessage id={`${intlPrefix}.step.prev`} />
          </Button>
          <Button funcType="raised" onClick={this.cancelAll}>
            <FormattedMessage id="cancel" />
          </Button>
        </section>
      </div>
    );
  };

  render() {
    const { current } = this.state;
    const values = {
      name: ConfigurationStore.getEditConfig && ConfigurationStore.getEditConfig.name,
    };
    return (
      <Page
        service={[
          'manager-service.config.queryYaml',
        ]}
      >
        <Header
          title={<FormattedMessage id={`${intlPrefix}.modify`} />}
          backPath="/iam/configuration"
        />
        <Content
          code={`${intlPrefix}.modify`}
          values={values}
        >
          <div className="createConfigContainer">
            <Steps current={current}>
              <Step
                title={(
                  <span style={{ color: current === 1 ? '#3F51B5' : '', fontSize: 14 }}>
                    <FormattedMessage id={`${intlPrefix}.step1.title`} />
                  </span>
                )}
                status={this.getStatus(1)}
              />
              <Step
                title={(
                  <span style={{ color: current === 2 ? '#3F51B5' : '', fontSize: 14 }}>
                    <FormattedMessage
                      id={`${intlPrefix}.step2.title`}
                    />
                  </span>
                )}
                status={this.getStatus(2)}
              />
              <Step
                title={(
                  <span style={{
                    color: current === 3 ? '#3F51B5' : '',
                    fontSize: 14,
                  }}
                  >
                    <FormattedMessage id={`${intlPrefix}.step3.modify.title`} />
                  </span>
                )}
                status={this.getStatus(3)}
              />
            </Steps>
            <div className="createConfigContent">
              {current === 1 && this.handleRenderService()}
              {current === 2 && this.handleRenderInfo()}
              {current === 3 && this.handleRenderConfirm()}
            </div>
          </div>
        </Content>
      </Page>
    );
  }
}

export default Form.create({})(withRouter(injectIntl(EditConfig)));
