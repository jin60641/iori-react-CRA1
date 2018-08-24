import React, { Component } from 'react';
import { connect } from 'react-redux';

const stateToProps = ({user}) => ({user})
const actionToProps = {
}
@connect(stateToProps,actionToProps)
class Search extends Component {
  render(){
    return (
      null
    );
  }
}

export default Search;
