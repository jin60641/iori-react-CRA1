import React, { Component } from 'react';
import Menu from './Menu';
import { connect } from 'react-redux';
import { removePost } from '../../actions/newsfeed';
import { Link } from 'react-router-dom';
import './Post.css';

const stateToProps = ({user}) => ({user});
const actionToProps = {
  removePost : removePost.REQUEST,
}

@connect(stateToProps, actionToProps)
class Post extends Component {
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
      if( day === 1 ){
        return "어제";
      } else if( day <= 7 ){
        return day + "일 전";
      } else {
        return (date.getYear()+1900) +"년 " + (date.getMonth()+1) + "월 " + date.getDate() + "일";
      }
    }
  }
  handleClickRemove = () => {
    const { removePost, post, newsfeed } = this.props;
    removePost({ id : post.id, key : newsfeed })
  }
  render() {
    const { post, user } = this.props;
    if( post.deleted ){
      return (
        <div className="Post">
          <div className="post-inside">
            삭제되었습니다.
          </div>
        </div>
      );
    } else {
      const profileUri = post.user.profile?`/files/profile/${post.user.id}.png`:'/images/profile.png';
      return (
        <div className="Post">
          <Link to={`/@${post.user.handle}`} className="post-profile"> 
            <img src={profileUri} className="post-profile-img" alt={"profile"} />
          </Link>
          <Menu my={post.user.id === user.id} handleClickRemove={this.handleClickRemove}/>
          <div className="post-inform">
            <Link to={`/@${post.user.handle}`} className="post-user"> 
              {post.user.name} 
            </Link>
            <div className="post-date"> {this.getDateString(post.createdAt)} </div>
          </div>
          <div className="post-inside">
            { post.text }
          </div>
          { post.file ?
            <div className="post-img-outer">
              <img className="post-img-inner" src={`/files/post/${post.id}/1.png`} alt="post img" />
            </div>
            : null
          }
        </div>
      );
    }
  }
}

export default Post;

