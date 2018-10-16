import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPosts } from '../../actions/newsfeed';
import './Newsfeed.scss';
import Post from './Post';
import Write from './Write';

const initialState = {
  limit: 10,
};
const stateToProps = ({ posts, user }, props) => ({ posts: posts[props.id] ? posts[props.id] : [], user });
const actionToProps = {
  getPosts: getPosts.REQUEST,
};

@connect(stateToProps, actionToProps)
class Newsfeed extends Component {
  constructor(props) {
    super(props);
    const { posts } = this.props;
    if (posts.length) {
      this.state = { ...initialState, top: posts[0].id, bottom: posts[posts.length - 1].id };
    } else {
      this.state = { ...initialState };
    }
  }

  componentDidMount() {
    const { posts } = this.props;
    if (posts.length === 0) {
      this.handleGetPosts();
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if ((prevProps.id !== this.props.id) || (!prevProps.isBottom && this.props.isBottom)) {
      this.handleGetPosts();
    }
    if (prevProps.posts.length && prevProps.posts.length !== this.props.posts.length) {
      this.setState({
        top: prevProps.posts[0].id, bottom: prevProps.posts[prevProps.posts.length - 1].id,
      });
    }
  }

  handleGetPosts = (options = {}) => {
    const { getPosts, id, posts } = this.props;
    const { limit } = this.state;
    const data = Object.assign({ key: id, limit, offset: posts.length }, this.props.options, options);
    getPosts(data);
  }

  render() {
    const { write, id, posts } = this.props;
    const { limit, top, bottom } = this.state;
    return (
      <div className='Newsfeed'>
        { write ? <Write /> : null }
        { posts.map((post, i) => (<Post post={post} key={`${id}-${post.id}`} newsfeed={id} delay={i < limit ? i : 0} animation={!bottom || bottom > post.id || post.id > top} />)) }
      </div>
    );
  }
}

export default Newsfeed;
