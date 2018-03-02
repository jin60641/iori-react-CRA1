import React, { Component } from 'react';
import './Chat.css';

class Chat extends Component {
	constructor(props){
		super(props);
		this.state = {
			menu : false,
			layer : false
		}
	}
	handleClickMenu = (bool) => {
		this.setState({
			menu : bool
		});
	}
	handleClickNew = (type) => {
		this.showChatLayer(true);
	}
	showChatLayer = (bool) => {
		this.setState({
			layer : bool
		});
	}
	render(){
		const { cx } = this.props;
		return(
			<div className="Chat">
				<div className="chat-header">
					<div className={cx("chat-menu","chat-header-div")} onClick={this.handleClickMenu}>
						<div className="chat-menu-text">
							새 메시지
						</div>
						<div className="chat-menu-box">
							<div className={cx("chat-menu-box-div","chat-new-user")} onClick={()=>this.handleClickNew("user")}>
								1:1 시작하기
							</div>
							<div className={cx("chat-menu-box-div","chat-new-group")} onClick={()=>this.handleClickNew("group")}>
								그룹생성
							</div>
						</div>
					</div>
					<div className={cx("chat-title","chat-header-div")}>
						title<span className="chat-title-span">span</span>
					</div>
				</div>
				<div className="chat-dialog">
					<div className={cx("chat-dialogs","chat-dialog-search")}>
						<input type="text" className="chat-search" placeholder="search" />
					</div>
					<div className="chat-dialog-box">
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
					</div>
				</div>
			</div>
		);
	}
}

export default Chat;
