import React, { Component } from 'react';
class PostImg extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { data } = this.props;
		if( data.file >= 1 ){
			return (
				<div className="PostImgBox">
					<img className="PostImg" src={`/files/post/${data.id}/1`} alt="PostImg" />
				</div>
			);
		} else {
			return(null);
		}
	}
}

export default PostImg;

