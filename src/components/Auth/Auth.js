import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router-dom';
import classNames from 'classnames/bind';
import {
  login, join, findPw, changePw,
} from '../../actions/auth';
import { warningToastr } from '../../actions/toastr';
import Login from './Login';
import Join from './Join';
import Find from './Find';
import Change from './Change';
import styles from './Auth.scss';

const cx = classNames.bind(styles);

const stateToProps = ({ user }) => ({ user });
const actionToProps = {
  login: login.REQUEST,
  join: join.REQUEST,
  findPw: findPw.REQUEST,
  changePw: changePw.REQUEST,
  warningToastr,
};

@connect(stateToProps, actionToProps)
@withRouter
class Auth extends Component {
  componentDidMount() {
    const { showScroll } = this.props;
    showScroll(false);
  }

  componentWillUnmount() {
    const { showScroll } = this.props;
    showScroll(true);
  }

  render() {
    const {
      login, join, user, findPw, changePw, warningToastr,
    } = this.props;
    const { path } = this.props.match;
    return (
      <div className={cx('Auth')}>
        <div className='auth-helper' />
        <Route
          path={`${path}/login`}
          render={(props) => {
            if (user.verify) {
              return (
                <Redirect to={props.location.pathname.replace(props.match.path, '')} />
              );
            }
            return (
              <Login
                {...props}
                login={login}
                warningToastr={warningToastr}
              />
            );
          }}
        />
        <Route
          path={`${path}/join`}
          render={props => (
            <Join
              {...props}
              join={join}
              warningToastr={warningToastr}
            />
          )}
        />
        <Route
          path={`${path}/find`}
          render={props => (
            <Find
              {...props}
              findPw={findPw}
              warningToastr={warningToastr}
            />
          )}
        />
        <Route
          path={`${path}/change/:email?/:link?`}
          render={props => (
            <Change
              {...props}
              changePw={changePw}
              warningToastr={warningToastr}
            />
          )}
        />
      </div>
    );
  }
}

export default Auth;
