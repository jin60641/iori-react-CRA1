import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Item.scss';

import { removeNotice } from '../../actions/notice';

const actionToProps = {
  removeNotice,
};

const links = {
  post: notice => `/post/${notice.postId}`,
  follow: notice => `/@${notice.from.handle}`,
  chat: notice => (notice.chat.type === 'user' ? `/chat/@${notice.from.handle}` : `/chat/$${notice.chat.group.handle}`),
};

@connect(undefined, actionToProps)
class Item extends Component {
  getDateString = (createdAt) => {
    const now = new Date();
    const date = new Date(createdAt || now);
    const date_time = Math.floor(date.getTime() / 1000);
    const now_time = Math.floor(now.getTime() / 1000);
    const gap = now_time - date_time;
    if (gap < 86400) {
      return `${((date.getDate() !== now.getDate()) ? '어제 ' : '') + (date.getHours() <= 9 ? '0' : '') + date.getHours()}:${date.getMinutes() <= 9 ? '0' : ''}${date.getMinutes()}`;
    } if (date.getDate() !== now.getDate()) {
      return `${date.getYear() - 100}/${date.getMonth() <= 8 ? '0' : ''}${date.getMonth() + 1}/${date.getDate() <= 9 ? 0 : ''}${date.getDate()}`;
    }
  }

  render() {
    const { notice } = this.props;
    const icon = notice.from.profile ? `/files/profile/${notice.from.id}.png` : '/images/profile.png';
    return (
      <Link className='Notice-Item' to={links[notice.type](notice)}>
        <img className='item-icon' src={icon} alt='notice icon' />
        <div className='item-text'>
          { notice.text }
        </div>
        <div className='item-date'>
          { this.getDateString(notice.createdAt) }
        </div>
      </Link>
    );
  }
}

export default Item;
