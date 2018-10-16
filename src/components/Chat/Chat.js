import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import classNames from 'classnames/bind';
import Dialog from './Dialog';
import Panel from './Panel';
import Layer from './Layer';

import { searchGroupById, searchUserByHandle, searchUsers } from '../../actions/search';
import {
  sendChat, getChats, getDialogs, makeGroup,
} from '../../actions/chat';

import styles from './Chat.scss';

const cx = classNames.bind(styles);

const charToStr = {
  '@': 'user',
  $: 'group',
};
const strToChar = {
  user: '@',
  group: '$',
};

const initialState = {
  menu: false,
  layer: null,
  chats: {},
  type: null,
  to: null,
  text: '',
  height: 17,
  loading: false,
};

const limit = 30;

const stateToProps = ({
  dialogs, searched, chats, isFetching, user,
}) => ({
  dialogs, searched, chats, isFetching, user,
});
const actionToProps = {
  searchUserByHandle: searchUserByHandle.REQUEST,
  searchUsers: searchUsers.REQUEST,
  searchGroupById: searchGroupById.REQUEST,
  sendChat: sendChat.REQUEST,
  getChats: getChats.REQUEST,
  getDialogs: getDialogs.REQUEST,
  makeGroup: makeGroup.REQUEST,
};

@connect(stateToProps, actionToProps)
class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = { ...initialState };
  }

  getFullHandle = (type, handle) => strToChar[type] + handle

  componentWillUnmount = () => {
    const { showScroll } = this.props;
    showScroll(true);
  }

  componentDidMount = (e) => {
    const {
      showScroll, searchGroupById, searchUserByHandle, getDialogs, searched,
    } = this.props;
    showScroll(false);
    getDialogs();
    const chatHandle = this.props.match.params.handle;
    if (chatHandle) {
      const type = charToStr[chatHandle[0]];
      const handle = chatHandle.substr(1);
      const data = {
        query: handle,
      };
      if (type === 'user') {
        if (searched.user.handle === handle) {
          this.openChat(this.props.searched.user, 'user');
        } else {
          searchUserByHandle(data);
        }
      } else if (searched.group.handle === handle) {
        this.openChat(this.props.searched.group, 'group');
      } else {
        searchGroupById(data);
      }
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.match.params.handle && !this.props.match.params.handle) {
      this.setState({ ...initialState });
    } else if (prevProps.searched.user.id !== this.props.searched.user.id) {
      this.openChat(this.props.searched.user, 'user');
    } else if (prevProps.searched.group.id !== this.props.searched.group.id) {
      this.openChat(this.props.searched.group, 'group');
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.isFetching.getChats && prevState.loading) {
      return {
        loading: false,
      };
    }
    return null;
  }

  getChats = () => {
    const { getChats } = this.props;
    const { to: from, type, loading } = this.state;
    const chats = this.props.chats[this.getFullHandle(type, from.handle)];
    if (!loading) {
      this.setState({
        loading: true,
      });
      getChats({
        from, type, limit, offset: chats ? chats.length : 0,
      });
    }
  }

  handleScrollTop = () => {
    const { to } = this.state;
    if (to) {
      this.setState({ loading: true });
      this.getChats();
    }
  }

  handleClickMenu = (e) => {
    e.stopPropagation();
    this.showChatMenu(true);
  }

  showChatMenu = (bool) => {
    this.setState({
      menu: bool,
    });
  }

  handleClickNew = (e, type) => {
    e.stopPropagation();
    this.showChatMenu(false);
    this.showChatLayer(type);
  }

  showChatLayer = (type) => {
    this.setState({
      layer: type,
    });
  }

  openChat = (to, type) => {
    const { history, chats } = this.props;
    history.push(`/chat/${this.getFullHandle(type, to.handle)}`);
    this.setState({
      layerSelected: {},
      layer: null,
      type,
      to,
    }, () => {
      const chatArray = chats[this.getFullHandle(type, to.handle)];
      if (!chatArray || chatArray.length < limit) {
        this.getChats();
      }
    });
  }

  inviteUsers = (users) => {
    const { layer } = this.state;
    if (layer === 'user') {
      this.openChat(users[0], layer);
    } else if (layer === 'group') {
      const { makeGroup } = this.props;
      makeGroup({ userIds: users.map(user => user.id) });
    }
  }

  handleClickOutside = () => {
    this.hideAll();
  }

  hideAll = () => {
    this.showChatMenu(false);
    this.showChatLayer(null);
  }

  sendChat = (file) => {
    const { sendChat } = this.props;
    const { text, to, type } = this.state;
    const formData = new FormData();
    formData.append('to', to.id);
    formData.append('type', type);
    if (!file) {
      formData.append('text', text);
      this.setState({
        text: '',
      });
    } else {
      formData.append('text', '');
      formData.append('file', file);
    }
    sendChat(formData);
  }

  handleClickSend = () => {
    const { text } = this.state;
    if (!text.length) {
      return 0;
    }
    this.sendChat();
  }

  handleChangeFile = (e) => {
    e.preventDefault();
    const { files } = e.target;
    Array.from(files).forEach((file) => {
      this.sendChat(file);
    });
    e.target.value = '';
  }

  handleChangeText = (e) => {
    this.setState({
      text: e.target.value,
    });
  }

  handleChatKeyDown = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      this.handleClickSend();
      e.preventDefault();
    }
    this.setPanelHeight();
  }

  setPanelHeight = () => {
    this.textarea.style.height = '0px';
    const height = Math.max(this.textarea.scrollHeight - 12, initialState.height);
    this.setState({
      height,
    });
    this.textarea.style.height = `${height}px`;
  }

  render() {
    const {
      searchUsers, searched, chats, user, dialogs,
    } = this.props;
    const {
      to, menu, layer, type, text, height,
    } = this.state;
    return (
      <div className={cx('Chat', { 'Chat-default': !type })}>
        <div className='chat-wrap' onClick={this.handleClickOutside}>
          <div className='chat-header'>
            <Link to='/chat' className={cx('chat-back', 'chat-header-div')} />
            <div className={cx('chat-menu', 'chat-header-div')} onClick={this.handleClickMenu}>
              <div className='chat-menu-text'>
                새 메시지

              </div>
              <div className={cx('chat-menu-box', { 'chat-menu-box-active': menu })}>
                <div className={cx('chat-menu-box-div', 'chat-new-user')} onClick={(e) => { this.handleClickNew(e, 'user'); }}>
                  1:1 시작하기

                </div>
                <div className={cx('chat-menu-box-div', 'chat-new-group')} onClick={(e) => { this.handleClickNew(e, 'group'); }}>
                  그룹생성

                </div>
              </div>
            </div>
            { type === 'user' ? (
              <Link to={`/@${to.handle}`} className={cx('chat-title', 'chat-header-div')}>
                { to.name }
                <span className='chat-title-span' />
              </Link>
            ) : (
              <div className={cx('chat-title', 'chat-header-div')}>
                { to ? to.name : '' }
                <span className='chat-title-span' />
              </div>
            )
            }
          </div>
          <div className='chat-dialog'>
            <div className={cx('Dialog', 'chat-dialog-search')}>
              <input type='text' className='chat-search' placeholder='검색' />
            </div>
            <div className='chat-dialog-box'>
              { dialogs.map(dialog => (<Dialog cx={cx} user={user} active={to ? (this.getFullHandle(dialog.type, to.handle) === dialog.handle) : false} dialog={dialog} key={`dialog-${dialog.id}`} openChat={this.openChat} />))}
            </div>
          </div>
          {
            type
              ? (
                <div className='chat-box'>
                  <Panel chats={chats} to={to} cx={cx} user={user} handleScrollTop={this.handleScrollTop} handle={this.getFullHandle(type, to.handle)} height={height + 30} />
                  <div className='send-panel' style={{ height: `${height + 30}px` }}>
                    <div className='send-panel-wrap'>
                      <textarea
                        ref={dom => this.textarea = dom}
                        className='send-textarea'
                        value={text}
                        placeholder='메시지를 입력하세요'
                        onChange={this.handleChangeText}
                        onKeyUp={this.setPanelHeight}
                        onKeyDown={this.handleChatKeyDown}
                      />
                      <label className='send-file-label' htmlFor='chat-file' />
                      <input className='send-file-input' id='chat-file' type='file' onChange={this.handleChangeFile} multiple />
                      <div className='send-btn' onClick={this.handleClickSend}>
                      전송

                      </div>
                    </div>
                  </div>
                </div>
              )
              : (
                <div className='chat-box'>
                새 메시지나 검색을 통해 대화를 시작해보세요

                </div>
              )
          }
        </div>
        { layer && (<Layer user={user} type={layer} showChatLayer={this.showChatLayer} searchUsers={searchUsers} searched={searched} inviteUsers={this.inviteUsers} />) }
      </div>
    );
  }
}

export default Chat;
