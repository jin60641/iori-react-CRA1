import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchSearchFollows } from '../../actions/search';
import { fetchFollow } from '../../actions/relation';

import styles from './List.css';

class List extends Component {
	constructor(props){
		super(props);
		this.state = {
			follows : []
		}
	}
	componentWillReceiveProps = nextProps => {
		if( this.state.follows.length !== nextProps.searched.follows.length ){
			this.setState({
				follows : nextProps.searched.follows
			})
		}
	}
	componentWillMount = () => {
		const { follows } = this.props.searched;
		const { userId, fetchSearchFollows } = this.props;
		const tab = this.props.match.params.tab;
		const query = {
			type : tab === "follower" ? 'to' : 'from',
			userId
		}
		fetchSearchFollows(query)
		.then( action => {
			if( !action.error ) {
				console.log(action.payload);
			}
		});
	}
	handleClickFollow = (i) => {
		const { fetchFollow } = this.props;
		fetchFollow({ to : this.state.follows[i].id })
		.then( action => {
			const nextState = { ...this.state };
			nextState.follows[i].following = action.payload;
			this.setState(nextState);
		});
	}
	render(){
		const { follows } = this.props.searched;
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
								<div className="list-btn" onClick={()=>this.handleClickFollow(i)} >{user.following?"언팔로우":"팔로우"}</div>
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

const stateToProps = ({searched}) => ({searched});

const actionToProps = {
	fetchFollow,
	fetchSearchFollows
}

export default connect(stateToProps,actionToProps)(List);
