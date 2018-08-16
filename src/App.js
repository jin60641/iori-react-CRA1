import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom'

import Header from './components/Header/Header';
import Body from './components/Body/Body';
//import Footer from './components/Footer/Footer';
import { loggedIn, fetchLogout } from './actions/auth';
import { connectSocket } from './actions/socket';


class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			init : false
		}
	}
	componentDidMount(){
		const { loggedIn, connectSocket } = this.props;
		loggedIn({ test : "test" },
	  (action) => {
			if( !action.error ){
			}
			this.setState({
				init : true
			})
		});
		this.setState({
			init : true
		})
		connectSocket();
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
						: null
					}
				</div>
			</Router>
		);
	}
};

const stateToProps = ({user,socket}) => ({user,socket});

const actionToProps = {
	fetchLogout,
	loggedIn : loggedIn.REQUEST,
	connectSocket : connectSocket.REQUEST
}
export default connect(stateToProps,actionToProps)(App);

