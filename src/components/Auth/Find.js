import React, { Component } from 'react';

class Find extends Component {
	constructor(props){
		super(props);
		this.state = {
			message : ' '
		}
	}
	handleFindPw = data => {
		const { findPw } = this.props;
		findPw(data)
    /*
		.then( action => {
			if( action.error ){
				this.setState({
					message : action.payload.message
				});
			} else {
				this.setState({
					message : action.payload
				});
			}
		});
    */
	}
	handleSubmit = e => {
		e.preventDefault();
		const email = this.refs.email.value;
		if( email.length === 0 ){
			this.setState({
				message : "이메일을 입력해 주세요."
			});
		} else if( email.match(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/g ) === undefined ){
			this.setState({
				message : "유효하지 않은 이메일입니다."
			});
		} else {
			this.handleFindPw({email});
		}
	}

	render(){ 
		const { message } = this.state;
		return (
			<form className="auth-form" onSubmit={this.handleSubmit} >
				<label className="auth-label" htmlFor="email">이메일</label>
				<input ref="email" type="text" className="auth-input" placeholder="" />
				<div className="auth-btn" onClick={this.handleSubmit} >비밀번호 찾기</div>
				<div className="auth-message"> { message } </div>
				<input type="submit" hidden />
			</form>
		);
	}
}

export default Find;
