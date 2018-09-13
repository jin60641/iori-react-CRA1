import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { follow } from '../../actions/relation';

import './UserCard.scss';
const actionToProps = {
  follow : follow.REQUEST,
}

@connect(undefined,actionToProps)
class UserCard extends Component {
  handleClickFollow = e => to => {
    const { follow } = this.props;
    follow({ to });
  }
  render(){ 
    const { user } = this.props;
    const profileLink = `/@${user.handle}`;
    const profileImg = user.profile?`/files/profile/${user.id}.png`:"/images/profile.png";
    const headerImg = user.header?`/files/header/${user.id}.png`:"";
    return(
      <div className="UserCard" key={`UserCard-${user.id}`} >
        <Link to={ profileLink } className="UserCard-header" style={ { "backgroundImage" : `url("${headerImg}")` } } />
        <Link to={ profileLink } className="UserCard-profile" style={ { "backgroundImage" : `url("${profileImg}")` } } />
        <div className="UserCard-btn-wrap">
          <div className="UserCard-btn" onClick={this.handleClickFollow(user.id)} >{user.following?"언팔로우":"팔로우"}</div>
        </div>
        <Link to={ profileLink } className="UserCard-user">
          <div className="UserCard-name"> {user.name} </div>
          <div className="UserCard-handle"> @{user.handle} </div>
        </Link>
      </div>
    );
  }
}
export default UserCard;
