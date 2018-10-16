import React, { Component } from 'react';

class Change extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const { changePw, warningToastr } = this.props;
    const { email, link } = this.props.match.params;
    const password = this.refs.password.value;
    const passwordCheck = this.refs.passwordCheck.value;
    if (password.length === 0) {
      warningToastr('비밀번호를 입력해 주세요.');
    } else if (passwordCheck !== password) {
      warningToastr('비밀번호 확인이 일치하지 않습니다.');
    } else {
      changePw({ password, email, link });
    }
  }

  render() {
    return (
      <form className='auth-form' onSubmit={this.handleSubmit}>
        <label className='auth-label' htmlFor='password'>새 비밀번호</label>
        <input ref='password' type='password' className='auth-input' placeholder='' />
        <label className='auth-label' htmlFor='passwordCheck'>새 비밀번호 확인</label>
        <input ref='passwordCheck' type='password' className='auth-input' placeholder='' />
        <div className='auth-btn' onClick={this.handleSubmit}>비밀번호 변경</div>
        <input type='submit' hidden />
      </form>
    );
  }
}

export default Change;
