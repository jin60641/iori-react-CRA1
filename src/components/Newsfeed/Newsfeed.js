import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Newsfeed.css';
import Post from '../Post/Post';
import PostWrite from '../Post/PostWrite';

class Newsfeed extends Component {
	constructor(props) {
		super(props);
		const initialState = {
			skip : 0,
			limit : 10
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
		this.setState({ skip : nextProps.posts.length });
		if( nextProps.isBottom && this.props.isBottom == false ){
			this.handleGetPosts();
		}
	}
	handleGetPosts = (options = {}) => {
		const { fetchGetPosts } = this.props;
		this.setState({ skip : this.state.skip + this.state.limit });
		const data = Object.assign( this.state, options );
		fetchGetPosts(data)
			.then( (action) => {
				console.log(action);
				if( action.error ){
				}
			});
	}
	render() {
		return (
			<div className="Newsfeed">
				<PostWrite fetchWritePost={this.props.fetchWritePost} />
				{ this.props.posts.map((post,i) => {
					return (<Post data={post} key={post.id} />);
				})}
			</div>
		);
	}
};
const stateToProps = ({posts}) => ({posts});
export default connect(stateToProps, undefined)(Newsfeed);
