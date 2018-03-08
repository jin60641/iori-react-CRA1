import React, { Component } from 'react';

import styles from './Profile.css';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const maxHeight = 200;
const minHeight = 80;

class Profile extends Component {
	constructor(props){
		super(props);
		this.state = {
		}
	}
	calcHeight(){
		const { scrollTop } = this.props;
		const height = maxHeight-scrollTop;
		return height<minHeight?minHeight:height;
	}
	render(){
		const height = this.calcHeight();
		return(
			<div className="Profile" style={{height:maxHeight}}>
				<div className="profile-container" style={{height}}>
					<form className="profile-header">
						<div className="profile-header-back">
						
						</div>
						<input className="profile-header-file" type="file" />
					</form>
					<form className="profile-img">
						
					</form>
				</div>
			</div>
		);
	}
}

export default Profile;

