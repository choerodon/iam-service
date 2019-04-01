/* eslint-disable */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { axios, Content, Header, Page, Permission } from 'choerodon-front-boot';
import { Button, Icon, Select, Spin } from 'choerodon-ui';
import _ from 'lodash';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import './APIOverview.scss';
import APIOverviewStore from '../../../stores/global/api-overview';
import TimePicker from '../../../components/timePicker';

const { Option } = Select;
const intlPrefix = 'global.apioverview';
const colorArr = ['#FDB34E', '#5266D4', '#FD717C', '#53B9FC', '#F44336', '#6B83FC', '#B5D7FD', '#00BFA5']; // 默认取色

@withRouter
@injectIntl
@inject('AppState')
@observer
export default class APIOverview extends Component {
  state = this.getInitState();

  componentDidMount() {
    this.loadFirstChart();
    this.loadSecChart();
    APIOverviewStore.setThirdLoading(true);
    APIOverviewStore.loadServices().then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else if (data.length) {
        const handledData = data.map(item => item = { name: item.name.split(':')[1] });
        APIOverviewStore.setService(handledData);
        APIOverviewStore.setCurrentService(handledData[0]);
        const startDate = APIOverviewStore.thirdStartTime.format().split('T')[0];
        const endDate = APIOverviewStore.thirdEndTime.format().split('T')[0];
        APIOverviewStore.loadThirdChart(startDate, endDate, handledData[0].name);
      }
    }).catch((error) => {
      Choerodon.handleResponseError(error);
    });
  }

  componentWillUnmount() {
    this.initTime();
    APIOverviewStore.setCurrentService({});
    APIOverviewStore.setService([]);
    APIOverviewStore.setFirstChartData(null);
    APIOverviewStore.setSecChartData(null);
    APIOverviewStore.setThirdChartData(null);
  }

  getInitState() {
    return {
      dateType: 'seven',
      thirdDateType: 'seven',
    };
  }

  handleRefresh = () => {
   this.initTime();
    APIOverviewStore.setThirdLoading(true);
    this.loadFirstChart();
    this.setState(this.getInitState(), () => {
      this.loadSecChart();
      APIOverviewStore.loadServices().then((data) => {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else if (data.length) {
          const handledData = _.uniqBy(data.map(item => item = { name: item.name.split(':')[1] }), 'name');
          APIOverviewStore.setService(handledData);
          APIOverviewStore.setCurrentService(handledData[0]);
          const startDate = APIOverviewStore.thirdStartTime.format().split('T')[0];
          const endDate = APIOverviewStore.thirdEndTime.format().split('T')[0];
          APIOverviewStore.loadThirdChart(startDate, endDate, handledData[0].name);
        }
      }).catch((error) => {
        Choerodon.handleResponseError(error);
      });
    });
  };

  initTime = () => {
    APIOverviewStore.setSecStartTime(moment().subtract(6, 'days'));
    APIOverviewStore.setThirdStartTime(moment().subtract(6, 'days'));
    APIOverviewStore.setSecEndTime(moment());
    APIOverviewStore.setThirdEndTime(moment());
    APIOverviewStore.setThirdStartDate(null);
    APIOverviewStore.setThirdEndDate(null);
  }

  loadFirstChart = () => {
    APIOverviewStore.setFirstLoading(true);
    APIOverviewStore.loadFirstChart();
  }

  loadSecChart = () => {
    APIOverviewStore.setSecLoading(true);
    const startDate = APIOverviewStore.getSecStartTime.format().split('T')[0];
    const endDate = APIOverviewStore.getSecEndTime.format().split('T')[0];
    APIOverviewStore.loadSecChart(startDate, endDate);
  };

  loadThirdChart = () => {
    APIOverviewStore.setThirdLoading(true);
    const currentService = APIOverviewStore.getCurrentService;
    const startDate = APIOverviewStore.getThirdStartTime.format().split('T')[0];
    const endDate = APIOverviewStore.getThirdEndTime.format().split('T')[0];
    APIOverviewStore.loadThirdChart(startDate, endDate, currentService.name);
  }


  getFirstChart = () => (
    <div className="c7n-iam-api-overview-top-container-first-container">
      {
          APIOverviewStore.firstLoading ? (
            <Spin spinning={APIOverviewStore.firstLoading} />
          ) : (
            <ReactEcharts
              style={{ width: '100%', height: 380 }}
              option={this.getFirstChartOption()}
            />
          )
        }
    </div>
  )

  getSecChart = () => {
    return (
      <div className="c7n-iam-api-overview-top-container-sec-container">
        <Spin spinning={APIOverviewStore.secLoading}>
          <div className="c7n-iam-api-overview-top-container-sec-container-timewrapper">
            <TimePicker
              showDatePicker={false}
              startTime={APIOverviewStore.getSecStartTime}
              endTime={APIOverviewStore.getSecEndTime}
              handleSetStartTime={(startTime) => APIOverviewStore.setSecStartTime(startTime)}
              handleSetEndTime={(endTime) => APIOverviewStore.setSecEndTime(endTime)}
              func={this.loadSecChart}
            />
          </div>
          <ReactEcharts
            style={{ width: '100%', height: 380 }}
            option={this.getSecChartOption()}
            notMerge
          />
        </Spin>
      </div>
    );
  }

  getThirdChart = () => {
    const { intl } = this.props;
    return (
      <div className="c7n-iam-api-overview-third-container">
        <Spin spinning={APIOverviewStore.thirdLoading}>
          <div className="c7n-iam-api-overview-third-container-timewrapper">
            <Select
              style={{ width: '175px', marginRight: '34px' }}
              value={APIOverviewStore.currentService.name}
              getPopupContainer={() => document.getElementsByClassName('page-content')[0]}
              onChange={this.handleChange.bind(this)}
              label={<FormattedMessage id={`${intlPrefix}.belong`} />}
            >
              {this.getOptionList()}
            </Select>
            <TimePicker
              showDatePicker
              startTime={APIOverviewStore.getThirdStartDate}
              endTime={APIOverviewStore.getThirdEndDate}
              func={this.loadThirdChart}
              handleSetStartTime={(startTime) => APIOverviewStore.setThirdStartTime(startTime)}
              handleSetEndTime={(endTime) => APIOverviewStore.setThirdEndTime(endTime)}
              handleSetStartDate={(startTime) => APIOverviewStore.setThirdStartDate(startTime)}
              handleSetEndDate={(endTime) => APIOverviewStore.setThirdEndDate(endTime)}
            />
          </div>
          <ReactEcharts
            className="c7n-iam-api-overview-third-chart"
            style={{ width: '100%', height: 400 }}
            option={this.getThirdChartOption()}
            notMerge
          />
        </Spin>
      </div>
    );
  }

  /* 微服务下拉框 */
  getOptionList() {
    const { intl } = this.props;
    const service = APIOverviewStore.getService;
    return service && service.length > 0 ? (
      service.map(({ name }, index) => (
        <Option key={index} value={name}>{name}</Option>
      ))
    ) : <Option value="empty">{intl.formatMessage({ id: `${intlPrefix}.belong.empty` })}</Option>;
  }

  /**
   * 微服务下拉框改变事件
   * @param serviceName 服务名称
   */
  handleChange(serviceName) {
    const currentService = APIOverviewStore.service.find(service => service.name === serviceName);
    APIOverviewStore.setCurrentService(currentService);
    this.loadThirdChart();
  }

  // 获取第一个图表的配置参数
  getFirstChartOption() {
    const { intl }  = this.props;
    const { firstChartData } = APIOverviewStore;
    let handledFirstChartData;
    if (firstChartData) {
      handledFirstChartData = firstChartData.services.map((item, index) => item = { name: item, value: firstChartData.apiCounts[index] });
    }
    return {
      title: {
        text: intl.formatMessage({ id: `${intlPrefix}.api.total.count` }),
        textStyle: {
          color: 'rgba(0,0,0,0.87)',
          fontWeight: '400',
        },
        top: 20,
        left: 16,
      },
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: '{b} <br/>百分比: {d}% <br/>总数: {c}',
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
        right: 15,
        itemHeight: 11,
        y: 'center',
        type: 'plain',
        data: firstChartData ? firstChartData.services : [],
        orient: 'vertical', // 图例纵向排列
        icon: 'circle',
      },
      // calculable: true,
      series: [
        {
          type: 'pie',
          radius: [20, 110],
          center: ['31%', '50%'],
          roseType: 'radius',
          minAngle: 30,
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false,
            },
          },
          data: handledFirstChartData || {},
        },
      ],
      color: colorArr,
    };
  }

  // 获取第二个图表的配置参数
  getSecChartOption() {
    const secChartData = APIOverviewStore.getSecChartData;
    const { intl: { formatMessage } } = this.props;
    let handleSeriesData = [];
    if (secChartData) {
      handleSeriesData = secChartData.details.map(item => ({
        type: 'line',
        name: item.service,
        data: item.data,
        smooth: 0.5,
        smoothMonotone: 'x',
        symbol: 'circle',
        areaStyle: {
          opacity: '0.5',
        },
      }));
    }
    return {
      title: {
        text: formatMessage({ id: `${intlPrefix}.api.used.count` }),
        textStyle: {
          color: 'rgba(0,0,0,0.87)',
          fontWeight: '400',
        },
        top: 20,
        left: 16,
      },

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
      legend: {
        top: 60,
        right: 16,
        itemHeight: 11,
        type: 'plain',
        orient: 'vertical', // 图例纵向排列
        icon: 'circle',
        data: secChartData ? secChartData.service : [],
      },
      grid: {
        left: '3%',
        top: 110,
        width: '65%',
        height: '55%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisTick: { show: false },
          axisLine: {
            lineStyle: {
              color: '#eee',
              type: 'solid',
              width: 2,
            },
            onZero: true,
          },
          axisLabel: {
            margin: 7, // X轴文字和坐标线之间的间距
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
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#eee'],
              width: 1,
              type: 'solid',
            },
          },
          data: secChartData ? secChartData.date : [],
        },
      ],
      yAxis: [
        {
          type: 'value',
          minInterval: 1,
          name: '次数',
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
          axisTick: {
            show: false,
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
      series: handleSeriesData,
      color: colorArr,
    };
  }

  // 获取第三个图表的配置参数
  getThirdChartOption() {
    const { intl: { formatMessage } } = this.props;
    const thirdChartData = APIOverviewStore.getThirdChartData;
    const copyThirdChartData = JSON.parse(JSON.stringify(thirdChartData));
    let handledData = [];
    let handledApis = {};
    if (thirdChartData) {
      handledData = thirdChartData.details.map(item => ({
        type: 'line',
        name: `${item.api.split(':')[1]}: ${item.api.split(':')[0]}`,
        data: item.data,
        smooth: 0.2,
      }));
      if (copyThirdChartData.api.length) {
        copyThirdChartData.api.map((item) => { handledApis[item] = false; });
        const selectedApis = copyThirdChartData.api.splice(0, 10);
        for (let item of selectedApis) {
          handledApis[item] = true;
        }
      } else {
        handledApis = {};
      }
    }

    return {
      title: {
        text: formatMessage({ id: `${intlPrefix}.api.single.count` }),
        textStyle: {
          color: 'rgba(0,0,0,0.87)',
          fontWeight: '400',
        },
        top: 20,
        left: 16,
      },
      tooltip: {
        trigger: 'item',
        confine: true,
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#DDDDDD',
        extraCssText: 'box-shadow: 0 2px 4px 0 rgba(0,0,0,0.20)',
        textStyle: {
          fontSize: 13,
          color: '#000000',
        },

        formatter(params) {
          return `<div>
              <div>${params.name}</div>
              <div><span class="c7n-iam-apioverview-charts-tooltip" style="background-color:${params.color};"></span>${params.seriesName}</div>
              <div>次数: ${params.value}</div>
            <div>`;
        },
      },
      legend: {
        show: true,
        type: 'scroll',
        orient: 'vertical', // 图例纵向排列
        itemHeight: 11,
        top: 80,
        left: '72%',
        // right: 5,
        icon: 'circle',
        height: '70%',
        data: thirdChartData ? thirdChartData.api : [],
        selected: handledApis,
        formatter(name) {
          const showLength = 44; // 截取长度
          if (name.length > showLength) {
            name = name.substring(0, showLength) + '...';
          }
          return name;
//           let strFirstPart;
//           let strSecPart;
//           let strThirdPart;
//           let result;
//           const length = name.length / 48;
//           const perLength = 48;
//           if (length > 1 && length <= 2) {
//             strFirstPart = name.substring(0, perLength);
//             strSecPart = name.substring(perLength);
//             result = `${strFirstPart}
// ${strSecPart}`;
//           } else if (length > 2) {
//             strFirstPart = name.substring(0, perLength);
//             strSecPart = name.substring(perLength, perLength * 2);
//             strThirdPart = name.substring(perLength * 2);
//             result = `${strFirstPart}
// ${strSecPart}
// ${strThirdPart}`;
//           } else {
//             result = name;
//           }
//           return result;
        },
        tooltip: {
          show: true,
        },
      },
      grid: {
        left: '3%',
        top: 110,
        containLabel: true,
        width: '66%',
        height: '62.5%',
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisTick: { show: false },
          axisLine: {
            lineStyle: {
              color: '#eee',
              type: 'solid',
              width: 2,
            },
            onZero: true,
          },
          axisLabel: {
            margin: 7, // X轴文字和坐标线之间的间距
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
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#eee'],
              width: 1,
              type: 'solid',
            },
          },
          data: thirdChartData ? thirdChartData.date : [],
        },
      ],
      yAxis: [
        {
          type: 'value',
          minInterval: 1,
          name: '次数',
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
          axisTick: {
            show: false,
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
      series: handledData,
      color: colorArr,
    };
  }


  render() {
    return (
      <Page
        service={[
          'manager-service.api.queryInstancesAndApiCount',
          'manager-service.api.queryApiInvoke',
          'manager-service.api.queryServiceInvoke',
        ]}
      >
        <Header
          title={<FormattedMessage id={`${intlPrefix}.header.title`} />}
        >
          <Button
            onClick={this.handleRefresh}
            icon="refresh"
          >
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content>
          <div className="c7n-iam-api-overview-top-container">
            {this.getFirstChart()}
            {this.getSecChart()}
          </div>
          {this.getThirdChart()}
        </Content>
      </Page>
    );
  }
}
