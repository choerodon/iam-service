import React, { Component } from 'react';
import { DashBoardNavBar, DashBoardToolBar } from '@choerodon/boot';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { inject, observer } from 'mobx-react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import { Button, Icon, Select, Spin } from 'choerodon-ui';
import FailedSagaStore from '../../stores/dashboard/failedSaga';
import TimePicker from '../../components/timePicker';
import './index.scss';

const intlPrefix = 'dashboard.failedsaga';

@withRouter
@injectIntl
@inject('AppState')
@observer
export default class FailedSaga extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateType: 'seven',
    };
  }

  componentWillMount() {
    this.loadChart();
  }

  componentWillUnmount() {
    FailedSagaStore.setStartTime(moment().subtract(6, 'days'));
    FailedSagaStore.setEndTime(moment());
  }

  loadChart = () => {
    FailedSagaStore.setLoading(true);
    const startDate = FailedSagaStore.getStartTime.format().split('T')[0];
    const endDate = FailedSagaStore.getEndTime.format().split('T')[0];
    FailedSagaStore.loadData(startDate, endDate);
  }

  handleDateChoose = (type) => {
    this.setState({ dateType: type });
  };

  getOption() {
    const chartData = FailedSagaStore.getChartData;
    const { intl } = this.props;
    return {
      color: ['#F44336'],
      tooltip: {
        trigger: 'axis',
        confine: true,
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#DDDDDD',
        extraCssText: 'box-shadow: 0 2px 4px 0 rgba(0,0,0,0.20)',
        textStyle: {
          fontSize: 13,
          color: '#000000',
        },
      },
      grid: {
        top: '10px',
        left: '3%',
        right: '4%',
        bottom: '5px',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: chartData ? chartData.date : [],
          axisLine: {
            lineStyle: {
              color: '#eee',
              type: 'solid',
              width: 2,
            },
            onZero: true,
          },
          axisLabel: {
            margin: 11, // X轴文字和坐标线之间的间距
            textStyle: {
              color: 'rgba(0, 0, 0, 0.65)',
              fontSize: 12,
            },
            formatter(value) {
              const month = value.split('-')[1];
              const day = value.split('-')[2];
              return `${month}/${day}`;
            },
          },
          axisTick: {
            alignWithLabel: true,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#eee'],
              width: 1,
              type: 'solid',
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          minInterval: 1,
          name: intl.formatMessage({ id: `${intlPrefix}.times` }),
          nameLocation: 'end',
          nameTextStyle: {
            color: '#000',
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#eee',
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#eee'],
            },
          },
          axisLabel: {
            color: 'rgba(0,0,0,0.65)',
          },
        },
      ],
      series: [
        {
          name: intl.formatMessage({ id: `${intlPrefix}.failed.times` }),
          type: 'bar',
          barWidth: '60%',
          data: chartData ? chartData.data : [],
        },
      ],
    };
  }

  render() {
    return (
      <div className="c7n-iam-dashboard-failedsaga">
        <DashBoardToolBar>
          <TimePicker
            startTime={FailedSagaStore.getStartTime}
            endTime={FailedSagaStore.getEndTime}
            func={this.loadChart}
            handleSetStartTime={startTime => FailedSagaStore.setStartTime(startTime)}
            handleSetEndTime={endTime => FailedSagaStore.setEndTime(endTime)}
          />
        </DashBoardToolBar>
        <Spin spinning={FailedSagaStore.loading}>
          <div className="c7n-iam-dashboard-failedsaga-chart">
            <ReactEcharts
              style={{ height: '100%' }}
              option={this.getOption()}
            />
          </div>
        </Spin>
        <DashBoardNavBar>
          <Link to="/asgard/saga-instance"><FormattedMessage id={`${intlPrefix}.redirect`} /></Link>
        </DashBoardNavBar>
      </div>
    );
  }
}
