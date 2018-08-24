import React, { Component } from 'react';
import styles from './Message.css';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class Message extends Component {
	componentDidMount = () => {
		const { handleMessageMount } = this.props;
    setTimeout( handleMessageMount, 0 );
	}
	render(){
		const { user, chat } = this.props;
		const my = user.id === chat.from.id;
		return(
			<div className={cx("Message",{"Message-my":my})}>
				{ /*
					my ?
						null
						: <a className="message-profileimg" href={`/profile${chat.from.handle}`}></a>
				*/ }
				<div className="message-body">
					<div className="message-body-name">
						{ chat.from.name }
					</div>
					{
						chat.file ?
							<img className="message-body-file" src={`/files/chat/${chat.id}.png`} alt="file in chat" />
						:
							<div>
								<div className="message-body-caret">
									<div className="message-body-caret-outer" />
									<div className="message-body-caret-inner" />
								</div>
								<div className="message-body-text">
									{ chat.text.split('\n').map( (text,i) => <span key={`chat-${chat.id}-text-${i}`}>{text}<br /></span> ) }
								</div>
							</div>
					}
				</div>
				{/* 
					my ?
						<span className="message-profileimg"></span>
						: null
				*/}
			</div>
		);
	}
}
export default Message;
