import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchLogin, fetchJoin } from '../../actions/auth';
import { fetchConnectSocket } from '../../actions/socket';
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
		const { page, fetchLogin, fetchJoin, fetchConnectSocket, pushState } = this.props;
		switch(page){
			case "login":
				return(<Login fetchLogin={fetchLogin} pushState={ pushState } fetchConnectSocket={fetchConnectSocket} />);
			case "join":
				return(<Join fetchJoin={fetchJoin} />);
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
	pushState = (url) => {
		const { history, showScroll } = this.props;
		showScroll(true);
		history.push(url);
	}
	render(){
		const page = this.props.match.params.page;
		const { fetchLogin, fetchJoin, fetchConnectSocket } = this.props;
		return(
			<div className="Auth">
				<div className="auth-helper"></div>
				<Switch page={ page } fetchLogin={ fetchLogin } fetchJoin={ fetchJoin } fetchConnectSocket={ fetchConnectSocket } pushState={ this.pushState } />
			</div>
		);
	}
}

const actionToProps = {
	fetchLogin,
	fetchJoin,
	fetchConnectSocket
};

export default connect(undefined, actionToProps)(Auth);
