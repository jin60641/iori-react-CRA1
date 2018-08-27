import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router-dom';
import './Setting.css';

import Notice from './Notice';
import Account from './Account';

const tabs = [{
  key : 'account',
  name : '계정'
},{
  key : 'notice',
  name : '알림'
}];

const stateToProps = ({ user }) => ({ user });

@withRouter
@connect(stateToProps,undefined)
class Setting extends Component {
  render(){
    const { path } = this.props.match;
    return (
      <div className="Setting">
        <div className="setting-tabs">
          { tabs.map( tab => (
            <div className="setting-tab" key={`setting-tab-${tab.key}`}>
              {tab.name}
            </div>
          ))}
        </div>
        <div className="setting-body">
	        <Route path={`${path}/account`} render={(props) => (
	          <Account {...props} />
	        )}/>
	        <Route path={`${path}/notice`} render={(props) => (
	          <Notice {...props} />
	        )}/>
        </div>
      </div>
    );
  }
}

export default Setting;
