import React, { Component } from 'react';
import Message from './Message';

import styles from './Panel.css';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class Panel extends Component {
	constructor(props){
		super(props);
		this.state = {
			isBottom : true,
		}
		this.handleScroll = this.handleScroll.bind(this);
	}
	componentDidMount(){
		this.Panel.addEventListener('scroll',this.handleScroll);
	}
	componentWillUnmount(){
		this.Panel.removeEventListener('scroll',this.handleScroll);
	}
	handleScroll(e){
		const { loading } = this.props;
		const dom = e.target;
		if( loading ){
			e.preventDefault();
			return false;
		}
		if( dom.scrollTop < Math.max(150,dom.scrollHeight/8) ){
			e.preventDefault();
			const { handleScrollTop } = this.props;
			handleScrollTop();
			return false;
		}
		this.setState({
      scrollTop : dom.scrollHeight - dom.scrollTop,
			isBottom : dom.scrollHeight - dom.scrollTop === dom.clientHeight,
		});
	}
  componentDidUpdate = (nextProps,nextState) => {
		const { chats, to, handle } = this.props;
		if( to.handle
			&&
			(
				(
					to.handle === nextProps.to.handle
					&& chats[handle]
					&& nextProps.chats[handle]
					&& ( chats[handle].length !== nextProps.chats[handle].length )
				)
			||
				(
					to.handle !== nextProps.to.handle
				)
			)
	  ){
			const dom = this.Panel;
			if( dom.scrollTop < 150 ){
        if( dom.scrollTop === 0 ){
          dom.scrollTop = 180;
        }
				const { handleScrollTop } = this.props;
				handleScrollTop();
			}
		}
	}
  handleMessageMount = () => {
		const { isBottom, scrollTop } = this.state;
    if( isBottom ){
      this.handleScrollBottom();
    }
  }
	handleScrollBottom = () => {
			const dom = this.Panel;
			dom.scrollTop = dom.scrollHeight;
	}
	render(){
		const { chats, user, handle, height } = this.props;
		return(
			<div className={cx("Panel")} ref={ dom => { this.Panel = dom } } style={{ height : `calc(100% - ${height}px)` }}>
			{
				chats[handle] ?
					chats[handle].map( chat => {
						return(<Message chat={chat} user={user}  key={`chat-message-${chat.id}`}  handleMessageMount={this.handleMessageMount} />);
					})
				:
					<div></div>
			}
			</div>
		);
	}
}

export default Panel;
