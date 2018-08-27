import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import styles from './Body.css';

import Newsfeed from '../Newsfeed/Newsfeed';
import Post from '../Newsfeed/Post';
import Error from '../Error/Error';
import Slider from '../Slider/Slider';
import Mail from '../Mail/Mail';
import Auth from '../Auth/Auth';
import Chat from '../Chat/Chat';
import Left from '../Left/Left';
import Profile from '../Profile/Profile';
import Notice from '../Notice/Notice';
import Setting from '../Setting/Setting';
import Search from '../Search/Search';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

@withRouter
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
		this.Body.addEventListener('scroll',this.handleScroll);
	}
	componentWillUnmount(){
		this.Body.removeEventListener('scroll',this.handleScroll);
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
		this.Body.scrollTop = 0;
		this.setState({
			isTop : true
		})
	}
	render(){
		const { isTop, isBottom, scrollBar } = this.state;
		return(
			<div className={cx('Body',{ 'body-scroll' : scrollBar })} ref={ dom => { this.Body=dom } } >
				<Switch>
					<Route path="/search/:tab?/:query?" render={(props) => (
            <Search {...props }
              isBottom = { isBottom }
            />
          )}/>
					<Route path="/@:handle/:tab?" render={(props) => (
							<Profile {...props }
								isTop = { isTop }
								isBottom = { isBottom }
								showScroll = { this.showScroll }
								scrollToTop = { this.scrollToTop }
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
					<Route path="/auth" render={(props) => (
						<Auth {...props} 
							showScroll = { this.showScroll }
						/>
					)}/>
					<Route path="/notice/:type?" render={(props) => (
						this.isLoggedIn() ? 
						  <Notice {...props} 
							  isBottom={ isBottom }
                url='/notice'
						  />
						: <Redirect to="/auth/login/notice" />
					)}/>
					<Route path="/post/:id" render={(props) => (
            <Post {...props}
            />
          )} />
					<Route path="/setting/:tab?" render={(props) => (
            <Setting {...props}
            />
          )} />
					<Route exact path="/" render={(props) => (
						this.isLoggedIn() ? 
							<div className="body-wrap"> 
								<Left {...props} />
								<Newsfeed {...props}
									key="Home"
                  id="Home"
									write={true}
									isBottom={ isBottom }
									options={ {} }
								/> 
							</div>
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

export default Body;
