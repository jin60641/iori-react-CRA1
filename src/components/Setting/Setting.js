import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  NavLink, Switch, Redirect, Route, withRouter,
} from 'react-router-dom';

import classNames from 'classnames/bind';
import Account from './Account';
import Notice from './Notice';

import styles from './Setting.scss';

const cx = classNames.bind(styles);

const tabs = [{
  key: 'account',
  name: '계정',
  link: '/account',
  component: Account,
}, {
  key: 'notice',
  name: '알림',
  link: '/notice',
  component: Notice,
}];

const stateToProps = ({ user }) => ({ user });

@withRouter
@connect(stateToProps, undefined)
class Setting extends Component {
  render() {
    const { url } = this.props;
    return (
      <div className='Setting'>
        <div className='setting-tabs'>
          { tabs.map(tab => (
            <NavLink
              className='setting-tab'
              activeClassName={cx('setting-tab', 'setting-tab-active')}
              key={`setting-tab-${tab.key}`}
              to={`${url}${tab.link}`}
            >
              {tab.name}
            </NavLink>
          ))}
        </div>
        <div className='setting-body'>
          <Switch>
            { tabs.map(tab => (
              <Route
                path={`${url}${tab.link}`}
                component={tab.component}
                key={`setting-route-${tab.key}`}
              />
            ))}
            <Redirect to={`${url}${tabs[0].link}`} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Setting;
