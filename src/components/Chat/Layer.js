import React, { Component } from 'react';

import classNames from 'classnames/bind';
import styles from './Layer.scss';

const cx = classNames.bind(styles);

const initialState = {
  selected: {},
  query: '',
};

class Layer extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleClickLayer = () => {
    const { showChatLayer } = this.props;
    this.setState(initialState);
    showChatLayer(null);
  }

  handleSelect = (user) => {
    const prev = this.state.selected;
    let selected = {};
    if (this.props.type === 'user') {
      if (!prev[user.id]) {
        selected[user.id] = user;
      }
    } else {
      selected = Object.assign({}, prev);
      if (prev[user.id]) {
        delete selected[user.id];
      } else {
        selected[user.id] = user;
      }
    }
    this.setState({ selected });
  }

  handleSearch = (e) => {
    const { searchUsers } = this.props;
    const query = e.target.value;
    this.setState({
      query,
    });
    if (!query.length) {
      return null;
    }
    const data = { query };
    searchUsers(data);
  }

  handleClickInvite = () => {
    const { type, inviteUsers } = this.props;
    const { selected } = this.state;
    const keys = Object.keys(selected);
    if (!keys.length) {
      return false;
    }
    if (type === 'user') {
      inviteUsers([selected[keys[0]]]);
    } else if (type === 'group') {
      inviteUsers(keys.map(key => selected[key]));
    }
    this.handleClickLayer();
  }

  render() {
    const { showChatLayer, searched, type } = this.props;
    const { query, selected } = this.state;
    const selectedCount = Object.keys(selected).length;
    return (
      <div className='Layer' onClick={() => showChatLayer(null)}>
        <div className='layer-close' />
        <div className='layer-box' onClick={e => e.stopPropagation()}>
          <div className='layer-box-close' onClick={() => showChatLayer(null)} />
          <div className='layer-title'>
            { type === 'user'
              ? '1:1 대화'
              : `${selectedCount ? `${selectedCount}명` : '그룹'} 초대`
          }
          </div>
          <div className='layer-search-box'>
            <input type='text' className='layer-search' placeholder='검색' value={query} onChange={this.handleSearch} />
          </div>
          <div className='layer-list'>
            { query
              ? searched.users.map((user) => {
                if (user.id === this.props.user.id) return null;
                return (
                  <div className={cx('layer-list-item', { 'layer-list-item-active': selected[user.id] })} key={`layer-list-${user.id}`} onClick={() => this.handleSelect(user)}>
                    <img className='layer-list-img' src={user.profile ? `/files/profile/${user.id}.png` : '/images/profile.png'} alt="user's profile" />
                    <div className='layer-list-wrap'>
                      <div className='layer-list-name'>{user.name}</div>
                      <div className='layer-list-handle'>
@
                        {user.handle}
                      </div>
                    </div>
                  </div>
                );
              })
              : null
          }
          </div>
          <div className='layer-menu'>
            <div className={cx('layer-menu-item', 'layer-menu-active')} onClick={() => showChatLayer(null)}>취소</div>
            <div className={cx('layer-menu-item', { 'layer-menu-active': Object.keys(selected).length })} onClick={this.handleClickInvite}>초대</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Layer;
