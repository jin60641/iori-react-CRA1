import React, { Component } from 'react';

import styles from './Layer.css';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const initialState = {
	selected : {},
	query : ""
}

class Layer extends Component {
	constructor(props){
		super(props);
		this.state = initialState;
	}
	handleClickLayer = () => {
		const { showChatLayer } = this.props
		this.setState(initialState);
		showChatLayer(null);
	}
	handleSelect = (user) => {
		const prev = this.state.selected;
		let selected = {};
		if( this.props.type === "user" ){
			if( !prev[user.id] ){
				selected[user.id] = user;
			}
		} else {
			selected = Object.assign({},prev);
			if( prev[user.id] ){
				delete selected[user.id];
			} else {
				selected[user.id] = user;
			}
		}
		this.setState({selected});
	}
	handleSearch = (e) => {
		const { fetchSearchUsers } = this.props;
		const query = e.target.value
		this.setState({
			query,
			selected : {}
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
	handleClickInvite = () => {
		const { type, inviteUsers } = this.props;
        const { selected } = this.state;
        const keys = Object.keys(selected);
        if( !keys.length ){
            return false;
        }
        if( type === "user" ){
            const to = selected[keys[0]];
			inviteUsers([to]);
        } else if( type === "group" ){
        }
	}
	render(){
		const { showChatLayer, searched, type } = this.props
		const { query, selected } = this.state;
		return(
			<div className="Layer" onClick={()=>showChatLayer(null)} >
				<div className="layer-close" />
				<div className="layer-box" onClick={(e)=>e.stopPropagation()}>
					<div className="layer-box-close" onClick={()=>showChatLayer(null)}></div>
					<div className="layer-title">{ type === "user" ? "1:1 대화" : "그룹 초대" }</div>
					<div className="layer-search-box">
						<input type="text" className="layer-search" placeholder="검색" value={query} onChange={this.handleSearch} />
					</div>
					<div className="layer-list">
					{ searched.users.map( (result) => {
						return(
							<div className={cx("layer-list-item",{"layer-list-item-active":selected[result.id]})} key={`layer-list-${result.id}`} onClick={()=>this.handleSelect(result)}>
								<img className="layer-list-img" />
								<div className="layer-list-wrap">
									<div className="layer-list-name">{result.name}</div>
									<div className="layer-list-handle">@{result.handle}</div>
								</div>
							</div>
						);
					}) }
					</div>
					<div className="layer-menu">
						<div className={cx("layer-menu-item","layer-menu-active")} onClick={()=>showChatLayer(null)} >취소</div>
						<div className={cx("layer-menu-item",{"layer-menu-active":Object.keys(selected).length})} onClick={this.handleClickInvite}>초대</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Layer;
