import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom'

import Header from './components/Header/Header';
import Body from './components/Body/Body';
//import Footer from './components/Footer/Footer';
import { fetchLoggedIn, fetchLogout } from './actions/auth';
import { fetchConnectSocket } from './actions/socket';

class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			init : false
		}
	}
	componentDidMount(){
		const { fetchLoggedIn, fetchConnectSocket } = this.props;
		fetchLoggedIn()
		.then( (action) => {
			if( !action.error ){
				fetchConnectSocket();
			}
			this.setState({
				init : true
			})
		})
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
		const { init } = this.state;
		return (
			<Router>
				<div>
					<Header fetchLogout={ fetchLogout } user={ user } />
					{ init ?
						<Body user={ user } />
						: <div></div>
					}
				</div>
			</Router>
		);
	}
};

const stateToProps = ({user,socket}) => ({user,socket});

const actionToProps = {
	fetchLogout,
	fetchLoggedIn,
	fetchConnectSocket
}
export default connect(stateToProps,actionToProps)(App);

