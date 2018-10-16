import React, { Component } from 'react';
import Newsfeed from '../Newsfeed/Newsfeed';

class Post extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.match.params.query !== nextProps.match.params.query;
  }

  render() {
    const { match: { params: { query } } } = this.props;
    return (
      <Newsfeed options={{ text: query }} id={`Search#${query}`} />
    );
  }
}
export default Post;
