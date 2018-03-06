import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import './Chat.css';

import { fetchSearchUser, fetchSearchUsers } from '../../actions/search';
import { fetchSendChat, fetchGetChats, fetchGetDialogs } from '../../actions/chat';

const initialState = {
	menu : false,
	layer : null,
	chats : {},
	layerSelected : {},
	type : null,
	to : null,
	text : "",
	layerQuery : ""
}

const limit = 10;

class Dialog extends Component {
    constructor(props){
        super(props);
    }
    render(){
        const { dialog, cx, user, openChat, active } = this.props;
		const my = user.id === dialog.from.id;
        return(
            <div className={cx("chat-dialogs",{"chat-dialogs-active":active})} onClick={ ()=>{openChat(my?dialog.to:dialog.from,"user")} }>
                <div className="chat-dialogs-time">
                    time
                </div>
                <img className="chat-dialogs-img" src="/images/profile.png" />
                <div className="chat-dialogs-message-wrap">
                    <div className="chat-dialogs-message-name">
                        { my ? dialog.to.name : dialog.from.name }
                    </div>
                    <div className="chat-dialogs-message-text">
                        { my ? `나 : ${dialog.text}`  : dialog.text }
                    </div>
                </div>
            </div>
        );
    }
}

class Panel extends Component {
	constructor(props){
		super(props);
		this.state = {
			isBottom : true,
			timer : null
		}
		this.handleScroll = this.handleScroll.bind(this);
	}
	componentDidMount(){
		ReactDOM.findDOMNode(this.refs.Panel).addEventListener('scroll',this.handleScroll);
	}
	componentWillUnmount(){
		ReactDOM.findDOMNode(this.refs.Panel).removeEventListener('scroll',this.handleScroll);
	}
	handleScroll(e){
		const dom = e.target;
		this.setState({ isBottom : dom.scrollHeight - dom.scrollTop === dom.clientHeight });
	}
	handleScrollBottom = () => {
		const { isBottom } = this.state;
		const dom = ReactDOM.findDOMNode(this.refs.Panel);
		dom.scrollTop = dom.scrollHeight;
	}
	render(){
		const { chats, to, user, cx } = this.props;
		return(
			<div className="chat-panel" ref="Panel">
			{ 
				chats[to.handle] ? 
					chats[to.handle].map( chat => {
						return(<Message chat={chat} user={user} cx={cx} key={`chat-message-${chat.id}`}  handleScrollBottom={this.handleScrollBottom} />);
					})
				:
					<div></div>
			}
			</div>
		);
	}
}

class Message extends Component {
	constructor(props){
		super(props);
	}
	componentDidUpdate = () => {
		const { handleScrollBottom } = this.props;
		handleScrollBottom();
	}
	componentDidMount = () => {
		const { handleScrollBottom } = this.props;
		handleScrollBottom();
	}
	render(){
		const { user, chat, cx } = this.props;
		const my = user.id === chat.from.id;
		return(
			<div className={cx("chat-message",{"chat-message-my":my})}>
				{ /*
					my ?
						null
						: <a className="chat-message-profileimg" href={`/profile${chat.from.handle}`}></a>
				*/ }
				<div className="chat-message-body">
					<div className="chat-message-body-name">
						{ chat.to.name }
					</div>
					{ 
						chat.file ?
							<img className="chat-message-body-file" src={`/files/chat/${chat.id}.png`} />
						:
							<div>
								<div className="chat-message-body-caret">
									<div className="chat-message-body-caret-outer" />
									<div className="chat-message-body-caret-inner" />
								</div>
								<div className="chat-message-body-text">
									{ chat.text }
								</div>
							</div>
					}
				</div>
				{/* 
					my ?
						<span className="chat-message-profileimg"></span>
						: null
				*/}
			</div>
		);
	}
}


