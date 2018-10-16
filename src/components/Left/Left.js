import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Left.scss';

const stateToProps = ({ user }) => ({ user });
const actionToProps = {
};
@connect(stateToProps, actionToProps)
class Left extends Component {
  render() {
    const { user } = this.props;
    const profileLink = `/@${user.handle}`;
    const profileImg = user.profile ? `/files/profile/${user.id}.png` : '/images/profile.png';
    const headerImg = user.header ? `/files/header/${user.id}.png` : '';
    if (!user) {
      return (null);
    }
    return (
      <div className='Left'>
        <Link to={profileLink} className='left-header' style={{ backgroundImage: `url("${headerImg}")` }} />
        <Link to={profileLink} className='left-profile' style={{ backgroundImage: `url("${profileImg}")` }} />
        <Link to={profileLink} className='left-user'>
          <div className='left-name'>
            {' '}
            {user.name}
            {' '}
          </div>
          <div className='left-handle'>
            {' '}
@
            {user.handle}
            {' '}

          </div>
        </Link>
        <div className='left-tabs'>
          <Link to={profileLink} className='left-tab'>
            <div className='left-tab-name'>
                게시글

            </div>
            <div className='left-tab-number'>
              { user.posts }
            </div>
          </Link>
          <Link to={`${profileLink}/following`} className='left-tab'>
            <div className='left-tab-name'>
                팔로잉

            </div>
            <div className='left-tab-number'>
              { user.followings }
            </div>
          </Link>
          <Link to={`${profileLink}/follower`} className='left-tab'>
            <div className='left-tab-name'>
                팔로워

            </div>
            <div className='left-tab-number'>
              { user.followers }
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

export default Left;
