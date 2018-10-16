import React, { Component } from 'react';

class Join extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const { join, warningToastr } = this.props;
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    const passwordCheck = this.refs.passwordCheck.value;
    const handle = this.refs.handle.value;
    const name = this.refs.name.value;
    if (email.length === 0) {
      warningToastr('이메일을 입력해 주세요.');
    } else if (email.match(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/g) === undefined) {
      warningToastr('유효하지 않은 이메일입니다.');
    } else if (name.length === 0) {
      warningToastr('이름을 입력해 주세요.');
    } else if (handle.length === 0) {
      warningToastr('핸들을 입력해 주세요.');
    } else if (password.length === 0) {
      warningToastr('비밀번호를 입력해 주세요.');
    } else if (passwordCheck !== password) {
      warningToastr('비밀번호 확인이 일치하지 않습니다.');
    } else {
      join({
        email, password, name, handle,
      });
    }
  }

  render() {
    return (
      <form className='auth-form' onSubmit={this.handleSubmit}>
        <label className='auth-label' htmlFor='email'>이메일</label>
        <input ref='email' type='text' className='auth-input' placeholder='' />
        <label className='auth-label' htmlFor='name'>이름</label>
        <input ref='name' type='text' className='auth-input' placeholder='' />
        <label className='auth-label' htmlFor='handle'>핸들</label>
        <input ref='handle' type='text' className='auth-input' placeholder='' />
        <label className='auth-label' htmlFor='password'>비밀번호</label>
        <input ref='password' type='password' className='auth-input' placeholder='' />
        <label className='auth-label' htmlFor='passwordCheck'>비밀번호 확인</label>
        <input ref='passwordCheck' type='password' className='auth-input' placeholder='' />
        <div className='auth-btn' onClick={this.handleSubmit}>회원가입</div>
        <input type='submit' hidden />
      </form>
    );
  }
}

export default Join;
