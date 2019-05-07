import React, { Component } from 'react';
import { axios } from '@choerodon/boot';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { inject, observer } from 'mobx-react';
import { Spin } from 'choerodon-ui';
import './index.scss';

@withRouter
@inject('AppState')
@observer
export default class AddedUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newUsers: 0,
      allUsers: 100,
      loading: true,
    };
  }

  componentWillMount() {
    this.loadUserCount();
  }

  loadUserCount = () => {
    axios.get('iam/v1/users/new').then((data) => {
      if (!data.failed) {
        this.setState({
          newUsers: data.newUsers,
          allUsers: data.allUsers,
          loading: false,
        });
      } else {
        Choerodon.prompt(data.message);
      }
    });
  }

  render() {
    const { newUsers, allUsers, loading } = this.state;
    return (
      <div className="c7n-iam-dashboard-addedusers">
        {
          loading ? <Spin spinning={loading} /> : (
            <React.Fragment>
              <div className="c7n-iam-dashboard-addedusers-main">
                <div>
                  <span>{newUsers}</span><span>人</span>
                </div>
              </div>
              <div className="c7n-iam-dashboard-addedusers-bottom">
            用户总数: {allUsers}
              </div>
            </React.Fragment>
          )
        }
      </div>
    );
  }
}
