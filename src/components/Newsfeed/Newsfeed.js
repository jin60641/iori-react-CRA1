import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchGetPosts } from '../../actions/newsfeed';
import './Newsfeed.css';
import Post from './Post';
import Write from './Write';

const initialState = {
	posts : [],
	offset : 0,
	limit : 10,
}
class Newsfeed extends Component {
	constructor(props) {
		super(props);
		this.state = initialState;
	}
	componentDidMount(){
		const { posts } = this.state;
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
		const { fetchGetPosts } = this.props;
		const { offset, limit } = this.state;
		const data = Object.assign( { offset, limit }, this.props.options, options );
		fetchGetPosts(data)
		.then( action => {
			if( !action.error ){
				this.setState( state => ({ 
					posts : state.posts.concat(action.payload),
					offset : offset + action.payload.length
				}));
			}
		});
	}
	handleRemovePost = deleted => {
		const { posts } = this.state;
        const index = posts.findIndex( post => post.id === deleted.id );
		this.setState({
        	posts : posts.slice(0,index).concat(deleted).concat(posts.slice(index+1))
		})
	}
	handleWritePost = post => {
		this.setState( state => ({
			posts : [post].concat(state.posts),
			offset : state.offset + 1
		}));
	}
	render() {
		const { posts } = this.state;
		const { user, write } = this.props;
		return (
			<div className="Newsfeed">
				{ write ? <Write handleWritePost={this.handleWritePost}/> : null }
				{ posts.map((post,i) => {
					return (<Post post={post} key={post.id} handleRemovePost={this.handleRemovePost}/>);
				})}
			</div>
		);
	}
};
const stateToProps = ({posts,user}) => ({posts,user});
const actionToProps = {
	fetchGetPosts,
}
export default connect(stateToProps, actionToProps)(Newsfeed);
