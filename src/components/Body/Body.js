import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import styles from './Body.css';

import Newsfeed from '../Newsfeed/Newsfeed';
import Error from '../Error/Error';
import Slider from '../Slider/Slider';
import Mail from '../Mail/Mail';
import Auth from '../Auth/Auth';
import Chat from '../Chat/Chat';
import Profile from '../Profile/Profile';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);


class Body extends Component {
	constructor(props){
		super(props);
		this.handleScroll = this.handleScroll.bind(this);
		this.state = {
			isTop : true,
			isBottom : false,
			scrollBar : true
		}
	}
	componentDidMount(){
		ReactDOM.findDOMNode(this.refs.Body).addEventListener('scroll',this.handleScroll);
	}
	componentWillUnmount(){
		ReactDOM.findDOMNode(this.refs.Body).removeEventListener('scroll',this.handleScroll);
	}
	handleScroll(e){
		if( this.state.scrollBar ){
			const dom = e.target;
			this.setState({ 
				isBottom : dom.scrollHeight - dom.scrollTop < dom.clientHeight + 100,
				isTop : 0 === dom.scrollTop
			});
		}
	}
	showScroll = (bool) => {
		this.setState({
			scrollBar : bool===undefined?true:bool
		});
	}
	isLoggedIn = () => {
		const { user } = this.props;
		return user && user.verify;
	}
	scrollToTop = () => {
		this.refs.Body.scrollTop = 0;
		this.setState({
			isTop : true
		})
	}
	render(){
		const { isTop, isBottom, scrollBar } = this.state;
		return(
			<div className={cx('Body',{ 'body-scroll' : scrollBar })} ref="Body" >
				<Switch>
					<Route path="/@:handle" render={(props) => (
						<Profile {...props }
							isTop = { isTop }
							isBottom = { isBottom }
							showScroll = { this.showScroll }
							scrollToTop = { this.scrollToTop }
							isLoggedIn = { this.isLoggedIn }
						/> 
					)}/>
					<Route path="/chat/:handle" render={(props) => (
						this.isLoggedIn() ? 
							<Chat {...props }
								showScroll = { this.showScroll }
							/>
						: <Redirect to="/auth/login/chat" />
					)}/>
					<Route path="/chat" render={(props) => (
						this.isLoggedIn() ? 
							<Chat {...props }
								showScroll = { this.showScroll }
							/>
						: <Redirect to="/auth/login/chat" />
					)}/>
					<Route path="/mail/:email/:link" render={(props) => (
						<Mail {...props}
							showScroll = { this.showScroll }
						/>
					)}/>
					<Route path="/auth/:page" render={(props) => (
						<Auth {...props} 
							showScroll = { this.showScroll }
						/>
					)}/>
					<Route path="/auth" render={(props) => (
						<Auth {...props} 
							showScroll = { this.showScroll }
						/>
					)}/>
					<Route exact path="/" render={(props) => (
						this.isLoggedIn() ? 
							<Newsfeed {...props}
								isBottom = { isBottom }
								options = { {} }
							/> 
						:
							<Slider {...props} 
								showScroll = { this.showScroll }
							/>
					)} />
					<Route path="/error" component={Error}/>
					<Redirect to="/error" />
				</Switch>
			</div>
		);
	}
}

export default withRouter(Body);
