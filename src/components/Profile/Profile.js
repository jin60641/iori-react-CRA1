import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSearchUser } from '../../actions/search';

import Newsfeed from '../Newsfeed/Newsfeed';
import styles from './Profile.css';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);


const initialState = {
	user : null,
	isSetting : false,
	helper : null,
	moving : false,
	header : {
		img : new Image(),
		x : 0,
		y : 0,
		width : 0,
		height : 0,
		scale : 1
	}
}
class Profile extends Component {
	constructor(props){
		super(props);
		this.state = initialState;
	}
	componentWillMount = () => {
		const { fetchSearchUser } = this.props;
		const { handle } = this.props.match.params;
		fetchSearchUser({ query : handle })
		.then( action => {
			console.log(action);
			if( !action.error ){
				this.setState({
					user : action.payload
				})
			}
		});
	}
	handleClickSetting = bool => {
		const { helper, header } = initialState;
		this.setState({
			isSetting : bool,
			helper,
			header
		});
	}
	handleClickSettingSave = () => {
		
	}
	handleClickHelper = str => {
		this.setState({
			helper : str
		})
	}
	handleChangeFile = (e) => {
		const input = e.target;
		const reader = new FileReader();
		reader.addEventListener("load",(event) => {
			const dataURL = event.target.result;
			const img = new Image();
			img.src = dataURL;
			img.onload = (e) => {
				const { width, height } = img;
				const nextState = Object.assign(initialState.header,{ img, width, height });
				this.setState({
					header : nextState
				})
			}
			//label.style.backgroundPositionX = "0px";
			//label.style.backgroundPositionY = "0px";
		});
		reader.readAsDataURL(input.files[0]);
	}
	handleMouseDown = e => {
		this.setState({
			moving : true,
			helper : null
		});
	}
	handleMouseUp = e => {
		this.setState({
			moving : false
		});
	}
	handleMouseMove = (e,type) => {
		const label = e.target;
		const moving = this.state.moving;
		const obj = this.state[type];
		let { x,y,img, width, height, scale } = obj;
		if( moving && obj.img.src ){
			y += e.nativeEvent.movementY * 2;
			x += e.nativeEvent.movementX * 2;
			let direction;
			if( img.width < label.clientWidth || img.height < label.clientHeight ){
				direction = (img.width/label.clientWidth < img.height/label.clientHeight)?"width":"height";
			}
		
			if( x >= 0 ){
				x = 0;
			} else if( !direction && width >= label.clientWidth && x < - label.clientWidth - width ){
				x = - label.clientWidth - width;
			} else if( direction == "height" && x < label.clientWidth - label.clientHeight/img.height * width ){
				x = label.clientWidth - label.clientHeight/img.height * width;
			} else if( direction == "width" && x < label.clientWidth - label.clientWidth * scale ){
				x = label.clientWidth - label.clientWidth * scale;
			} else if( !direction && x < label.clientWidth - width ){
				x = label.clientWidth - width;
			}
	
			if( y >= 0 ){
				y = 0;
			} else if( !direction && height >= label.clientHeight && y < - label.clientHeight - height ){
				y = - label.clientHeight - height;
			} else if( direction == "width" && y < label.clientHeight - label.clientWidth/img.width * height ){
				y = label.clientHeight - label.clientWidth/img.width * height;
			} else if( direction == "height" && y < label.clientHeight - label.clientHeight * scale){
				y = label.clientHeight - height * scale;
			} else if( !direction && y < label.clientHeight - height ){
				y = label.clientHeight - height;
			}
			const nextState = {	...this.state };
			nextState[type].x = x;
			nextState[type].y = y;
			this.setState(nextState);
		}
	}
	render(){
		const { user, isSetting, helper, header, moving } = this.state;
		const { isBottom, isTop } = this.props;
		if( !user ){
			return( null );
		} else {
			const labelStyle = {
				backgroundImage : `url("${header.img.src}")`,
				backgroundPosition : `${header.x}px ${header.y}px`,
				backgroundSize : `${header.width}px ${header.height}px`
			}
			return(
				<div>
					<div className={ cx("Profile",{"Profile-top":isTop,"Profile-top-header":isTop&&(isSetting||user.header)}) }>
						<div className="profile-container" >
							<form className="profile-header">
								<div className={cx("profile-header-label",{"profile-label-active":isSetting,"profile-label-uploaded":header.img.src})} style={ labelStyle } ref="header" onMouseMove={e=>this.handleMouseMove(e,"header")} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
									<div className={cx("profile-header-helper",{"profile-helper-clicked":helper==="header","profile-helper-active":!moving})} onMouseDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();this.handleClickHelper("header")}}>
										<div className="profile-header-helper-menu" onClick={e=>{e.stopPropagation();this.handleClickHelper(""); return 0;}}>
											<label className="profile-header-helper-menu-item" htmlFor="profile-header-file">
												추가
											</label>
											<div className="profile-header-helper-menu-item">
												삭제
											</div>
										</div>
									</div>
								</div>
								<div className="profile-header-back" />
								<input className="profile-header-file" id="profile-header-file" type="file" onChange={this.handleChangeFile}/>
							</form>
							<form className="profile-img">
								<label className={cx("profile-img-label",{"profile-label-active":!isSetting})} />
								<div className="profile-img-back" />
								<input className="profile-img-file" type="file" />
							</form>
							<div className="profile-nav">
								<div className={cx("profile-btn",{"profile-btn-active":!isSetting})} onClick={()=>this.handleClickSetting(true)} >
									프로필 설정
								</div>
								<div className={cx("profile-btn",{"profile-btn-active":isSetting})} onClick={()=>this.handleClickSetting(false)} >
									설정 취소
								</div>
								<div className={cx("profile-btn",{"profile-btn-active":isSetting})} onClick={this.handleClickSettingSave} >
									설정 저장
								</div>
							</div>
						</div>
					</div>
					<Newsfeed
						isBottom = { isBottom }
						options = { { user } }
					/>
				</div>
			);
		}
	}
}
const stateToProps = ({searched}) => ({searched});

const actionToProps = {
	fetchSearchUser
}

export default connect(stateToProps,actionToProps)(Profile);

