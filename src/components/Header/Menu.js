import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

const defaultProfileUri = '/images/profile.png';
class Menu extends Component {
	constructor(props){
		super(props);
	}
	render(){
		const { user } = this.props;
		return( 
			<div className="Menu">
				{ 
					( user && user.verify ) ?
						<Link to={`/@${user.handle}`}>
							{	user.profile ?
								<img src={ `/files/profile/${user.id}.png` } className="menu-profile" />
								: <img src={ defaultProfileUri } className="menu-profile" />
							}
						</Link>
					: 
						<Link to="/auth/login">
							<img src={ defaultProfileUri } className="menu-profile" />
						</Link>
				}
			</div>
		);
	}
}

export default Menu;
