import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Chat.css';

import Dialog from './Dialog.js';

import { fetchSearchUser, fetchSearchUsers } from '../../actions/search';

const initialState = {
	menu : false,
	layer : null,
	dialogs : [],
	chats : {},
	layerSelected : {},
	type : null,
	panel : null
}

class Chat extends Component {
	constructor(props){
		super(props);
		this.state = Object.assign({},initialState);
	}
	componentWillMount = (e) => {
		const chatHandle = this.props.match.params.handle;
		if( chatHandle ){
			const type = chatHandle[0]==='@'?'user':(chatHandle[0]==='g'?'group':null);;
			const handle = chatHandle.substr(1);
			const { fetchSearchUser } = this.props;
			fetchSearchUser({ query : handle })
			.then( (action) => {
				if( !action.error ){
					this.setState( Object.assign(this.state,{
						type,
						panel : action.payload
					}) );
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
			layerSelected : {}
		});
	}
	handleClickInvite = () => {
		const { history } = this.props;
		const { layer, layerSelected } = this.state;
		if( layer === "user" ){
			const to = layerSelected[Object.keys(layerSelected)[0]];
			history.push(`/chat/@${to.handle}`);
			this.setState({
				layerSelected : {},
				layer : null,
				type : "user",
				panel : to
			});
		} else if( layer === "group" ){
			this.setState({
				layerSelected : {},
				layer : null,
				type : "group",
				panel : ""
			});
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
	componentWillReceiveProps = (nextProps) => {
		const { cookies, chats } = this.props;
		const { dialogs } = this.state;
		if( !cookies && nextProps.cookies ){
			const string = cookies.get('dialogs');
			const dialogs = (string&&string.length)?JSON.parse(string):[];
    		this.setState({
				dialogs,
				chats : dialogs.reduce( (result,item,index,array) => { result[item] = []; return result;  })
			});
		}
		if( nextProps.chats && nextProps.chats.length && ( !chats.length || chats[0].id != nextProps.chats[0].id  ) ){
			dialogs.forEach( (dialog,i) => {
				if( dialog.id == nextProps.chats[0].id ){
					this.setState({
						dialogs : [dialog].concat(dialogs.slice(0,i)).concat(dialogs.slice(i+1))
					});
				}
			})
		}
	}
	handleClickOutside = () => {
		this.hideAll();
	}
	hideAll = () => {
		this.showChatMenu(false);
		this.showChatLayer(null);
	}
	render(){
		const { cx, searched } = this.props;
		const { panel, dialogs, menu, layer, layerSelected, type } = this.state;
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
							{ panel?panel.name:"" }<span className="chat-title-span"></span>
						</div>
					</div>
					<div className="chat-dialog">
						<div className={cx("chat-dialogs","chat-dialog-search")}>
							<input type="text" className="chat-search" placeholder="검색" />
						</div>
						<div className="chat-dialog-box">
							{ dialogs.map( (dialog, i) => {
								<Dialog cx={cx} dialog={dialog}/>
							})}
						</div>
					</div>
					{ 
						type ? 
							<div className="chat-box">
								<div className="chat-panel">
								</div>
								<div className="send-panel">
									<textarea className="send-textarea" placeholder="메시지를 입력하세요"></textarea>
									<label className="send-file-label" htmlFor="chat-file" />
									<input className="send-file-input" id="chat-file" type="file" multiple />
									<div className="send-btn">
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
							<input type="text" className="chat-layer-search" placeholder="검색" onChange={this.handleLayerSearch} />
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

const stateToProps = ({searched}) => ({searched});
const actionToProps = {
	fetchSearchUser,
	fetchSearchUsers
};
export default connect(stateToProps, actionToProps)(Chat);
