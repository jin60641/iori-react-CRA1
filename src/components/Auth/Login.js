import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Login.scss';

const cx = classNames.bind(styles);

class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const { login, warningToastr } = this.props;
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    if (email.length === 0) {
      warningToastr('이메일을 입력해 주세요.');
    } else if (email.match(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/g) === undefined) {
      warningToastr('유효하지 않은 이메일입니다.');
    } else if (password.length === 0) {
      warningToastr('비밀번호를 입력해 주세요.');
    } else {
      login({ email, password });
    }
  }

  render() {
    return (
      <form className='auth-form' onSubmit={this.handleSubmit}>
        <label className='auth-label' htmlFor='email'>이메일</label>
        <input ref='email' type='text' className='auth-input' placeholder='' />
        <label className='auth-label' htmlFor='password'>비밀번호</label>
        <input ref='password' type='password' className='auth-input' placeholder='' />
        <div className={cx('auth-btn', 'login-local')} onClick={this.handleSubmit}>로그인</div>
        <div className={cx('auth-btn', 'login-facebook')}>
          <img className={cx('auth-btn-img', 'auth-facebook-img')} src='/images/ic_facebook.png' alt='login by facebook' />
페이스북으로 로그인

        </div>
        <div className={cx('auth-btn', 'login-twitter')}>
          <img className={cx('auth-btn-img', 'auth-twitter-img')} src='/images/ic_twitter.png' alt='login by twitter' />
트위터로 로그인

        </div>
        <div className='auth-text'>
비밀번호를 잊으셨나요?
          <Link className='auth-text-link' to='/auth/find'>비밀번호 찾기</Link>
        </div>
        <div className='auth-text'>
아직 회원이 아니신가요?
          <Link className='auth-text-link' to='/auth/join'>회원가입</Link>
        </div>
        <input type='submit' hidden />
      </form>
    );
  }
}
export default Login;
