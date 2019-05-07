import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { axios, Content, Header, Page, Permission } from '@choerodon/boot';
import { Button, Table, Select, Spin } from 'choerodon-ui';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import './SiteStatistics.scss';
import SiteStatisticsStore from '../../../stores/global/site-statistics';
import TimePicker from '../../../components/timePicker';

const { Option } = Select;
const intlPrefix = 'global.site-statistics';
const colorArr = ['#FDB34E', '#5266D4', '#FD717C', '#53B9FC', '#F44336', '#6B83FC', '#B5D7FD', '#00BFA5']; // 默认取色

@withRouter
@injectIntl
@inject('AppState', 'MenuStore')
@observer
export default class SiteStatistics extends Component {
  componentDidMount() {
    SiteStatisticsStore.setCurrentLevel('site');
    this.handleRefresh();
  }

  handleRefresh = () => {
    this.initTime();
    SiteStatisticsStore.setLoading(true);
    const startDate = SiteStatisticsStore.startTime.format().split('T')[0];
    const endDate = SiteStatisticsStore.endTime.format().split('T')[0];
    SiteStatisticsStore.loadChart(startDate, endDate, SiteStatisticsStore.getCurrentLevel).then(() => {
      this.props.MenuStore.loadMenuData({ type: SiteStatisticsStore.getCurrentLevel }).then((data) => {
        SiteStatisticsStore.appendTableData(data);
      });
    });
  };

  initTime = () => {
    SiteStatisticsStore.setStartTime(moment().subtract(6, 'days'));
    SiteStatisticsStore.setEndTime(moment());
    SiteStatisticsStore.setStartDate(null);
    SiteStatisticsStore.setEndDate(null);
  };

  loadChart = () => {
    SiteStatisticsStore.setLoading(true);
    const currentLevel = SiteStatisticsStore.getCurrentLevel;
    const startDate = SiteStatisticsStore.getStartTime.format().split('T')[0];
    const endDate = SiteStatisticsStore.getEndTime.format().split('T')[0];
    SiteStatisticsStore.loadChart(startDate, endDate, currentLevel).then(() => {
      this.props.MenuStore.loadMenuData({ type: SiteStatisticsStore.getCurrentLevel }).then((data) => {
        SiteStatisticsStore.appendTableData(data);
      });
    });
  };

  getChart = () => {
    const { intl } = this.props;
    return (
      <div className="c7n-iam-site-statistics-third-container">
        <Spin spinning={SiteStatisticsStore.loading}>
          <div className="c7n-iam-site-statistics-third-container-timewrapper">
            <Select
              style={{ width: '175px', marginRight: '34px' }}
              value={SiteStatisticsStore.currentLevel}
              getPopupContainer={() => document.getElementsByClassName('page-content')[0]}
              onChange={this.handleChange.bind(this)}
              label={<FormattedMessage id={`${intlPrefix}.belong`} />}
            >
              {this.getOptionList()}
            </Select>
            <TimePicker
              showDatePicker
              startTime={SiteStatisticsStore.getStartDate}
              endTime={SiteStatisticsStore.getEndDate}
              func={this.loadChart}
              handleSetStartTime={startTime => SiteStatisticsStore.setStartTime(startTime)}
              handleSetEndTime={endTime => SiteStatisticsStore.setEndTime(endTime)}
              handleSetStartDate={startTime => SiteStatisticsStore.setStartDate(startTime)}
              handleSetEndDate={endTime => SiteStatisticsStore.setEndDate(endTime)}
            />
          </div>
          <ReactEcharts
            className="c7n-iam-site-statistics-third-chart"
            style={{ width: '100%', height: 400 }}
            option={this.getChartOption()}
            notMerge
          />
        </Spin>
      </div>
    );
  };

  getTable = () => (
    <Table
      columns={this.getTableColumns()}
      dataSource={SiteStatisticsStore.getTableData.slice()}
      rowKey="code"
      fixed
    />
  );

