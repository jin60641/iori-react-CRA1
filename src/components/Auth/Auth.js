import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login, join, findPw, changePw } from '../../actions/auth';
import { BrowserRouter as Router, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import Login from './Login';
import Join from './Join';
import Find from './Find';
import Change from './Change';
import styles from './Auth.css';
import classNames from 'classnames/bind'
const cx = classNames.bind(styles);


class Auth extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    const { showScroll } = this.props;
    showScroll(false);
  }
  componentWillUnMount(){
    const { showScroll } = this.props;
    showScroll(true);
  }
  pushState = url => {
    const { history, showScroll } = this.props;
    showScroll(true);
    history.push(url);
  }
  render(){
    const { login, join, pushState, user } = this.props;
    const { path } = this.props.match;
    return(
      <div className="Auth">
        <div className="auth-helper"></div>
        <Route path={`${path}/login`} render={(props) => {
          if( user.verify ){
            return ( 
              <Redirect to={ props.location.pathname.replace(props.match.path,"") } />
            )
          } else {
            return (
              <Login {...props}
                login={login}
                pushState={ this.pushState }
              />
            )
          }
        }} />
        <Route path={`${path}/join`} render={(props) => (
          <Join {...props}
            join={join}
          />
        )}/>
        <Route path={`${path}/find`} render={(props) => (
          <Find {...props}
            findPw={findPw}
          />
        )}/>
        <Route path={`${path}/change/:email?/:link?`} render={(props) => (
          <Change {...props}
            changePw={changePw}
          />
        )}/>
      </div>
    );
  }
}

const stateToProps = ({ user }) => ({ user });
const actionToProps = {
  login : login.REQUEST,
  join : join.REQUEST,
  findPw : findPw.REQUEST,
  changePw : changePw.REQUEST,
};

export default connect(stateToProps,actionToProps)(withRouter(Auth));
