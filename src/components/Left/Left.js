import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Left.css';

class Left extends Component {
	constructor(props){
		super(props);
	}
	render(){
		const { user } = this.props;
		const profileLink = `/@${user.handle}`;
		const profileImg = user.profile?`/files/profile/${user.id}.png`:"/images/profile.png";
		const headerImg = user.header?`/files/header/${user.id}.png`:"";
		if( !user ){
			return(null);
		} else {
			return(
				<div className="Left">
					<Link to={ profileLink } className="left-header" style={ { "backgroundImage" : `url("${headerImg}")` } } />
					<Link to={ profileLink } className="left-profile" style={ { "backgroundImage" : `url("${profileImg}")` } } />
					<Link to={ profileLink } className="left-user"> 
						<div className="left-name"> {user.name} </div>
						<div className="left-handle"> @{user.handle} </div>
					</Link>
					<div className="left-tabs">
						<Link to={ profileLink } className="left-tab">
							<div className="left-tab-name">
								게시글
							</div>
							<div className="left-tab-number">
								{ user.posts }
							</div>
						</Link>
						<div className="left-tab">
							<div className="left-tab-name">
								팔로잉
							</div>
							<div className="left-tab-number">
								{ user.followings }
							</div>
						</div>
						<div className="left-tab">
							<div className="left-tab-name">
								팔로워
							</div>
							<div className="left-tab-number">
								{ user.followers }
							</div>
						</div>
					</div>
				</div>
			);
		}
	}
}

export default Left;
