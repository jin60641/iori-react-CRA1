import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchResetPosts, fetchGetPosts, fetchWritePost } from '../../actions/newsfeed';
import './Newsfeed.css';
import Post from './Post';
import Write from './Write';

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
	componentWillUnmount = () => {
		this.props.fetchResetPosts();
	}
	componentWillReceiveProps = nextProps => {
		console.log(this.props.options,this.state.userId,nextProps.options);
		if( this.props.options.userId !== nextProps.options.userId ) {
			this.setState({
				userId : nextProps.options.userId
			});
		}
		if( this.props.posts.length !== nextProps.posts.length ){
			this.setState({ offset : nextProps.posts.length });
		}
		if( ( nextProps.isBottom && this.props.isBottom === false ) || ( this.props.posts.length !== 0 && nextProps.posts.length === 0 ) ){
			this.handleGetPosts();
		}
	}
	componentWillUpdate(nextState,nextProps){
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
		const { posts, fetchWritePost, options, user } = this.props;
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
const stateToProps = ({posts,user}) => ({posts,user});
const actionToProps = {
	fetchGetPosts,
	fetchWritePost,
	fetchResetPosts
}
export default connect(stateToProps, actionToProps)(Newsfeed);
