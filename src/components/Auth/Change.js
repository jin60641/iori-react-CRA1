import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Change extends Component {
	constructor(props){
		super(props);
		this.state = {
			message : ' '
		}
	}
	handleChangePw = data => {
		const { fetchChangePw, user } = this.props;
		const { email, link } = this.props.params.match;
		fetchChangePw({ ...data, email, link })
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
	}
	handleSubmit = e => {
		e.preventDefault();
		const password = this.refs.password.value;
		const passwordCheck = this.refs.passwordCheck.value;
		if( password.length === 0 ){
			this.setState({
				message : "비밀번호를 입력해 주세요."
			});
		} else if( passwordCheck !== password ){
			this.setState({
				message : "비밀번호 확인이 일치하지 않습니다."
			});
		} else {
			this.handleChangePw({password});
		}
	}

	render(){ 
		const { cx } = this.props;
		const { message } = this.state;
		return (
			<form className="auth-form" onSubmit={this.handleSubmit} >
				<label className="auth-label" htmlFor="password">새 비밀번호</label>
				<input ref="password" type="password" className="auth-input" placeholder="" />
				<label className="auth-label" htmlFor="passwordCheck">새 비밀번호 확인</label>
				<input ref="passwordCheck" type="password" className="auth-input" placeholder="" />
				<div className="auth-btn" onClick={this.handleSubmit} >비밀번호 변경</div>
				<div className="auth-message"> { message } </div>
				<input type="submit" hidden />
			</form>
		);
	}
}

export default Change;
