import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { inject, observer } from 'mobx-react';
import ReactEcharts from 'echarts-for-react';
import { WSHandler } from '@choerodon/boot';
import { Button, Icon, Select, Spin } from 'choerodon-ui';
import './index.scss';

const intlPrefix = 'dashboard.onlineusers';

@withRouter
@injectIntl
@inject('AppState')
@observer
export default class OnlineUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      info: {
        time: [],
        data: [],
      },
    };
  }


  getOption() {
    const { info } = this.state;
    const { intl: { formatMessage } } = this.props;
    return {
      tooltip: {
        trigger: 'axis',
        confine: true,
        formatter: `{b}:00<br/>${formatMessage({ id: 'dashboard.onlineusers.count' })}: {c}${formatMessage({ id: 'dashboard.onlineusers.persons' })}`,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        extraCssText: 'box-shadow: 0 2px 4px 0 rgba(0,0,0,0.20)',
        textStyle: {
          fontSize: 13,
          color: '#000000',
        },
      },
      legend: {
        show: false,
      },

      grid: {
        left: '-10',
        bottom: '0px',
        height: '80%',
        width: '100%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          show: false,
          boundaryGap: false,
          data: info ? info.time : [],
        },
      ],
      yAxis: [
        {
          type: 'value',
          show: false,
          minInterval: 1,
        },
      ],
      series: [
        {
          name: formatMessage({ id: 'dashboard.onlineusers.count' }),
          type: 'line',
          areaStyle: {
            color: 'rgba(82,102,212,0.80)',
          },
          smooth: true,
          symbolSize: 0,
          data: info ? info.data : [],
          lineStyle: {
            width: 0,
          },
        },
      ],
    };
  }

  handleMessage = (data) => {
    this.setState({
      info: {
        time: data.time,
        data: data.data,
      },
    });
  }

  getContent = (data) => {
    let content;
    if (data) {
      content = (
        <React.Fragment>
          <div className="c7n-iam-dashboard-onlineuser-main">
            <div className="c7n-iam-dashboard-onlineuser-main-current">
              <span>{data ? data.CurrentOnliners : 0}</span><span>人</span>
            </div>
            <ReactEcharts
              style={{ height: '60%', width: '100%' }}
              option={this.getOption()}
            />
          </div>
          <div className="c7n-iam-dashboard-onlineuser-bottom">
            日总访问量: {data ? data.numberOfVisitorsToday : 0}
          </div>
        </React.Fragment>
      );
    } else {
      content = <Spin spinning />;
    }
    return content;
  }

  render() {
    const { loading } = this.state;
    return (
      <WSHandler
        messageKey="choerodon:msg:online-info"
        onMessage={this.handleMessage}
      >
        {
          data => (
            <div className="c7n-iam-dashboard-onlineuser" ref={(e) => { this.chartRef = e; }}>
              {this.getContent(data)}
            </div>
          )
        }
      </WSHandler>
    );
  }
}
