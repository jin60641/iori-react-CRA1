import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Header from './components/Header/Header';
import Body from './components/Body/Body';
//import Footer from './components/Footer/Footer';
import Auth from './components/Auth/Auth';
import { fetchLogin, fetchLoggedIn, fetchLogout, fetchJoin } from './actions/auth';
import { fetchConnectSocket } from './actions/socket';

class Wrap extends Component {
	constructor(props){
		super(props);
	}
	componentWillReceiveProps(nextProps){
		const { socket } = this.props;
		console.log(socket,nextProps);
		if( !this.props.socket && nextProps.socket ){
			nextProps.socket.on( 'say', (stream) => {
				console.log(stream);
			});
		}
	}
	render(){
		const { fetchLogout, user, socket } = this.props;
		return (
			<div>
				<Header fetchLogout={ fetchLogout } user={ user } />
				<Body user={ user } />
			</div>
		);
	}
}

class App extends Component {
	constructor(props){
		super(props);
	}
	componentWillMount(){
		const { fetchLoggedIn, fetchConnectSocket } = this.props;
		fetchLoggedIn();
		fetchConnectSocket();
	}
	render() {
		const { fetchJoin, fetchLogin, fetchLogout, fetchLoggedIn, user, socket } = this.props;
		return (
			<Router>
				<Switch>
					<Route path="/auth/:page" render={(props) => (
						<Auth {...props} 
							fetchLogin={ fetchLogin } 
							fetchJoin={ fetchJoin }
						/>
					)}/>
					<Route render={(props) => ( 
						<Wrap {...props} fetchLogout={ fetchLogout } user={ user } socket={socket} />
					)}/>
				</Switch>
			</Router>
		);
	}
};

const stateToProps = ({user,socket}) => ({user,socket});

const actionToProps = {
	fetchLogin,
	fetchLogout,
	fetchLoggedIn,
	fetchJoin,
	fetchConnectSocket
}
export default connect(stateToProps,actionToProps)(App);

