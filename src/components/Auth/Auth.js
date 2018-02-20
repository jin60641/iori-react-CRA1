import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchLogin, fetchJoin } from '../../actions/auth';
import Login from './Login';
import Join from './Join';
import styles from './Auth.css';
import classNames from 'classnames/bind'
const cx = classNames.bind(styles);

class Switch extends Component {
	constructor(props){
		super(props);
	}
	render(){
		const { page, fetchLogin, fetchJoin, history } = this.props;
		switch(page){
			case "login":
				return(<Login fetchLogin={fetchLogin} cx={cx} history={history}/>);
			case "join":
				return(<Join fetchJoin={fetchJoin} cx={cx}/>);
		}
	}
}
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
	render(){
		const page = this.props.match.params.page;
		return(
			<div className="Auth">
				<div className="auth-helper"></div>
				<Switch page={ page } />
			</div>
		);
	}
}

const actionToProps = {
	fetchLogin,
	fetchJoin
};

connect(undefined, actionToProps)(Switch);
export default Auth;
