import React, { Component } from 'react';
import { DashBoardNavBar, DashBoardToolBar } from '@choerodon/boot';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { inject, observer } from 'mobx-react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import { Button, Icon, Select, Spin } from 'choerodon-ui';
import OrganizationStatisticsStore from '../../stores/dashboard/organizationStatistics';
import './index.scss';

const ButtonGroup = Button.Group;

@withRouter
@inject('AppState')
@observer
export default class OrganizationStatistics extends Component {
  componentWillMount() {
    this.loadChart();
  }

  
  loadChart = () => {
    OrganizationStatisticsStore.setLoading(true);
    OrganizationStatisticsStore.loadOrganizations();
  }

  setOrgId(id, e) {
    if (id !== OrganizationStatisticsStore.getCurrentOrg) {
      OrganizationStatisticsStore.setLoading(true);
      OrganizationStatisticsStore.setCurrentOrg(id);
      OrganizationStatisticsStore.loadPie(id);
    }
  }

  renderOrgs = () => {
    const orgs = OrganizationStatisticsStore.getOrganizations;
    const btns = orgs.map(({ name, id }) => (
      <Button key={id} value={id} onClick={this.setOrgId.bind(this, id)} style={{ backgroundColor: OrganizationStatisticsStore.getCurrentOrg === id ? 'rgba(140,158,255,0.16' : '', color: OrganizationStatisticsStore.getCurrentOrg === id ? '#3f51b5' : '#000' }}>{name}</Button>
    ));

    return btns;
  }

  getOption() {
    const chartData = OrganizationStatisticsStore.getChartData;
    return {
      tooltip: {
        trigger: 'item',
        confine: true,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        extraCssText: 'box-shadow: 0 2px 4px 0 rgba(0,0,0,0.20)',
        textStyle: {
          fontSize: 13,
          color: '#000000',
        },
        formatter(params) {
          const { projects } = params.data;
          const eachProjects = projects.length && projects.map(item => `<div class="c7n-iam-orgstatistics-pro">${item}</div>`);
          const ellipsis = params.data.projects.length > 8 ? '<div class="c7n-iam-orgstatistics-pro">...</div>' : '';
          return `<div>
              <div class="c7n-iam-orgstatistics-type"><span class="c7n-iam-orgstatistics-tooltip" style="background-color:${params.color};"></span>${params.data.name}(${params.data.projects.length}个)</div>
              ${projects.length ? eachProjects.splice(0, 8).join('') : ''}${ellipsis}
            <div>`;
        },
      },
      legend: {
        icon: 'circle',
        itemHeight: 8,
        bottom: '2%',
        width: '250px',
        data: chartData ? chartData.legend : [],
      },
      series: [
        {
          type: 'pie',
          center: ['50%', '33%'],
          radius: ['30%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          itemStyle: {
            normal: {
              borderColor: '#FFFFFF', borderWidth: 1,
            },
          },
          data: chartData ? chartData.data : [],
        },
      ],
      color: ['#B5CFFF', '#00BFA5', '#F7667F', '#5266D4', '#57AAF8', '#7589F2', '#FFB100', '#32C6DE', '#D3D3D3'],
    };
  }

  render() {
    return (
      <div className="c7n-iam-orgstatistics-wrapper">
        <Spin spinning={OrganizationStatisticsStore.loading}>
          <div className="c7n-iam-orgstatistics">
            <ButtonGroup className="c7n-iam-orgstatistics-btns">
              {this.renderOrgs()}
            </ButtonGroup>
            <div className="c7n-iam-orgstatistics-chart">
              <ReactEcharts
                style={{ height: '100%' }}
                option={this.getOption()}
                notMerge
              />
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}
