import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login, fetchJoin, fetchFindPw, fetchChangePw } from '../../actions/auth';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import Login from './Login';
import Join from './Join';
import Find from './Find';
import Change from './Change';
import styles from './Auth.css';
import classNames from 'classnames/bind'
const cx = classNames.bind(styles);


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
	pushState = url => {
		const { history, showScroll } = this.props;
		showScroll(true);
		history.push(url);
	}
	render(){
		const { login, fetchJoin, pushState } = this.props;
		const { path } = this.props.match;
		return(
			<div className="Auth">
				<div className="auth-helper"></div>
				<Route path={`${path}/login`} render={(props) => (
					<Login {...props}
						login={login}
						pushState={ this.pushState }
					/>
				)}/>
				<Route path={`${path}/join`} render={(props) => (
					<Join {...props}
						fetchJoin={fetchJoin}
					/>
				)}/>
				<Route path={`${path}/find`} render={(props) => (
					<Find {...props}
						fetchFindPw={fetchFindPw}
					/>
				)}/>
				<Route path={`${path}/change/:email?/:link?`} render={(props) => (
					<Change {...props}
						fetchChangePw={fetchChangePw}
					/>
				)}/>
			</div>
		);
	}
}

const actionToProps = {
	login : login.REQUEST,
	fetchJoin,
	fetchFindPw,
};

export default connect(undefined, actionToProps)(withRouter(Auth));
