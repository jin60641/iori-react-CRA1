import React, { Component } from 'react';

class Dialog extends Component {
	constructor(props){
		super(props);
	}
	render(){
		return(
			<div className="chat-dialogs">
				<div className="chat-dialogs-time">
					time
				</div>
				<img className="chat-dialogs-img" src="/images/profile.png" />
				<div className="chat-dialogs-message-wrap">
					<div className="chat-dialogs-name">
						name
					</div>
					<div className="chat-dialogs-message-span">
						나 : 123
					</div>
				</div>
			</div>
		);
	}
}

export default Dialog;
