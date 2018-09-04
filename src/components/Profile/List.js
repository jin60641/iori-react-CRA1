import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { searchFollows } from '../../actions/search';
import { follow } from '../../actions/relation';

import './List.scss';

const stateToProps = ({searched}) => ({follows : searched.follows});

const actionToProps = {
	follow : follow.REQUEST,
	searchFollows : searchFollows.REQUEST
}

@connect(stateToProps,actionToProps)
class List extends Component {
	componentDidMount = () => {
		const { userId, searchFollows, tab } = this.props;
		const query = {
			type : tab === "follower" ? 'to' : 'from',
			userId
		}
		searchFollows(query);
	}
	handleClickFollow = to => {
		const { follow } = this.props;
		follow({ to });
	}
	render(){
		const { follows } = this.props;
		return(
			<div className="List">
				{ follows.map( (user,i) => {
					const profileLink = `/@${user.handle}`;
					const profileImg = user.profile?`/files/profile/${user.id}.png`:"/images/profile.png";
					const headerImg = user.header?`/files/header/${user.id}.png`:"";
					return(
						<div className="list-card" key={`list-${user.id}`} >
							<Link to={ profileLink } className="list-header" style={ { "backgroundImage" : `url("${headerImg}")` } } />
							<Link to={ profileLink } className="list-profile" style={ { "backgroundImage" : `url("${profileImg}")` } } />
							<div className="list-btn-wrap">
								<div className="list-btn" onClick={()=>this.handleClickFollow(user.id)} >{user.following?"언팔로우":"팔로우"}</div>
							</div>
							<Link to={ profileLink } className="list-user">
								<div className="list-name"> {user.name} </div>
								<div className="list-handle"> @{user.handle} </div>
							</Link>
						</div>
					);
				})}
			</div>
		);
	}
}

export default List;
