import React, { Component } from 'react';
import {
  Link, NavLink, Redirect, Switch, Route,
} from 'react-router-dom';

import classNames from 'classnames/bind';
import Post from './Post';
import User from './User';

import styles from './Search.scss';

const cx = classNames.bind(styles);

const types = [{
  key: 'post',
  name: '게시글',
  link: '/post',
  component: Post,
}, {
  key: 'user',
  name: '사용자',
  link: '/user',
  component: User,
}];

class Search extends Component {
  constructor(props) {
    super(props);
    const { match: { params: { query = '' } } } = this.props;
    this.state = {
      input: query,
    };
  }

  handleChange = (e) => {
    this.setState({
      input: e.target.value,
    });
  }

  render() {
    const { input } = this.state;
    const { url, match: { params: { type, query = '' } } } = this.props;
    return (
      <div className='Search'>
        <div className='search-bar'>
          <input className='search-input' value={input} onChange={this.handleChange} />
          <Link className='search-submit' to={`${url}/${type}/${input}`}>검색</Link>
        </div>
        <div className='search-types'>
          { types.map(type => (
            <NavLink
              className='search-type'
              activeClassName={cx('search-type', 'search-type-active')}
              key={`search-type-${type.key}`}
              to={`${url}${type.link}/${query}`}
            >
              {type.name}
            </NavLink>
          ))}
        </div>
        <div className='search-body'>
          <Switch>
            { !type && (<Redirect to={`${url}${types[0].link}`} />) }
            { types.map(type => (
              <Route
                path={`${url}${type.link}/:query`}
                component={type.component}
                key={`search-route-${type.key}`}
              />
            ))}
          </Switch>
        </div>
      </div>
    );
  }
}

export default Search;
