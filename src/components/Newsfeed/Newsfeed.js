import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchGetPosts, fetchWritePost } from '../../actions/newsfeed';
import './Newsfeed.css';
import Post from '../Post/Post';
import Write from '../Post/Write';

const initialState = {
	offset : 0,
	limit : 10
}
class Newsfeed extends Component {
	constructor(props) {
		super(props);
		this.state = Object.assign(
			this.props.options,
			initialState
		);
	}
	componentWillMount(){
	}
	componentDidMount(){
		if( this.props.posts.length === 0 ){
			this.handleGetPosts();
		}
	}
	componentWillReceiveProps(nextProps){
		const { options } = nextProps;
		this.setState({ offset : nextProps.posts.length });
		if( ( !this.state.userId && options && options.userId ) || ( !options && this.state.userId ) || 
			( options && options.userId && this.state.userId !== options.userId ) ){
			this.setState( Object.assign(this.state,nextProps.options)  );
			this.handleGetPosts();
		} else {
			if( nextProps.isBottom && this.props.isBottom === false ){
				this.handleGetPosts();
			}
		}
	}
	handleGetPosts = (options = {}) => {
		const { fetchGetPosts } = this.props;
		const data = Object.assign( this.state, options );
		fetchGetPosts(data)
			.then( (action) => {
				if( action.error ){
				}
			});
	}
	render() {
		const { posts, fetchWritePost, options } = this.props;
		return (
			<div className="Newsfeed">
				{ !options.userId ?
					<Write fetchWritePost={fetchWritePost} />
					: null
				}
				{ posts.map((post,i) => {
					return (<Post data={post} key={post.id} />);
				})}
			</div>
		);
	}
};
const stateToProps = ({posts}) => ({posts});
const actionToProps = {
	fetchGetPosts,
	fetchWritePost
}
export default connect(stateToProps, actionToProps)(Newsfeed);
