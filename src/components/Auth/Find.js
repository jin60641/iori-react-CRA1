import React, { Component } from 'react';

class Find extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const { findPw, warningToastr } = this.props;
    const email = this.refs.email.value;
    if (email.length === 0) {
      warningToastr('이메일을 입력해 주세요.');
    } else if (email.match(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/g) === undefined) {
      warningToastr('유효하지 않은 이메일입니다.');
    } else {
      findPw({ email });
    }
  }

  render() {
    return (
      <form className='auth-form' onSubmit={this.handleSubmit}>
        <label className='auth-label' htmlFor='email'>이메일</label>
        <input ref='email' type='text' className='auth-input' placeholder='' />
        <div className='auth-btn' onClick={this.handleSubmit}>비밀번호 찾기</div>
        <input type='submit' hidden />
      </form>
    );
  }
}

export default Find;
