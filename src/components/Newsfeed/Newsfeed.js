import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPosts } from '../../actions/newsfeed';
import './Newsfeed.css';
import Post from './Post';
import Write from './Write';

const initialState = {
	limit : 10,
  animation : false
}

const stateToProps = ({posts,user},props) => ({posts : posts[props.id]?posts[props.id]:[],user});
const actionToProps = {
	getPosts : getPosts.REQUEST,
}

@connect(stateToProps,actionToProps)
class Newsfeed extends Component {
	constructor(props) {
		super(props);
		this.state = { ...initialState, animation : !this.props.posts.length };
	}
	componentDidMount(){
		const { posts } = this.props;
		if( posts.length === 0 ){
			this.handleGetPosts();
		}
	}
	componentDidUpdate = (prevProps,prevState) => {
		if( !prevProps.isBottom && this.props.isBottom ){
			this.handleGetPosts();
		}
	}
	handleGetPosts = (options = {}) => {
    this.setState({ animation : true });
		const { getPosts, id, posts } = this.props;
		const { limit } = this.state;
		const data = Object.assign( { key : id, limit, offset : posts.length }, this.props.options, options );
		getPosts(data);
	}
	render() {
		const { write, id, posts } = this.props;
		const { limit, animation } = this.state;
		return (
			<div className="Newsfeed">
				{ write ? <Write /> : null }
				{ posts.map((post,i) => (<Post post={post} key={`${id}-${post.id}`} newsfeed={id} delay={i<limit?i:0} animation={animation} />) ) }
			</div>
		);
	}
};

export default Newsfeed;
