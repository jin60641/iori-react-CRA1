import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchGetPosts, fetchWritePost } from '../../actions/newsfeed';
import ReactDOM from 'react-dom';
import styles from './Body.css';

import Newsfeed from '../Newsfeed/Newsfeed';
import Error from '../Error/Error';
import Slider from '../Slider/Slider';
import Auth from '../Auth/Auth';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);


class Body extends Component {
	constructor(props){
		super(props);
		this.handleScroll = this.handleScroll.bind(this);
		this.state = {
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
			this.setState({ isBottom : dom.scrollHeight - dom.scrollTop < dom.clientHeight + 100 });
		}
	}
	showScroll = (bool) => {
		this.setState({
			scrollBar : bool===undefined?true:bool
		});
		console.log(false);
	}
	isLoggedIn = () => {
		const { user } = this.props;
		return user && user.signUp && user.be;
	}
	render(){
		return(
			<div className={cx('Body',{ 'body-scroll' : this.state.scrollBar })} ref="Body" >
				<Switch>
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
								isBottom = { this.state.isBottom }
								options = { {} }
								posts = { [] }
								fetchGetPosts = { this.props.fetchGetPosts }
								fetchWritePost = { this.props.fetchWritePost }
						/> :
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
const actionToProps = {
	fetchGetPosts,
	fetchWritePost
};

export default withRouter(connect(undefined, actionToProps)(Body));
