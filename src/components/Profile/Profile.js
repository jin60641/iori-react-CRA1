import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { fetchSearchUser } from '../../actions/search';
import { fetchSetProfile } from '../../actions/setting';
import { fetchFollow } from '../../actions/relation';

import Newsfeed from '../Newsfeed/Newsfeed';
import styles from './Profile.css';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);


const initialState = {
	user : null,
	isSetting : false,
	helper : null,
	moving : null,
	header : {
		img : new Image(),
		file : null,
		x : 0,
		y : 0,
		width : 0,
		height : 0,
		scale : 1
	},
	profile : {
		img : new Image(),
		file : null,
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
		this.state = { ...initialState };
	}
	componentWillUnmount = () => {
		const { showScroll } = this.props;
		showScroll(true);
	}
	componentWillMount = () => {
		const { fetchSearchUser } = this.props;
		const { handle } = this.props.match.params;
		fetchSearchUser({ query : handle })
		.then( action => {
			if( !action.error ){
				const user = action.payload;
				this.getImage(user,"profile");
				this.getImage(user,"header");
				this.setState({
					user : action.payload
				})
			}
		});
	}
	componentWillReceiveProps = nextProps => {
		const { fetchSearchUser } = this.props;
		const handle = nextProps.match.params.handle;
		if( this.props.match.params.handle !== handle ){
			fetchSearchUser({ query : handle })
			.then( action => {
				if( !action.error ){
					const user = action.payload;
					this.getImage(user,"profile");
					this.getImage(user,"header");
					this.setState({
						user : action.payload
					})
				}
			});
		}
	}
	getImage = (user,type) => {
		const nextState = {};
		if( this.state.user ){
			nextState.user = {};
			nextState.user[type] = user[type];
		}
		if( user[type] ){
			const img = new Image();
			img.src = `/files/${type}/${user.id}.png`;
			img.onload = (e) => {
				const { width, height } = img;
				nextState[type] = { ...initialState[type], img, width, height };
				this.setState(nextState);
			}
		} else {
			nextState[type] = { ...initialState[type] };
			this.setState(nextState);
		}
	}
	handleClickSetting = bool => {
		const { showScroll, scrollToTop } = this.props;
		if( bool ){
			scrollToTop();
		}
		showScroll(!bool);
		this.setState({
			isSetting : bool
		});
	}
	sendSetting = type => {
		const obj = this.state[type];
		const { x, y, width, height, file, img } = obj;
		if( !file && img.src ){
			return 0;
		}
		const { fetchSetProfile, user } = this.props;
		const label = this.refs[type];;
		let formData = new FormData();
		formData.append("type",type);
		if( file ){
			formData.append("x",-x);
			formData.append("y",-y);
			formData.append("width",label.clientWidth/width*img.width);
			formData.append("height",label.clientHeight/height*img.height);
			formData.append("file",file);
		}
		fetchSetProfile(formData)
		.then( action => {
			if( !action.error ){
				if( action.payload ){
					this.getImage(user,type);
					this.handleClickSetting(false);
				}
			}
		});
	}
	handleClickSettingSave = () => {
		const { showScroll } = this.props;
		showScroll(true);
		this.sendSetting("header");
		this.sendSetting("profile");
	}
	handleClickRemove = (type) => {
		const nextState = { ...this.state };
		nextState[type] = { ...initialState[type] };
		this.setState(nextState);
	}
	handleClickHelper = str => {
		this.setState({
			helper : str
		})
	}
	handleChangeFile = (e,type) => {
		const input = e.target;
		const reader = new FileReader();
		const file = input.files[0];
		reader.addEventListener("load",(event) => {
			const dataURL = event.target.result;
			const img = new Image();
			img.src = dataURL;
			img.onload = (e) => {
				const { width, height } = img;
				const nextState = {};
				nextState[type] = { ...initialState[type], img, width, height, file };
				this.handleMouseWheel(null,type);
				this.setState(nextState);
			}
		});
		reader.readAsDataURL(file);
	}
	handleMouseDown = (type) => {
		this.setState({
			moving : type,
			helper : null
		});
	}
	handleMouseUp = () => {
		this.setState({
			moving : null
		});
	}
	handleMouseMove = (e,type,force) => {
		const label = this.refs[type];;
		const moving = this.state.moving;
		const obj = this.state[type];
		let { x,y,img, width, height, scale } = obj;
		if( force || ( moving && type && moving === type && obj.img.src ) ){
			if( !force ){
				y += e.nativeEvent.movementY * 2;
				x += e.nativeEvent.movementX * 2;
			}
			let direction;
			if( img.width < label.clientWidth || img.height < label.clientHeight ){
				direction = (img.width/label.clientWidth < img.height/label.clientHeight)?"width":"height";
			}
		
			if( x >= 0 ){
				x = 0;
			} else if( x < label.clientWidth - width ) {
				x = label.clientWidth - width;
			} else if( !direction && width >= label.clientWidth && x < - label.clientWidth - width ){
				x = - label.clientWidth - width;
			} else if( direction === "height" && x < label.clientWidth - label.clientHeight/img.height * width ){
				x = label.clientWidth - label.clientHeight/img.height * width;
			} else if( direction === "width" && x < label.clientWidth - label.clientWidth * scale ){
				x = label.clientWidth - label.clientWidth * scale;
			}
	
			if( y >= 0 ){
				y = 0;
			} else if( y < label.clientHeight - height ){
				y = label.clientHeight - height;
			} else if( !direction && height >= label.clientHeight && y < - label.clientHeight - height ){
				y = - label.clientHeight - height;
			} else if( direction === "width" && y < label.clientHeight - label.clientWidth/img.width * height ){
				y = label.clientHeight - label.clientWidth/img.width * height;
			} else if( direction === "height" && y < label.clientHeight - label.clientHeight * scale){
				y = label.clientHeight - height * scale;
			}
			const nextState = {	...this.state };
			nextState[type].x = x;
			nextState[type].y = y;
			this.setState(nextState);
		}
	}
	handleMouseWheel = (e,type) => {
		const { img } = this.state[type];
		if( !img.src ){
			return 1;
		}
		if( e ){
			e.preventDefault();
		}
		const label = this.refs[type];
		const nextState = { ...this.state };
		let scale = nextState[type].scale - 0.001 * (e?e.deltaY:0);
		if( scale < 1 ){
			scale = 1;
		} else if( scale > 2 ){
			scale = 2;
		}
		let direction;
		let multi;
		if( img.width < label.clientWidth || img.height < label.clientHeight ){
			direction = (img.width/label.clientWidth < img.height/label.clientHeight)?"width":"height";
		}
		nextState[type].scale = scale;
		if( direction === "width" ){
			multi = label.clientWidth/img.width;
			nextState[type].width = label.clientWidth * scale;
			nextState[type].height = img.height * multi * scale;
		} else if( direction === "height" ){
			multi = label.clientHeight/img.height;
			nextState[type].width = img.width * multi * scale;
			nextState[type].height = label.clientHeight * scale;
		} else {
			nextState[type].width = img.width * scale;
			nextState[type].height = img.height * scale;
		}
		this.setState(nextState);
		this.handleMouseMove(null,type,true);
	}
	handleClickFollow = () => {
		const { fetchFollow } = this.props;
		fetchFollow({ to : this.state.user.id })
		.then( action => {
			console.log(action);
			const nextState = { ...this.state };
			nextState.user.following = action.payload;
			this.setState(nextState);
		});
	}
	render(){
		const { user, isSetting, helper, header, moving, profile } = this.state;
		const { isTop, isBottom, isLoggedIn } = this.props;
		if( !user ){
			return( null );
		} else {
			const my = isLoggedIn() && user.id === this.props.user.id;
			const headerLabelStyle = {
				backgroundImage : `url("${header.img.src}")`,
				backgroundPosition : `${header.x}px ${header.y}px`,
				backgroundSize : `${header.width}px ${header.height}px`
			}
			const profileLabelStyle = {
				backgroundImage : `url("${profile.img.src}")`,
				backgroundPosition : `${profile.x}px ${profile.y}px`,
				backgroundSize : `${profile.width}px ${profile.height}px`
			}
			return(
				<div>
					<div className={ cx("Profile",{"Profile-top":isTop,"Profile-top-header":isTop&&(isSetting||user.header)}) }>
						<div className="profile-container" >
							<form className="profile-header">
								<div className={cx("profile-label",{"profile-label-active":isSetting,"profile-label-uploaded":header.img.src})} style={ headerLabelStyle } ref="header" onMouseMove={e=>this.handleMouseMove(e,"header")} onMouseDown={()=>this.handleMouseDown("header")} onMouseUp={this.handleMouseUp} onWheel={e=>this.handleMouseWheel(e,"header")}>
									<div className={cx("profile-helper",{"profile-helper-clicked":helper==="header","profile-helper-active":!moving})} onMouseDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();this.handleClickHelper("header")}}>
										<div className="profile-helper-menu" onClick={e=>{e.stopPropagation();this.handleClickHelper(""); return 0;}}>
										{ header.img.src ? 
											<div>
												<label className="profile-helper-menu-item" htmlFor="profile-header-file">
													변경
												</label>
												<div className="profile-helper-menu-item" onClick={()=>this.handleClickRemove("header")}>
													삭제
												</div>
											</div>
											: <div>
												<label className="profile-helper-menu-item" htmlFor="profile-header-file">
													추가
												</label>
											</div>
										}
										</div>
									</div>
								</div>
								{ header.img.src ?
									<div className="profile-header-back" style={ { backgroundImage : `url(${header.img.src})` } }/>
									: <div className="profile-header-back" />
								}
								<input className="profile-header-file" id="profile-header-file" type="file" onChange={e=>this.handleChangeFile(e,"header")}/>
							</form>
							<form className="profile-img">
								<div className={cx("profile-label",{"profile-label-active":isSetting,"profile-label-uploaded":profile.img.src})} style={ profileLabelStyle } ref="profile" onMouseMove={e=>this.handleMouseMove(e,"profile")} onMouseDown={()=>this.handleMouseDown("profile")} onMouseUp={this.handleMouseUp} onWheel={e=>this.handleMouseWheel(e,"profile")}>
									<div className={cx("profile-helper",{"profile-helper-clicked":helper==="profile","profile-helper-active":!moving})} onMouseDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();this.handleClickHelper("profile")}}>
										<div className="profile-helper-menu" onClick={e=>{e.stopPropagation();this.handleClickHelper(""); return 0;}}>
										{ profile.img.src ? 
											<div>
												<label className="profile-helper-menu-item" htmlFor="profile-img-file">
													변경
												</label>
												<div className="profile-helper-menu-item" onClick={()=>this.handleClickRemove("profile")}>
													삭제
												</div>
											</div>
											: <div>
												<label className="profile-helper-menu-item" htmlFor="profile-img-file">
													추가
												</label>
											</div>
										}
										</div>
									</div>
								</div>
								{ profile.img.src ?
									<div className="profile-img-back" style={ { backgroundImage : `url(${profile.img.src})` } }/>
									: <div className="profile-img-back" style={ { backgroundImage : "url('/images/profile.png')" } }/>
								}
								<input className="profile-img-file" type="file" id="profile-img-file" onChange={e=>this.handleChangeFile(e,"profile")}/>
							</form>
							{ my ? 
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
							:
								<div className="profile-nav">
									{ isLoggedIn() ? 
										<div className={cx("profile-btn","profile-btn-active")} onClick={this.handleClickFollow}>
											{ user.following?"언팔로우":"팔로우" }
										</div>
									:
										<Link to="/auth/login" className={cx("profile-btn","profile-btn-active")} >
											팔로우
										</Link>
									}
									<Link to={`/chat/@${user.handle}`} className={cx("profile-btn","profile-btn-active")} >
										쪽지
									</Link>
								</div>
							}
						</div>
					</div>
					<Newsfeed
						isBottom = { isBottom }
						options = { { userId : user.id } }
					/>
				</div>
			);
		}
	}
}
const stateToProps = ({searched,user}) => ({searched,user});

const actionToProps = {
	fetchSearchUser,
	fetchSetProfile,
	fetchFollow
}

export default connect(stateToProps,actionToProps)(Profile);

