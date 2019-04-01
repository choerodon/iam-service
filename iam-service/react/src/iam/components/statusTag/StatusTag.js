import React, { Component } from 'react';
import { Icon } from 'choerodon-ui';
import PropTypes from 'prop-types';
import './StatusTag.scss';

const Color = {
  RUNNING: '#4d90fe',
  FAILED: '#f44336',
  COMPLETED: '#00BFA5',
  NON_CONSUMER: '#00BFA5',
  DEFAULT: '#b8b8b8',
};

const IconType = {
  COMPLETED: 'check_circle',
  NON_CONSUMER: 'check_circle',
  FAILED: 'cancel',
  ENABLE: 'check_circle',
  DISABLE: 'remove_circle',
  FINISHED: 'state_over',
  RUNNING: 'timelapse',
  PREDEFINE: 'settings',
  CUSTOM: 'av_timer',
  UN_START: 'timer',
  QUEUE: 'watch_later',
};

export default class StatusTag extends Component {
  static propTypes = {
    name: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
    color: PropTypes.string,
    colorCode: PropTypes.string,
    iconType: PropTypes.string,
  };

  static defaultProps = {
    colorCode: 'DEFAULT',
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !(nextProps.name === this.props.name
      && nextProps.color === this.props.color &&
    nextProps.colorCode === this.props.colorCode);
  }

  renderIconMode() {
    const { name, colorCode, iconType } = this.props;
    return (
      <span
        className="c7n-iam-status-tag-with-icon"
        style={{
          ...this.props.style,
        }}
      >
        <Icon type={iconType || [IconType[colorCode]]} />
        <span>{ name || '' }</span>
      </span>
    );
  }

  renderDefaultMode() {
    const { name, color, colorCode } = this.props;
    return (
      <div
        className="c7n-iam-status-tag"
        style={{
          background: color || Color[colorCode],
          ...this.props.style,
        }}
      >
        <div>{name}</div>
      </div>
    );
  }

  render() {
    const { mode } = this.props;
    switch (mode) {
      case 'icon':
        return this.renderIconMode();
      default:
        return this.renderDefaultMode();
    }
  }
}
