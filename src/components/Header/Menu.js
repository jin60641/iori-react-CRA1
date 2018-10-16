import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import withClickOutside from 'react-click-outside';
import styles from './Menu.scss';

const cx = classNames.bind(styles);

const defaultProfileUri = '/images/profile.png';
class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
    };
  }

  handleClickOutside = () => {
    this.setState({ menu: false });
  }

  toggleMenu = () => {
    this.setState(state => ({
      menu: !state.menu,
    }));
  }

  render() {
    const { user, handleLogout } = this.props;
    const { menu } = this.state;
    if (user && user.verify) {
      return (
        <div className='Menu'>
          <img src={user.profile ? `/files/profile/${user.id}.png` : defaultProfileUri} className='menu-profile' onClick={this.toggleMenu} alt='your profile' />
          <div className={cx('menu-list', { 'menu-list-active': menu })} onClick={this.toggleMenu}>
            <div className='menu-caret'>
              {' '}
              <div className='menu-caret-outer' />
              {' '}
              <div className='menu-caret-inner' />
              {' '}
            </div>
            <Link to={`/@${user.handle}`} className='menu-list-item'>프로필</Link>
            <Link to='/setting' className='menu-list-item'>설정</Link>
            <div className='menu-list-item' onClick={handleLogout}>로그아웃</div>
          </div>
        </div>
      );
    }
    return (
      <Link to='/auth/login' className='Menu'>
        <img src={defaultProfileUri} className='menu-profile' alt='click to login' />
      </Link>
    );
  }
}

export default withClickOutside(Menu);
