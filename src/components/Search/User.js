import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { searchUsers } from '../../actions/search';

import UserCard from '../UserCard/UserCard';

const stateToProps = ({ searched : { users }, isFetching }) => ({ users, isFetching })
const actionToProps = {
  searchUsers : searchUsers.REQUEST,
}

@withRouter
@connect(stateToProps,actionToProps)
class User extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount = () => {
    this.init();
  }
  shouldComponentUpdate(nextProps){
    return ( this.props.match.params.query !== nextProps.match.params.query || ( this.props.isFetching.searchUsers && !nextProps.isFetching.searchUsers ) );
  }
  componentDidUpdate = () => {
    this.init();
  }
  init = () => {
    const { match : { params : { query } }, searchUsers } = this.props;
    searchUsers({ query });
  }
  render(){
    const { users } = this.props;
    return users.map( user => (<UserCard user={user} />) );
  }
}

export default User;
