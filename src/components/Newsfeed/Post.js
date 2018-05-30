import React, { Component } from 'react';
import Menu from './Menu';
import { Link } from 'react-router-dom';
import './Post.css';

class Post extends Component {
	constructor(props) {
		super(props);
	}
	getDateString(str){
		let date = new Date(str);
		let now = new Date();
		let gap = Math.floor(now.getTime()/1000) - Math.floor(date.getTime()/1000);
		if( gap < 60 ){
			return "방금";
		} else if( gap < 3600 ){
			return Math.floor(gap/60)+"분 전";
		} else if( gap < 86400 ){
			return Math.floor(gap/60/60)+"시간 전";
		} else {
			let day = Math.floor(gap/60/60/24);
			if( day == 1 ){
				return "어제";
			} else if( day <= 7 ){
				return day + "일 전";
			} else {
				return (date.getYear()+1900) +"년 " + (date.getMonth()+1) + "월 " + date.getDate() + "일";
			}
		}
	}
	render() {
		let { data, user, fetchRemovePost } = this.props;
		data = JSON.parse(JSON.stringify(data));
		if( data.deleted ){
			return (
				<div className="Post">
					<div className="post-inside">
						삭제되었습니다.
					</div>
				</div>
			);
		} else {
			const profileUri = data.user.profile?`/files/profile/${data.user.id}.png`:'/images/profile.png';
			return (
				<div className="Post">
					<Link to={`/@${data.user.handle}`} className="post-profile"> 
						<img src={profileUri} className="post-profile-img" alt={"profile"} />
					</Link>
					<Menu my={data.user.id === user.id} pid={data.id} fetchRemovePost={fetchRemovePost}/>
					<div className="post-inform">
						<Link to={`/@${data.user.handle}`} className="post-user"> 
							{data.user.name} 
						</Link>
						<div className="post-date"> {this.getDateString(data.createdAt)} </div>
					</div>
					<div className="post-inside">
						{ data.text }
					</div>
					{ data.file ?
						<div className="post-img-outer">
							<img className="post-img-inner" src={`/files/post/${data.id}/1.png`} alt="post img" />
						</div>
						: null
					}
				</div>
			);
		}
	}
}

export default Post;

