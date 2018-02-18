import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			alert : " "
		}
	}
	componentWillMount() {
	}
	handleLogin = (email, password) => {
		const { fetchLogin, history } = this.props;
		fetchLogin({email,password})
			.then( (action) => {
				if(!action.error) {
					history.push('/');
				} else {
					this.setState({
						alert : action.payload.message
					});
				}
			});
	}
	handleSubmit = (e) => {
		e.preventDefault();

		const email = this.refs.email.value;
		const password = this.refs.password.value;
		if( email.length == 0 ){
			this.setState({
				alert : "이메일을 입력해 주세요."
			});
		} else if( email.match(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/g ) == undefined ){
			this.setState({
				alert : "유효하지 않은 이메일입니다."
			});
		} else if( password.length == 0 ){
			this.setState({
				alert : "비밀번호를 입력해 주세요."
			});
		} else {
			this.handleLogin(email, password);
		}
	}
	componentWillUnmount() {
	}
	render(){
		const { cx } = this.props;
		return (
			<div className="Login">
				<div className="login-helper"></div>
				<form className="login-form" onSubmit={this.handleSubmit} >
					<label className="login-label" htmlFor="email">이메일</label>
					<input ref="email" type="text" className="login-input" placeholder="" />
					<label className="login-label" htmlFor="password">비밀번호</label>
					<input ref="password" type="password" className="login-input" placeholder="" />
					<div className={ cx('login-btn','login-local') } onClick={this.handleSubmit} >로그인</div>
					<div className="login-alert"> { this.state.alert } </div>
					<div className={ cx('login-btn','login-facebook') }>
						<img className={ cx('login-btn-img', 'login-facebook-img') } src="/images/ic_facebook.png" />페이스북으로 로그인
					</div>
					<div className={ cx('login-btn','login-twitter') }>
						<img className={ cx('login-btn-img', 'login-twitter-img') } src="/images/ic_twitter.png" />트위터로 로그인
					</div>
					<div className="login-text">비밀번호를 잊으셨나요? <Link className="login-text-link" to="/findpw">비밀번호 찾기</Link></div>
					<div className="login-text">아직 회원이 아니신가요? <Link className="login-text-link" to="/auth/join">회원가입</Link></div>
					<input type="submit" hidden />
				</form>
			</div>
		);
	}
}
export default Login
