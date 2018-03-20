import React, { Component } from 'react';
import styles from './Write.css';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
const initialState = {
	text : "",
	files : []
}

class PostWrite extends Component {
	constructor(props) {
		super(props);
		this.state = initialState;
	}
	handleSubmit = () => {
		const { fetchWritePost } = this.props;
		const { text, files } = this.state;
		let formData = new FormData();
		if( !( text.length || files.length ) ){
			return 0;
		}
		formData.append("text",text);
		Array.from(files).forEach( file => {
			formData.append('file',file.data);
		})
		this.setState(initialState);
		fetchWritePost(formData)
			.then( (action) => {
				if( action.error ){
				} else {
				}
			});
	}
	handleChangeText = (e) => {
		this.setState({ text : e.target.value })
	}
	handleChangeFile = (e) => {
		e.preventDefault();
		const files = e.target.files;
		Array.from(files).forEach( file => {
			const reader = new FileReader();
			reader.onloadend = () => {
				this.setState({
					files: this.state.files.concat([{ data : file, url : reader.result }])
				});
			}
			reader.readAsDataURL(file)
		});
	}
	render() {
		return (
			<div className="Write">
				<textarea className="write-text" value={this.state.text} onChange={this.handleChangeText} placeholder="글을 입력하세요" />
				<div className="write-preview">
					{ this.state.files.map((file) => {
						return (<img key={ file.url }src={ file.url } className="write-img" alt="write-img" />);
					})}
				</div>
				<div className="write-submit" onClick={ this.handleSubmit } > 게시 </div>
				<label className="write-label" htmlFor="file" />
				<input ref="file" id="file" type="file" className="write-file" multiple onChange={this.handleChangeFile} />
			</div>
		);
	}
}

export default PostWrite;

