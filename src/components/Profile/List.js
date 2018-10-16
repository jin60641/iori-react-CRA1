import React, { Component } from 'react';
import { connect } from 'react-redux';
import { searchFollows } from '../../actions/search';

import UserCard from '../UserCard/UserCard';

import './List.scss';

const stateToProps = ({ searched }) => ({ follows: searched.follows });

const actionToProps = {
  searchFollows: searchFollows.REQUEST,
};

@connect(stateToProps, actionToProps)
class List extends Component {
  componentDidMount = () => {
    const { userId, searchFollows, tab } = this.props;
    const query = {
      type: tab === 'follower' ? 'to' : 'from',
      userId,
    };
    searchFollows(query);
  }

  render() {
    const { follows } = this.props;
    return (
      <div className='List'>
        { follows.map((user, i) => (<UserCard data={user} />))}
      </div>
    );
  }
}

export default List;
