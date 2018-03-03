import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies, Cookies } from 'react-cookie';
import './Chat.css';

import Dialog from './Dialog.js';

import { fetchSearch } from '../../actions/search';

class Chat extends Component {
	constructor(props){
		super(props);
		this.state = {
			menu : false,
			layer : "",
			dialogs : [],
			chats : {},
			layerSelected : {}
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
	handleLayerSelect = (id) => {
		const prev = this.state.layerSelected;
		const layerSelected = Object.assign({},prev);
		layerSelected[id] = !prev[id];
		this.setState({layerSelected});
	}
	handleLayerSearch = (e) => {
		const { fetchSearch } = this.props;
		const query = e.target.value
		if( !query.length ){
			return null;
		}
		const data = {
			type : "User",
			query : {
				$or : [
					{ 
						name : { $like : `%${query}%` } 
					}, { 
						handle : { $like : `%${query}%` } 
					}
				]
			}
		}
		fetchSearch(data)
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
		this.showChatLayer("");
	}
	render(){
		const { cx, searched } = this.props;
		const { dialogs, menu, layer, layerSelected } = this.state;
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
							title<span className="chat-title-span">span</span>
						</div>
					</div>
					<div className="chat-dialog">
						<div className={cx("chat-dialogs","chat-dialog-search")}>
							<input type="text" className="chat-search" placeholder="search" />
						</div>
						<div className="chat-dialog-box">
							{ dialogs.map( (dialog, i) => {
								<Dialog cx={cx} dialog={dialog}/>
							})}
						</div>
					</div>
					<div className="chat-box">
						<div className="chat-panel">
						</div>
						<div className="send-panel">
							<textarea className="send-textarea" placeholder="메시지를 입력하세요"></textarea>
						</div>
					</div>
				</div>
				<div className={cx("chat-layer",{"chat-layer-active":layer!==""})} onClick={()=>this.showChatLayer("")} >
					<div className="chat-layer-close"></div>
					<div className="chat-layer-box" onClick={(e)=>e.stopPropagation()}>
						<div className="chat-layer-box-close" onClick={()=>this.showChatLayer("")}></div>
						<div className="chat-layer-title">Title</div>
						<div className="chat-layer-search-box">
							<input type="text" className="chat-layer-search" placeholder="검색" onChange={this.handleLayerSearch} />
						</div>
						<div className={cx("chat-layer-list","chat-layer-div")}>
						{ searched.map( (result) => {
							return(
								<div className={cx("chat-dialogs",{"chat-dialogs-active":layerSelected[result.id]})} key={`chat-layer-list-${result.id}`} onClick={()=>this.handleLayerSelect(result.id)}>
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
							<div className={cx("chat-layer-menu-item","chat-layer-menu-active")} onClick={()=>this.showChatLayer("")} >취소</div>
							<div className="chat-layer-menu-item">초대</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const stateToProps = ({searched}) => ({searched});
const actionToProps = {
	fetchSearch
};
export default withCookies(connect(stateToProps, actionToProps)(Chat));