  getTableColumns() {
    return [
      {
        title: <FormattedMessage id={`${intlPrefix}.table.name`} />,
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        filters: [],
        onFilter: (value, record) => record.name.toString().indexOf(value) === 0,
      },
      {
        title: <FormattedMessage id={`${intlPrefix}.table.code`} />,
        dataIndex: 'code',
        key: 'code',
        width: '50%',
      },
      {
        title: <FormattedMessage id={`${intlPrefix}.table.click-sum`} />,
        dataIndex: 'sum',
        key: 'sum',
        width: '20%',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.sum - b.sum,
      },
    ];
  }

  getOptionList() {
    const { intl } = this.props;
    const level = ['site', 'project', 'organization', 'user'];
    return (
      level.map((name, index) => (
        <Option key={index} value={name}>{intl.formatMessage({ id: name })}</Option>
      ))
    );
  }

  handleChange(level) {
    SiteStatisticsStore.setCurrentLevel(level);
    this.props.MenuStore.loadMenuData({ type: level }).then((data) => {
      SiteStatisticsStore.appendTableData(data);
    });
    this.loadChart();
  }

  getChartOption() {
    const { intl: { formatMessage } } = this.props;
    const chartData = SiteStatisticsStore.getChartData;
    const copyChartData = JSON.parse(JSON.stringify(chartData));
    let handledData = [];
    let handledApis = {};
    if (chartData) {
      handledData = chartData.details.map(item => ({
        type: 'line',
        name: `${item.menu.split(':')[1]}: ${item.menu.split(':')[0]}`,
        data: item.data,
        smooth: 0.2,
      }));
      if (copyChartData.menu.length) {
        copyChartData.menu.forEach((item) => { handledApis[item] = false; });
        const selectedApis = copyChartData.menu.splice(0, 10);
        selectedApis.forEach((item) => { handledApis[item] = true; });
      } else {
        handledApis = {};
      }
    }

    return {
      title: {
        text: formatMessage({ id: `${intlPrefix}.menu.count` }),
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
              <div><span class="c7n-iam-sitestatics-charts-tooltip" style="background-color:${params.color};"></span>${params.seriesName}</div>
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
        data: chartData ? chartData.menu : [],
        selected: handledApis,
        formatter(name) {
          const showLength = 44; // 截取长度
          name = name.split(':')[1];
          if (name.length > showLength) {
            name = `${name.substring(0, showLength)}...`;
          }
          return name;
        },
        tooltip: {
          show: true,
          formatter(item) {
            return item.name;
          },
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
          data: chartData ? chartData.date : [],
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

  clickDownload = () => {
    const { intl } = this.props;
    let str = `时间范围：${SiteStatisticsStore.startTime.format().split('T')[0].replace('-', '.')} -- ${SiteStatisticsStore.endTime.format().split('T')[0].replace('-', '.')}\n菜单名称,菜单编码,菜单点击总数,层级`;
    SiteStatisticsStore.getAllTableDate().then((data) => {
      data.forEach((v) => {
        str += `\n${v.name},${v.code},${v.sum},${intl.formatMessage({ id: v.level })}`;
      });
      str = encodeURIComponent(str);
      const aLink = document.getElementById('download');
      aLink.download = this.getDownloadName();
      aLink.href = `data:text/csv;charset=utf-8,\ufeff${str}`;
      aLink.click();
    });
  };

  getDownloadName = () => {
    const momentTime = moment(new Date().getTime());
    return `平台菜单统计-${momentTime.format('YYYYMMDDHHmm')}.csv`;
  };


  render() {
    return (
      <Page
        service={[
          'manager-service.statistic.queryMenuClick',
        ]}
      >
        <Header
          title={<FormattedMessage id={`${intlPrefix}.header.title`} />}
        >
          <Button
            onClick={this.clickDownload}
            icon="get_app"
          >
            导出表格csv文件
          </Button>
          <Button
            onClick={this.handleRefresh}
            icon="refresh"
          >
            <FormattedMessage id="refresh" />
          </Button>
          <a id="download" download="site-statistics.csv" href="#" />
        </Header>
        <Content>
          {this.getChart()}
          {this.getTable()}
        </Content>
      </Page>
    );
  }
}
