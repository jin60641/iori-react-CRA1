import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router-dom';
import './Setting.scss';

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
	        <Account />
	        <Notice />
        </div>
      </div>
    );
  }
}

export default Setting;
