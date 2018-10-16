import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { searchUserByHandle } from '../../actions/search';
import { setProfile } from '../../actions/setting';
import { follow } from '../../actions/relation';

import Newsfeed from '../Newsfeed/Newsfeed';
import List from './List';
import styles from './Profile.scss';

const cx = classNames.bind(styles);

const initialImage = {
  img: new Image(),
  file: null,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  scale: 1,
};

const initialState = {
  isSetting: false,
  helper: null,
  moving: null,
  header: { ...initialImage },
  profile: { ...initialImage },
  tab: null,
};

const stateToProps = ({ searched, user, isFetching }) => ({ searched: searched.user, user, isFetching });

const actionToProps = {
  searchUserByHandle: searchUserByHandle.REQUEST,
  setProfile: setProfile.REQUEST,
  follow: follow.REQUEST,
};

@connect(stateToProps, actionToProps)
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = { ...initialState };
  }

  componentWillUnmount = () => {
    const { showScroll } = this.props;
    showScroll(true);
  }

  componentDidMount = () => {
    const { searchUserByHandle } = this.props;
    const { handle, tab } = this.props.match.params;
    searchUserByHandle({ query: handle });
    this.setState({ tab });
  }

  componentDidUpdate = (prevProps) => {
    const { handle, tab } = this.props.match.params;
    if (prevProps.match.params.handle !== handle) {
      const { searchUserByHandle } = this.props;
      searchUserByHandle({ query: handle });
    }
    if (prevProps.match.params.tab !== tab) {
      this.setState({ tab });
    }
    if (prevProps.searched.id !== this.props.searched.id ||
      prevProps.isFetching.setProfile !== this.props.isFetching.setProfile
    ) {
      this.getImage('profile');
      this.getImage('header');
    }
  }

  getImage = (type) => {
    const nextState = {};
    const { searched: user } = this.props;
    if (user[type]) {
      const img = new Image();
      img.src = `/files/${type}/${user.id}.png?${new Date().getTime()}`;
      img.onload = (e) => {
        const { width, height } = img;
        nextState[type] = {
          ...initialState[type], img, width, height,
        };
        initialState[type] = nextState[type];
        this.setState(nextState);
      };
    } else {
      nextState[type] = { ...initialImage };
      this.setState(nextState);
    }
  }

  handleClickSetting = (bool) => {
    const { showScroll, scrollToTop } = this.props;
    const nextState = {
      isSetting: bool,
      helper: null,
    };
    if (bool) {
      scrollToTop();
    } else {
      nextState.header = { ...initialState.header };
      nextState.profile = { ...initialState.profile };
    }
    showScroll(!bool);
    this.setState(nextState);
  }

  sendSetting = () => {
    const { setProfile } = this.props;
    const formData = new FormData();
    ['profile', 'header'].forEach((key) => {
      const {
        file, img, x, y, height, width, remove,
      } = this.state[key];
      const label = this.refs[key];
      if (file) {
        formData.append(key, file);
        formData.append(`${key}[crop]`, true);
        formData.append(`${key}[x]`, -x);
        formData.append(`${key}[y]`, -y);
        formData.append(`${key}[width]`, label.clientWidth / width * img.width);
        formData.append(`${key}[height]`, label.clientHeight / height * img.height);
      } else if (remove) {
        formData.append(`${key}[remove]`, true);
      }
    });
    setProfile(formData);
    this.handleClickSetting(false);
  }

  handleClickSettingSave = () => {
    const { showScroll } = this.props;
    showScroll(true);
    this.sendSetting();
  }

  handleClickRemove = (type) => {
    this.setState({ [type]: { ...initialImage, remove: true } });
  }

  handleClickHelper = (str) => {
    this.setState({
      helper: str,
    });
  }

  handleChangeFile = (e, type) => {
    const input = e.target;
    const reader = new FileReader();
    const file = input.files[0];
    reader.addEventListener('load', (event) => {
      const dataURL = event.target.result;
      const img = new Image();
      img.src = dataURL;
      img.onload = (e) => {
        const { width, height } = img;
        this.setState({
          [type]: {
            ...initialState[type], img, width, height, file, remove: false,
          },
        });
        this.handleMouseWheel(null, type);
      };
    });
    reader.readAsDataURL(file);
  }

  handleMouseDown = (type) => {
    this.setState({
      moving: type,
      helper: null,
    });
  }

  handleMouseUp = () => {
    this.setState({
      moving: null,
    });
  }

  handleMouseMove = (e, type, force) => {
    const label = this.refs[type];
    const moving = this.state.moving;
    const obj = this.state[type];
    let {
      x, y, img, width, height, scale,
    } = obj;
    if (force || (moving && type && moving === type && obj.img.src)) {
      if (!force) {
        y += e.nativeEvent.movementY * 2;
        x += e.nativeEvent.movementX * 2;
      }
      let direction;
      if (img.width < label.clientWidth || img.height < label.clientHeight) {
        direction = (img.width / label.clientWidth < img.height / label.clientHeight) ? 'width' : 'height';
      }

      if (x >= 0) {
        x = 0;
      } else if (x < label.clientWidth - width) {
        x = label.clientWidth - width;
      } else if (!direction && width >= label.clientWidth && x < -label.clientWidth - width) {
        x = -label.clientWidth - width;
      } else if (direction === 'height' && x < label.clientWidth - label.clientHeight / img.height * width) {
        x = label.clientWidth - label.clientHeight / img.height * width;
      } else if (direction === 'width' && x < label.clientWidth - label.clientWidth * scale) {
        x = label.clientWidth - label.clientWidth * scale;
      }

      if (y >= 0) {
        y = 0;
      } else if (y < label.clientHeight - height) {
        y = label.clientHeight - height;
      } else if (!direction && height >= label.clientHeight && y < -label.clientHeight - height) {
        y = -label.clientHeight - height;
      } else if (direction === 'width' && y < label.clientHeight - label.clientWidth / img.width * height) {
        y = label.clientHeight - label.clientWidth / img.width * height;
      } else if (direction === 'height' && y < label.clientHeight - label.clientHeight * scale) {
        y = label.clientHeight - height * scale;
      }
      const nextState = { ...this.state };
      nextState[type].x = x;
      nextState[type].y = y;
      this.setState(nextState);
    }
  }

  handleMouseWheel = (e, type) => {
    const { img, file } = this.state[type];
    if (e) {
      e.preventDefault();
    } else if (!file) {
      return 1;
    }
    const label = this.refs[type];
    const nextState = { ...this.state };
    let scale = nextState[type].scale - 0.001 * (e ? e.deltaY : 0);
    let direction;
    if (img.width * scale < label.clientWidth || img.height * scale < label.clientHeight) {
      direction = (img.width / label.clientWidth < img.height / label.clientHeight) ? 'width' : 'height';
    }
    if (direction === 'width') {
      scale = label.clientWidth / img.width;
    } else if (direction === 'height') {
      scale = label.clientHeight / img.height;
    }
    nextState[type].width = img.width * scale;
    nextState[type].height = img.height * scale;
    nextState[type].scale = scale;
    this.setState(nextState);
    this.handleMouseMove(null, type, true);
  }

  handleClickFollow = () => {
    const { follow, searched } = this.props;
    follow({ to: searched.id });
    // nextState.user.following = action.payload;
  }

  render() {
    const {
      isSetting, helper, header, moving, profile, tab,
    } = this.state;
    const { isTop, isBottom, searched: user } = this.props;
    if (!user.id) {
      return (null);
    }
    const my = user.id === this.props.user.id;
    const headerLabelStyle = {
      backgroundImage: (!isSetting || header.file) ? `url("${header.img.src}")` : 'none',
      backgroundPosition: `${header.x}px ${header.y}px`,
      backgroundSize: `${header.width}px ${header.height}px`,
    };
    const profileLabelStyle = {
      backgroundImage: (!isSetting || profile.file) ? `url("${profile.img.src}")` : 'none',
      backgroundPosition: `${profile.x}px ${profile.y}px`,
      backgroundSize: `${profile.width}px ${profile.height}px`,
    };
    return (
      <div>
        <div className={cx('Profile', { 'Profile-top': isTop, 'Profile-top-header': isTop && (isSetting || user.header) })}>
          <div className='profile-container'>
            <form className='profile-header'>
              <div className={cx('profile-label', { 'profile-label-active': isSetting, 'profile-label-uploaded': header.img.src })} style={headerLabelStyle} ref='header' onMouseMove={e => this.handleMouseMove(e, 'header')} onMouseDown={() => this.handleMouseDown('header')} onMouseUp={this.handleMouseUp} onWheel={e => this.handleMouseWheel(e, 'header')}>
                <div className={cx('profile-helper', { 'profile-helper-clicked': helper === 'header', 'profile-helper-active': !moving })} onMouseDown={e => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); this.handleClickHelper('header'); }}>
                  <div className='profile-helper-menu' onClick={(e) => { e.stopPropagation(); this.handleClickHelper(''); return 0; }}>
                    <div className='profile-caret'>
                      <div className='profile-caret-outer' />
                      <div className='profile-caret-inner' />
                    </div>
                    { header.img.src
                      ? (
                        <div>
                          <label className='profile-helper-menu-item' htmlFor='profile-header-file'>
                        변경

                          </label>
                          <div className='profile-helper-menu-item' onClick={() => this.handleClickRemove('header')}>
                        삭제

                          </div>
                        </div>
                      )
                      : (
                        <div>
                          <label className='profile-helper-menu-item' htmlFor='profile-header-file'>
                        추가

                          </label>
                        </div>
                      )
                  }
                  </div>
                </div>
              </div>
              { header.img.src
                ? <div className='profile-header-back' style={{ backgroundImage: `url(${header.img.src})` }} />
                : <div className='profile-header-back' />
              }
              <input className='profile-header-file' id='profile-header-file' type='file' onChange={e => this.handleChangeFile(e, 'header')} />
            </form>
            <form className={cx('profile-img', { 'profile-img-setting': isSetting })}>
              <div className={cx('profile-label', { 'profile-label-active': isSetting, 'profile-label-uploaded': profile.img.src })} style={profileLabelStyle} ref='profile' onMouseMove={e => this.handleMouseMove(e, 'profile')} onMouseDown={() => this.handleMouseDown('profile')} onMouseUp={this.handleMouseUp} onWheel={e => this.handleMouseWheel(e, 'profile')}>
                <div className={cx('profile-helper', { 'profile-helper-clicked': helper === 'profile', 'profile-helper-active': !moving })} onMouseDown={e => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); this.handleClickHelper('profile'); }}>
                  <div className='profile-helper-menu' onClick={(e) => { e.stopPropagation(); this.handleClickHelper(''); return 0; }}>
                    <div className='profile-caret'>
                      <div className='profile-caret-outer' />
                      <div className='profile-caret-inner' />
                    </div>
                    { profile.img.src
                      ? (
                        <div>
                          <label className='profile-helper-menu-item' htmlFor='profile-img-file'>
                        변경

                          </label>
                          <div className='profile-helper-menu-item' onClick={() => this.handleClickRemove('profile')}>
                        삭제

                          </div>
                        </div>
                      )
                      : (
                        <div>
                          <label className='profile-helper-menu-item' htmlFor='profile-img-file'>
                        추가

                          </label>
                        </div>
                      )
                  }
                  </div>
                </div>
              </div>
              { profile.img.src
                ? <div className='profile-img-back' style={{ backgroundImage: `url(${profile.img.src})` }} />
                : <div className='profile-img-back' style={{ backgroundImage: "url('/images/profile.png')" }} />
              }
              <input className='profile-img-file' type='file' id='profile-img-file' onChange={e => this.handleChangeFile(e, 'profile')} />
            </form>
            <div className='profile-nav'>
              <div className={cx('profile-nav-user', { 'profile-nav-user-top': isTop })}>
                <div className='profile-nav-handle'>
