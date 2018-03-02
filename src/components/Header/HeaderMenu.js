import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class HeaderMenu extends Component {
	constructor(props){
		super(props);
	}
	render(){
		const { user } = this.props;
		let profileUri = '/images/profile.png';
		if( user && user.verify ){
			if( user.profile ){
				profileUri = `/files/profile/${user.id}.png`;
			}
			return (
				<img src={ profileUri } className="HeaderMenu" />
			)
		} else {
			return (
				<Link to="/auth/login">
					<img src={ profileUri } className="HeaderMenu" />
				</Link>
			);
		}
	}
}

export default HeaderMenu;
