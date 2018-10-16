import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { follow } from '../../actions/relation';

import './UserCard.scss';

const stateToProps = ({ user }) => ({ user });
const actionToProps = {
  follow: follow.REQUEST,
};

@withRouter
@connect(stateToProps, actionToProps)
class UserCard extends Component {
  handleClickFollow = e => (to) => {
    const { history, user, follow } = this.props;
    if (user.verify) {
      follow({ to });
    } else {
      history.push(`/auth/login${history.location.pathname}`);
    }
  }

  render() {
    const { data } = this.props;
    const profileLink = `/@${data.handle}`;
    const profileImg = data.profile ? `/files/profile/${data.id}.png` : '/images/profile.png';
    const headerImg = data.header ? `/files/header/${data.id}.png` : '';
    return (
      <div className='UserCard' key={`UserCard-${data.id}`}>
        <Link to={profileLink} className='UserCard-header' style={{ backgroundImage: `url("${headerImg}")` }} />
        <Link to={profileLink} className='UserCard-profile' style={{ backgroundImage: `url("${profileImg}")` }} />
        <div className='UserCard-btn-wrap'>
          <div className='UserCard-btn' onClick={this.handleClickFollow(data.id)}>{data.following ? '언팔로우' : '팔로우'}</div>
        </div>
        <Link to={profileLink} className='UserCard-user'>
          <div className='UserCard-name'>
            {' '}
            {data.name}
            {' '}
          </div>
          <div className='UserCard-handle'>
            {' '}
@
            {data.handle}
            {' '}

          </div>
        </Link>
      </div>
    );
  }
}
export default UserCard;
