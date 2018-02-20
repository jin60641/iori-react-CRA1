import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class HeaderMenu extends Component {
	constructor(props){
		super(props);
	}
	render(){
		const { user } = this.props;
		let profileUri = '/images/profile.png';
		if( user && user.signUp && user.be ){
			if( user.profile ){
				profileUri = `/files/profile/${user.id}.png`;
			}
			return (
				null
			)
		} else {
			return (
				<Link to="/auth/login">
					<img src={ profileUri } className="HeaderMenu" />
				</Link>
			)
		}
	}
}

export default HeaderMenu;
