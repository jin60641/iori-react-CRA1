import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Newsfeed.css';
import Post from '../Post/Post';
import Write from '../Post/Write';

class Newsfeed extends Component {
	constructor(props) {
		super(props);
		console.log(this.props);
		const initialState = {
			offset : 0,
			limit : 10,
			handle : this.props.match.params.handle
		}
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
		this.setState({ offset : nextProps.posts.length });
		if( nextProps.isBottom && this.props.isBottom == false ){
			this.handleGetPosts();
		}
	}
	handleGetPosts = (options = {}) => {
		const { fetchGetPosts } = this.props;
		const data = Object.assign( this.state, options );
		fetchGetPosts(data)
			.then( (action) => {
				console.log(action);
				if( action.error ){
				}
			});
	}
	render() {
		const { posts, fetchWritePost } = this.props;
		const { handle } = this.state;
		return (
			<div className="Newsfeed">
				{ !handle ?
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
export default connect(stateToProps, undefined)(Newsfeed);
