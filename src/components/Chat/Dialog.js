import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './Dialog.scss';

const cx = classNames.bind(styles);

class Dialog extends Component {
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
    const {
      dialog, user, openChat, active,
    } = this.props;
    const my = user.id === dialog.from.id;
    const to = dialog.type === 'user' ? dialog.to : dialog.group;
    const from = dialog.type === 'user' ? dialog.from : dialog.group;
    const profileUri = dialog.type === 'user' && (my ? dialog.to.profile : dialog.from.profile) ? `/files/profile/${my ? dialog.to.id : dialog.from.id}.png` : '/images/profile.png';
    return (
      <div className={cx('Dialog', { 'Dialog-active': active })} onClick={() => { openChat(my ? to : from, dialog.type); }}>
        <div className='dialog-time'>
          { this.getDateString(dialog.createdAt) }
        </div>
        <img className='dialog-img' src={profileUri} alt={`${my ? to.name : from.name}'s profile`} />
        <div className='dialog-message-wrap'>
          <div className='dialog-message-name'>
            { my ? to.name : from.name }
          </div>
          <div className={cx('dialog-message-text', { 'dialog-message-text-hidden': !dialog.text && !dialog.file })}>
            { my ? `나 : ${dialog.text}` : dialog.text }
          </div>
        </div>
      </div>
    );
  }
}

export default Dialog;