@
                  {user.handle}
                </div>
                <div className='profile-nav-name'>{user.name}</div>
              </div>
              { my
                ? (
                  <div className='profile-btns'>
                    <div className={cx('profile-btn', { 'profile-btn-active': !isSetting })} onClick={() => this.handleClickSetting(true)}>
                  프로필 설정

                    </div>
                    <div className={cx('profile-btn', { 'profile-btn-active': isSetting })} onClick={() => this.handleClickSetting(false)}>
                  설정 취소

                    </div>
                    <div className={cx('profile-btn', { 'profile-btn-active': isSetting })} onClick={this.handleClickSettingSave}>
                  설정 저장

                    </div>
                  </div>
                )
                : (
                  <div className='profile-btns'>
                    { user.verify
                      ? (
                        <div className={cx('profile-btn', 'profile-btn-active')} onClick={this.handleClickFollow}>
                          { user.following ? '언팔로우' : '팔로우' }
                        </div>
                      )
                      : (
                        <Link to='/auth/login' className={cx('profile-btn', 'profile-btn-active')}>
                  팔로우

                        </Link>
                      )
              }
                    <Link to={`/chat/@${user.handle}`} className={cx('profile-btn', 'profile-btn-active')}>
                  쪽지

                    </Link>
                  </div>
                )
            }
            </div>
          </div>
        </div>
        { !tab
          ? (
            <Newsfeed
              key={`Profile-${user.id}`}
              id={user.id}
              isBottom={isBottom}
              options={{ userId: user.id }}
            />
          )
          : (
            <List
              tab={tab}
              userId={user.id}
            />
          )
        }
      </div>
    );
  }
}

export default Profile;
