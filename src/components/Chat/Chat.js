import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Dialog from './Dialog';
import Panel from './Panel';
import Layer from './Layer';

import { fetchSearchGroup, fetchSearchUserByHandle, fetchSearchUsers } from '../../actions/search';
import { fetchSendChat, fetchGetChats, fetchGetDialogs, fetchMakeGroup } from '../../actions/chat';

import styles from './Chat.css';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const charToStr = {
	'@' : 'user',
	'$' : 'group'
}
const strToChar = {
	'user' : '@',
	'group' : '$',
}

const initialState = {
	menu : false,
	layer : null,
	chats : {},
	type : null,
	to : null,
	text : "",
	loading : false
}

const limit = 10;

class Chat extends Component {
	constructor(props){
		super(props);
		this.state = Object.assign({},initialState);
	}
	getFullHandle = (type,handle) => {
		return strToChar[type] + handle;
	}
	componentWillMount = (e) => {
		const chatHandle = this.props.match.params.handle;
		const { fetchSearchGroup, fetchSearchUserByHandle, fetchGetChats, fetchGetDialogs } = this.props;
		fetchGetDialogs()
		.then( action => {
		});
		if( chatHandle ){
			const type = charToStr[chatHandle[0]];
			const handle = chatHandle.substr(1);
			const data = {
				"query" : handle
			}
			if( type === "user" ){
				fetchSearchUserByHandle(data)
				.then( action => {
					if( !action.error ){
						this.openChat(action.payload,type);
					}
				});
			} else {
				fetchSearchGroup(data)
				.then( action => {
					if( !action.error ){
						this.openChat(action.payload,type);
					}
				});
			}
		}
	}
	getChats = (from,type,offset) => {
		const { loading } = this.state;
		if( loading === false ){
			this.setState({loading : true });
			const { fetchGetChats } = this.props;
			fetchGetChats({ from, type, limit, offset })
			.then( action => {
				this.setState({loading : false });
			});
		}
	}
	handleScrollTop = async (callback) => {
		const { to, type } = this.state;
		const chats = this.props.chats[this.getFullHandle(type,to.handle)];
		if( to ){
			await this.getChats(to,type,chats?chats.length:0);
		}
		if( callback ){
			callback();
		}
	}
	handleClickMenu = (e) => {
		e.stopPropagation();
		this.showChatMenu(true);
	}
	showChatMenu = (bool) => {
		this.setState({
			menu : bool
		});
	}
	handleClickNew = (e,type) => {
		e.stopPropagation();
		this.showChatMenu(false);
		this.showChatLayer(type);
	}
	showChatLayer = (type) => {
		this.setState({
			layer : type
		});
	}
	openChat = (to,type) => {
		const { history, chats } = this.props;
		console.log(to);
		history.push(`/chat/${this.getFullHandle(type,to.handle)}`);
		this.setState({
			layerSelected : {},
			layer : null,
			type,
			to
		});
		if( !chats[this.getFullHandle(type,to.handle)] ){
			this.getChats(to,type);
		}
	}
	inviteUsers = users => {
		const { layer } = this.state;
		if( layer === "user" ){
			this.openChat(users[0],layer);
		} else if( layer === "group" ){
			const { fetchMakeGroup, history } = this.props;
			fetchMakeGroup({ userIds : users.map( user => user.id )  })
			.then( action => {
				if( !action.error ){
					this.openChat(action.payload,layer);
				}
			});
		}
	}
	componentWillUnmount = () => {
		const { showScroll } = this.props;
		showScroll(true);
	}
	componentDidMount = () => {
		const { showScroll } = this.props;
		showScroll(false);
	}
	handleClickOutside = () => {
		this.hideAll();
	}
	hideAll = () => {
		this.showChatMenu(false);
		this.showChatLayer(null);
	}
	sendChat = (file) => {
		const { fetchSendChat } = this.props;
		const { text, to, type } = this.state;
		let formData = new FormData();
		formData.append("to",to.id);
		formData.append("type",type);
		if( !file ){
			formData.append("text",text);
			this.setState({
				text : ""
			});
		} else {
			formData.append("text","");
			formData.append("file",file);
		}
		fetchSendChat(formData)
		.then( (action) => {
			if( !action.error ){
			} else {
			}
		})
	}
	handleClickSend = () => {
		const { text } = this.state;
		if( !text.length ){
			return 0;
		}
		this.sendChat();
	}
	handleChangeFile = (e) => {
		e.preventDefault();
		const { files } = e.target;
		Array.from(files).forEach( file => {
			this.sendChat(file);
		});
		e.target.value = "";
	}
	handleChangeText = e => {
		this.setState({
			text : e.target.value
		})
	}
	handleChatKeyDown = e => {
		if( e.keyCode === 13 && !e.shiftKey){
			this.handleClickSend();
			e.preventDefault();
		}
	}
	render(){
		const { fetchSearchUsers, searched, chats, user, dialogs } = this.props;
		const { to, menu, layer, type, text } = this.state;
		return(
			<div className="Chat">
				<div className="chat-wrap" onClick={this.handleClickOutside} >
					<div className="chat-header">
						<div className={cx("chat-menu","chat-header-div")} onClick={this.handleClickMenu}>
							<div className="chat-menu-text">
								새 메시지
							</div>
							<div className={cx("chat-menu-box",{"chat-menu-box-active":menu})}>
								<div className={cx("chat-menu-box-div","chat-new-user")} onClick={(e)=>{this.handleClickNew(e,"user")}}>
									1:1 시작하기
								</div>
								<div className={cx("chat-menu-box-div","chat-new-group")} onClick={(e)=>{this.handleClickNew(e,"group")}}>
									그룹생성
								</div>
							</div>
						</div>
						{ type === "user" ?
							<Link to={`/@${to.handle}`}className={cx("chat-title","chat-header-div")}>
								{ to.name }<span className="chat-title-span"></span>
							</Link>
							: <div className={cx("chat-title","chat-header-div")}>
								{ to?to.name:"" }<span className="chat-title-span"></span>
							</div>
						}
					</div>
					<div className="chat-dialog">
						<div className={cx("Dialog","chat-dialog-search")}>
							<input type="text" className="chat-search" placeholder="검색" />
						</div>
						<div className="chat-dialog-box">
							{ dialogs.map( dialog => {
								return(<Dialog cx={cx} user={user} active={to?(this.getFullHandle(dialog.type,to.handle)===dialog.handle):false} dialog={dialog} key={`dialog-${dialog.id}`} openChat={this.openChat} />);
							})}
						</div>
					</div>
					{ 
						type ? 
							<div className="chat-box">
								<Panel chats={chats} to={to} cx={cx} user={user} handleScrollTop={this.handleScrollTop} handle={this.getFullHandle(type,to.handle)}/>
								<div className="send-panel">
									<textarea className="send-textarea" value={text} placeholder="메시지를 입력하세요" 
										onChange={ this.handleChangeText } 
										onKeyDown={ this.handleChatKeyDown } >
									</textarea> 
									<label className="send-file-label" htmlFor="chat-file" />
									<input className="send-file-input" id="chat-file" type="file" onChange={this.handleChangeFile} multiple/>
									<div className="send-btn" onClick={this.handleClickSend}>
										전송
									</div>
								</div>
							</div>
						: 
							<div className={cx("chat-box","chat-box-default")}>
								새 메시지나 검색을 통해 대화를 시작해보세요
							</div>
					}
				</div>
				{ layer === null ? 
					<div /> 
					: <Layer user={user} type={layer} showChatLayer={this.showChatLayer} fetchSearchUsers={fetchSearchUsers} searched={searched} inviteUsers={this.inviteUsers} />
				}
			</div>
		);
	}
}

const stateToProps = ({dialogs,searched,chats}) => ({dialogs,searched,chats});
const actionToProps = {
	fetchSearchUserByHandle,
	fetchSearchUsers,
	fetchSearchGroup,
	fetchSendChat,
	fetchGetChats,
	fetchGetDialogs,
	fetchMakeGroup
};
export default connect(stateToProps, actionToProps)(Chat);
