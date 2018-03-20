import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Left.css';

class Left extends Component {
	constructor(props){
		super(props);
	}
	render(){
		const { user } = this.props;
		if( !user ){
			return(null);
		} else {
			return(
				<div className="Left">
					<div className="left-header" style={ { "backgroundImage" : `url("/files/header/${user.id}.png")` } } />
					<div className="left-profile" style={ { "backgroundImage" : `url("/files/profile/${user.id}.png")` } } />
					<div className="left-user"> 
						<div className="left-name"> {user.name} </div>
						<div className="left-handle"> @{user.handle} </div>
					</div>
					<div className="left-tabs">
						<Link to={`/@${user.handle}`} className="left-tab">
							<div className="left-tab-name">
								게시글
							</div>
							<div className="left-tab-number">
								{ user.post }
							</div>
						</Link>
						<div className="left-tab">
							<div className="left-tab-name">
								팔로잉
							</div>
							<div className="left-tab-number">
								{ user.following }
							</div>
						</div>
						<div className="left-tab">
							<div className="left-tab-name">
								팔로워
							</div>
							<div className="left-tab-number">
								{ user.follower }
							</div>
						</div>
					</div>
				</div>
			);
		}
	}
}

export default Left;
