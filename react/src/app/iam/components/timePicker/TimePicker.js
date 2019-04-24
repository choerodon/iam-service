/**
 * 图表日期选择
 */

import React, { Component } from 'react';
import { Button, DatePicker } from 'choerodon-ui';
import classnames from 'classnames';
import moment from 'moment';
import './TimePicker.scss';
import { injectIntl, FormattedMessage } from 'react-intl';

const { RangePicker } = DatePicker;
const ButtonGroup = Button.Group;
const disabledDate = current => current && current > moment().endOf('day');

@injectIntl
export default class TimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 7, // 默认时间选择为近7天
    };
  }


  handleClick(val = 7) {
    const { func, handleSetStartTime, handleSetEndTime } = this.props;
    handleSetEndTime(moment());
    handleSetStartTime(moment().subtract(val - 1, 'days'));
    this.setState({
      type: val,
    }, () => {
      func();
    });
  }

  handleDatePicker = (date, dateString) => {
    const { handleSetStartTime, handleSetEndTime, handleSetStartDate, handleSetEndDate, unlimit, func } = this.props;
    if (moment(dateString[1]).format() > moment(dateString[0]).add(29, 'days').format() && !unlimit) {
      Choerodon.prompt('暂支持最多查看30天，已自动截取开始日期后30天。');
      handleSetStartTime(moment(dateString[0]));
      handleSetEndTime(moment(dateString[0]).add(29, 'days'));
      handleSetStartDate(moment(dateString[0]));
      handleSetEndDate(moment(dateString[0]).add(29, 'days'));
    } else {
      handleSetStartTime(moment(dateString[0]));
      handleSetEndTime(moment(dateString[1]));
      handleSetStartDate(moment(dateString[0]));
      handleSetEndDate(moment(dateString[1]));
    }
    this.setState({
      type: '',
    }, () => {
      func();
    });
  };

  render() {
    const { startTime, endTime, showDatePicker, intl } = this.props;
    const { type } = this.state;
    const btnInfo = [
      {
        // name: intl.formatMessage({ id: 'time.seven.days' }),
        name: '近7天',
        value: 7,
      }, {
        // name: intl.formatMessage({ id: 'time.fifteen.days' }),
        name: '近15天',
        value: 15,
      }, {
        name: '近30天',
        value: 30,
      },
    ];
    return (
      <div className="c7n-iam-chart-date-wrap">
        <div className="c7n-iam-chart-date-wrap-btn">
          <ButtonGroup>
            {
              btnInfo.map(({ name, value }) => (
                <Button key={value} value={value} style={{ backgroundColor: this.state.type === value ? 'rgba(0,0,0,.08)' : '' }} onClick={this.handleClick.bind(this, value)}>{name}</Button>
              ))
            }
          </ButtonGroup>
        </div>
        <div
          className={classnames('c7n-iam-chart-date-time-pick', { 'c7n-iam-chart-date-time-pick-selected': type === '' })}
          style={{ display: showDatePicker ? 'inlineBlock' : 'none' }}
        >
          <RangePicker
            disabledDate={disabledDate}
            value={[startTime, endTime]}
            allowClear={false}
            onChange={this.handleDatePicker}
          />
        </div>
      </div>
    );
  }
}
