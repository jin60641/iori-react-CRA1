import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Message from './Message';

import styles from './Panel.css';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);


class Panel extends Component {
	constructor(props){
		super(props);
		this.state = {
			loading : false,
			isBottom : true,
			timer : null,
			isTop : false
		}
		this.handleScroll = this.handleScroll.bind(this);
	}
	componentDidMount(){
		ReactDOM.findDOMNode(this.refs.Panel).addEventListener('scroll',this.handleScroll);
	}
	componentWillUnmount(){
		const { timer } = this.state;
		this.setState({
			loading : false,
			timer : clearInterval(timer)
		});
		ReactDOM.findDOMNode(this.refs.Panel).removeEventListener('scroll',this.handleScroll);
	}
	handleScroll(e){
		const { loading } = this.state;
		const dom = e.target;
		if( loading ){
			e.preventDefault();
			return false;
		}
		console.log(dom.scrollTop);
		if( dom.scrollTop < 80 ){
			e.preventDefault();
			this.setState({
				loading : true
			});
			const { handleScrollTop } = this.props;
			handleScrollTop();
			return false;
		}
		this.setState({
			isBottom : dom.scrollHeight - dom.scrollTop === dom.clientHeight,
		});
	}
   componentDidUpdate = (nextProps,nextState) => {
		const dom = ReactDOM.findDOMNode(this.refs.Panel);
		const { chats, to } = this.props;
		const { timer } = this.state;
		if( to.handle
			&&
			(
				(
					to.handle === nextProps.to.handle
					&& chats[to.handle]
					&& nextProps.chats[to.handle]
					&& ( chats[to.handle].length != nextProps.chats[to.handle].length )
				)
			||
				(
					to.handle !== nextProps.to.handle
				)
			)
		){
			this.setState({
				timer : setTimeout( () => {
					const dom = ReactDOM.findDOMNode(this.refs.Panel);
					if( dom.scrollTop < 80 ){
						if( dom.scrollTop === 0 ){
							dom.scrollTop = 80;
						}
						const { handleScrollTop } = this.props;
						handleScrollTop();
					} else {
						this.setState({
							loading : false,
							timer : clearInterval(timer)
						});
					}
				},300)
			});
		}
	}
	handleScrollBottom = () => {
		const { isBottom } = this.state;
		if( isBottom && this.refs.Panel ){
			const dom = ReactDOM.findDOMNode(this.refs.Panel);
			dom.scrollTop = dom.scrollHeight;
		}
	}
	render(){
		const { chats, to, user } = this.props;
		return(
			<div className="Panel" ref="Panel">
			{
				chats[to.handle] ?
					chats[to.handle].map( chat => {
						return(<Message chat={chat} user={user}  key={`chat-message-${chat.id}`}  handleScrollBottom={this.handleScrollBottom} />);
					})
				:
					<div></div>
			}
			</div>
		);
	}
}

export default Panel;
