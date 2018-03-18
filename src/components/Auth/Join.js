import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Join extends Component {
	constructor(props){
		super(props);
		this.state = {
			message : ' '
		}
	}
	handleJoin = (data) => {
		const { fetchJoin } = this.props;
		console.log(fetchJoin);
		fetchJoin(data)
			.then( (action) => {
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
	handleSubmit = (e) => {
		e.preventDefault();
		const email = this.refs.email.value;
		const password = this.refs.password.value;
		const passwordCheck = this.refs.passwordCheck.value;
		const handle = this.refs.handle.value;
		const name = this.refs.name.value;
		if( email.length === 0 ){
			this.setState({
				message : "이메일을 입력해 주세요."
			});
		} else if( email.match(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/g ) === undefined ){
			this.setState({
				message : "유효하지 않은 이메일입니다."
			});
		} else if( handle.length === 0 ){
			this.setState({
				message : "핸들을 입력해 주세요."
			});
		} else if( name.length === 0 ){
			this.setState({
				message : "이름을 입력해 주세요."
			});
		} else if( password.length === 0 ){
			this.setState({
				message : "비밀번호를 입력해 주세요."
			});
		} else if( passwordCheck !== password ){
			this.setState({
				message : "비밀번호 확인이 일치하지 않습니다."
			});
		} else {
			this.handleJoin({email,password,name,handle});
		}
	}

	render(){ 
		const { cx } = this.props;
		const { message } = this.state;
		return (
			<form className="auth-form" onSubmit={this.handleSubmit} >
				<label className="auth-label" htmlFor="email">이메일</label>
				<input ref="email" type="text" className="auth-input" placeholder="" />
				<label className="auth-label" htmlFor="name">이름</label>
				<input ref="name" type="text" className="auth-input" placeholder="" /> 
				<label className="auth-label" htmlFor="handle">핸들</label>
				<input ref="handle" type="text" className="auth-input" placeholder="" /> 
				<label className="auth-label" htmlFor="password">비밀번호</label>
				<input ref="password" type="password" className="auth-input" placeholder="" /> 
				<label className="auth-label" htmlFor="passwordCheck">비밀번호 확인</label>
				<input ref="passwordCheck" type="password" className="auth-input" placeholder="" /> 
				<div className="auth-btn" onClick={this.handleSubmit} >회원가입</div>
				<div className="auth-message"> { message } </div>
				<input type="submit" hidden />
			</form>
		);
	}
}

export default Join;
