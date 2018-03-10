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
	header : null
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
		this.setState({
			isSetting : bool,
			helper : null
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
			const label = this.refs.header;
			label.style.backgroundImage = "url('" + dataURL + "')";
			//label.style.backgroundPositionX = "0px";
			//label.style.backgroundPositionY = "0px";
			this.setState({
				header : img
			})
		});
		reader.readAsDataURL(input.files[0]);
	}
	render(){
		const { user, isSetting, helper, header } = this.state;
		const { isBottom, isTop } = this.props;
		if( !user ){
			return( null );
		} else {
			return(
				<div>
					<div className={ cx("Profile",{"Profile-top":isTop,"Profile-top-header":isTop&&(isSetting||user.header)}) }>
						<div className="profile-container" >
							<form className="profile-header">
								<div className={cx("profile-header-label",{"profile-label-active":isSetting,"profile-label-uploaded":header})}  onClick={()=>this.handleClickHelper((helper==="header"||header)?null:"header")} ref="header">
									<div className={cx("profile-header-helper",{"profile-helper-active":helper==="header"} )} onClick={e=>{e.stopPropagation();this.handleClickHelper("header")}}>
										<div className="profile-header-helper-menu">
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

