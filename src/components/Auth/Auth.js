import React, { Component } from 'react';
import Login from './Login';
import Join from './Join';
import styles from './Auth.css';
import classNames from 'classnames/bind'
const cx = classNames.bind(styles);

class Auth extends Component {
	constructor(props){
		super(props);
	}
	render(){
		const { fetchLogin, fetchJoin } = this.props;
		switch(this.props.match.params.page){
			case "login":
				return(<Login fetchLogin={fetchLogin} cx={cx}/>);
			case "join":
				return(<Join fetchJoin={fetchJoin} cx={cx}/>);
		}
	}
}

export default Auth;