class Chat extends Component {
	constructor(props){
		super(props);
		this.state = Object.assign({},initialState);
	}
	componentWillMount = (e) => {
		const chatHandle = this.props.match.params.handle;
		const { fetchSearchUser, fetchGetChats, fetchGetDialogs } = this.props;
		fetchGetDialogs()
		.then( action => {
		});
		if( chatHandle ){
			const type = chatHandle[0]==='@'?'user':(chatHandle[0]==='g'?'group':null);;
			const handle = chatHandle.substr(1);
			fetchSearchUser({ query : handle })
			.then( action => {
				if( !action.error ){
					this.openChat(action.payload,type);
				}
			});
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
			layer : type,
			layerSelected : {},
			layerQuery : ""
		});
		const data = { query : "" };
		const { fetchSearchUsers } = this.props;
		fetchSearchUsers(data)
		.then( () => {});
	}
	openChat = (to,type) => {
		const { history, fetchGetChats } = this.props;
		history.push(`/chat/@${to.handle}`);
		this.setState({
			layerSelected : {},
			layer : null,
			type,
			to
		});
		fetchGetChats({ to, type : "user", limit })
		.then( action => {
		});
	}
	handleClickInvite = () => {
		const { layer, layerSelected } = this.state;
		const selected = Object.keys(layerSelected);
		if( !selected.length ){
			return false;
		}
		if( layer === "user" ){
			const to = layerSelected[selected[0]];
			this.openChat(to,layer);
		} else if( layer === "group" ){
		}
	} 
	handleLayerSelect = (user) => {
		const prev = this.state.layerSelected;
		let layerSelected = {};
		if( this.state.type === "user" ){
			layerSelected[user.id] = user;
		} else {
			layerSelected = Object.assign({},prev);
			if( prev[user.id] ){
				delete layerSelected[user.id];
			} else {
				layerSelected[user.id] = user;
			}
		}
		this.setState({layerSelected});
	}
	handleLayerSearch = (e) => {
		const { fetchSearchUsers } = this.props;
		const query = e.target.value
		this.setState({
			layerQuery : query
		})
		if( !query.length ){
			return null;
		}
		const data = { query };
		fetchSearchUsers(data)
		.then( (action) => {
			if( !action.error ){
			} else {
			}
		});
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
		if( e.keyCode == 13 && !e.shiftKey){
			this.handleClickSend();
			e.preventDefault();
		}
	}
	render(){
		const { cx, searched, chats, user, dialogs } = this.props;
		const { to, menu, layer, layerSelected, layerQuery, type, text } = this.state;
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
						<div className={cx("chat-title","chat-header-div")}>
							{ to?to.name:"" }<span className="chat-title-span"></span>
						</div>
					</div>
					<div className="chat-dialog">
						<div className={cx("chat-dialogs","chat-dialog-search")}>
							<input type="text" className="chat-search" placeholder="검색" />
						</div>
						<div className="chat-dialog-box">
							{ Object.keys(dialogs).map( key => {
								return(<Dialog cx={cx} user={user} active={to.id===parseInt(key)} dialog={dialogs[key]} key={`dialog-${key}`} openChat={this.openChat} />);
							})}
						</div>
					</div>
					{ 
						type ? 
							<div className="chat-box">
								<Panel chats={chats} to={to} cx={cx} user={user} />
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
				<div className={cx("chat-layer",{"chat-layer-active":layer})} onClick={()=>this.showChatLayer(null)} >
					<div className="chat-layer-close"></div>
					<div className="chat-layer-box" onClick={(e)=>e.stopPropagation()}>
						<div className="chat-layer-box-close" onClick={()=>this.showChatLayer(null)}></div>
						<div className="chat-layer-title">Title</div>
						<div className="chat-layer-search-box">
							<input type="text" className="chat-layer-search" placeholder="검색" value={layerQuery} onChange={this.handleLayerSearch} />
						</div>
						<div className={cx("chat-layer-list","chat-layer-div")}>
						{ searched.users.map( (result) => {
							return(
								<div className={cx("chat-dialogs",{"chat-dialogs-active":layerSelected[result.id]})} key={`chat-layer-list-${result.id}`} onClick={()=>this.handleLayerSelect(result)}>
									<img className="chat-dialogs-img" />
									<div className="chat-dialogs-message-wrap">
										<div className="chat-dialogs-message-name">{result.name}</div>
										<div className="chat-dialogs-message-handle">@{result.handle}</div>
									</div>
								</div>
							);
						}) }
						</div>
						<div className="chat-layer-menu">
							<div className={cx("chat-layer-menu-item","chat-layer-menu-active")} onClick={()=>this.showChatLayer(null)} >취소</div>
							<div className={cx("chat-layer-menu-item",{"chat-layer-menu-active":Object.keys(layerSelected).length})} onClick={this.handleClickInvite}>초대</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const stateToProps = ({dialogs,searched,chats,user}) => ({dialogs,searched,chats,user});
const actionToProps = {
	fetchSearchUser,
	fetchSearchUsers,
	fetchSendChat,
	fetchGetChats,
	fetchGetDialogs
};
export default connect(stateToProps, actionToProps)(Chat);
