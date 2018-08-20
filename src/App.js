import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom'

import Header from './components/Header/Header';
import Body from './components/Body/Body';
//import Footer from './components/Footer/Footer';
import { loggedIn, fetchLogout } from './actions/auth';


class App extends Component {
	constructor(props){
		super(props);
	}
	componentDidMount(){
		const { loggedIn } = this.props;
		loggedIn({ test : "test" })
	}
	componentWillReceiveProps(nextProps){
		//console.log(socket,nextProps);
		if( !this.props.socket && nextProps.socket ){
			/*
			nextProps.socket.on( 'say', (data) => {
			});
			*/
		}
	}
	render() {
		const { fetchLogout, user } = this.props;
		return (
			<Router>
				<div>
					<Header fetchLogout={ fetchLogout } user={ user } />
					<Body user={ user } />
				</div>
			</Router>
		);
	}
};

const stateToProps = ({user,socket}) => ({user,socket});

const actionToProps = {
	fetchLogout,
	loggedIn : loggedIn.REQUEST,
}
export default connect(stateToProps,actionToProps)(App);

