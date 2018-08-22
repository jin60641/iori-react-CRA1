import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Textarea from 'react-textarea-autosize';

import Dialog from './Dialog';
import Panel from './Panel';
import Layer from './Layer';

import { searchGroupById, searchUserByHandle, searchUsers } from '../../actions/search';
import { sendChat, getChats, getDialogs, makeGroup } from '../../actions/chat';

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
	height : 17
}

const limit = 30;

class Chat extends Component {
	constructor(props){
		super(props);
		this.state = { ...initialState };
	}
	getFullHandle = (type,handle) => {
		return strToChar[type] + handle;
	}
	componentWillUnmount = () => {
		const { showScroll } = this.props;
		showScroll(true);
	}
	componentDidMount = (e) => {
		const { showScroll, searchGroupById, searchUserByHandle, getChats, getDialogs } = this.props;
		showScroll(false);
		const chatHandle = this.props.match.params.handle;
		getDialogs();
		if( chatHandle ){
			const type = charToStr[chatHandle[0]];
			const handle = chatHandle.substr(1);
			const data = {
				"query" : handle
			}
			if( type === "user" ){
				searchUserByHandle(data);
			} else {
				searchGroupById(data);
			}
		}
	}
  componentDidUpdate = (prevProps,prevState) => {
    if( prevProps.searched.user.id !== this.props.searched.user.id ){
				this.openChat(this.props.searched.user,"user");
    } else if( prevProps.searched.group.id !== this.props.searched.group.id ){
				this.openChat(this.props.searched.group,"group");
    }
  }
	getChats = () => {
		const { getChats, isFetching } = this.props;
		const { to : from, type } = this.state;
    const chats = this.props.chats[this.getFullHandle(type,from.handle)];
		if( !isFetching.getChats ){
			const { getChats } = this.props;
			getChats({ from, type, limit, offset : chats?chats.length:0 });
    }
	}
	handleScrollTop = async (callback) => {
		const { to, type } = this.state;
		const chats = this.props.chats[this.getFullHandle(type,to.handle)];
		if( to ){
			await this.getChats();
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
		history.push(`/chat/${this.getFullHandle(type,to.handle)}`);
		this.setState({
			layerSelected : {},
			layer : null,
			type,
			to
		}, () => {
		  if( !chats[this.getFullHandle(type,to.handle)] ){
			  this.getChats();
		  }
    });
	}
	inviteUsers = users => {
		const { layer } = this.state;
		if( layer === "user" ){
			this.openChat(users[0],layer);
		} else if( layer === "group" ){
			const { makeGroup, history } = this.props;
			makeGroup({ userIds : users.map( user => user.id )  })
			//this.openChat(action.payload,layer);
		}
	}
	handleClickOutside = () => {
		this.hideAll();
	}
	hideAll = () => {
		this.showChatMenu(false);
		this.showChatLayer(null);
	}
	sendChat = (file) => {
		const { sendChat } = this.props;
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
		sendChat(formData)
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
		this.setPanelHeight();
	}
	setPanelHeight = () => {
		this.textarea.style.height = "0px";
		const height = Math.max(this.textarea.scrollHeight-12,initialState.height)
		this.setState({
			height
		});
		this.textarea.style.height = height+"px"
	}
	render(){
		const { searchUsers, searched, chats, user, dialogs } = this.props;
		const { to, menu, layer, type, text, height } = this.state;
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
								<Panel chats={chats} to={to} cx={cx} user={user} handleScrollTop={this.handleScrollTop} handle={this.getFullHandle(type,to.handle)} height={height+30}/>
								<div className="send-panel" style={{ height : height+30+"px" }} >
									<div className="send-panel-wrap">
										<textarea ref={ dom => this.textarea = dom } className="send-textarea" value={text} placeholder="메시지를 입력하세요" 
											onChange={ this.handleChangeText } 
											onKeyUp={ this.setPanelHeight } 
											onKeyDown={ this.handleChatKeyDown } 
										/>
										<label className="send-file-label" htmlFor="chat-file" />
										<input className="send-file-input" id="chat-file" type="file" onChange={this.handleChangeFile} multiple/>
										<div className="send-btn" onClick={this.handleClickSend}>
											전송
										</div>
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
					: <Layer user={user} type={layer} showChatLayer={this.showChatLayer} searchUsers={searchUsers} searched={searched} inviteUsers={this.inviteUsers} />
				}
			</div>
		);
	}
}

const stateToProps = ({ dialogs, searched, chats, isFetching }) => ({ dialogs, searched, chats, isFetching })
const actionToProps = {
	searchUserByHandle : searchUserByHandle.REQUEST,
	searchUsers : searchUsers.REQUEST,
	searchGroupById : searchGroupById.REQUEST,
	sendChat : sendChat.REQUEST,
	getChats : getChats.REQUEST,
	getDialogs : getDialogs.REQUEST,
	makeGroup : makeGroup.REQUEST,
};
export default connect(stateToProps, actionToProps)(Chat);
