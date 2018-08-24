import React, { Component } from 'react';
import Menu from './Menu';
import { connect } from 'react-redux';
import { getPosts, removePost, hidePost } from '../../actions/newsfeed';
import { Link } from 'react-router-dom';
import style from './Post.css';
import classNames from 'classnames/bind';
const cx = classNames.bind(style);

const stateToProps = ({user,posts},props) => ({user,post : props.post?props.post:posts.detail});
const actionToProps = {
  getPost : getPosts.REQUEST,
  resetPost : getPosts.RESET,
  removePost : removePost.REQUEST,
  hidePost : hidePost.REQUEST
}

@connect(stateToProps, actionToProps)
class Post extends Component {
  componentDidMount = () => {
    const { post, getPost } = this.props;
    const id = this.props.match?this.props.match.params.id:null;
    if( ( !post && id ) || ( post && id && id !== post.id ) ){
      getPost({ key : 'detail', id });
    }
  }
  componentWillUnmount = () => {
    const { resetPost } = this.props;
    resetPost('detail');
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
  handleClickHide = () => {
    const { hidePost, post, newsfeed } = this.props;
    hidePost({ id : post.id, key : newsfeed })
  }
  render() {
    const { post, user, delay, animation, top } = this.props;
    if( !post ){
      return null;
    }
    const my= post.user.id === user.id;
    if( post.deleted ){
      return (
        <div className="Post">
          <div className="post-inside">
            { my? "삭제되었습니다." : "더 이상 이 게시글이 표시되지 않습니다." }
            <div className="post-delete-cancel" onClick={my?this.handleClickRemove:this.handleClickHide}>
              취소
            </div>
          </div>
        </div>
      );
    } else {
      const profileUri = post.user.profile?`/files/profile/${post.user.id}.png`:'/images/profile.png';
      const linkRegex = /((?:(?:http|https)):\/\/(?:[\w-]+(?:\.[\w-]+)+(?:[\w.@?^=%&amp;:\/~+#-])*[\w@?^=%&amp;\/~+#-]))/gi;
      return (
        <div className={cx("Post",{"Post-animation":animation&&!top,"Post-top":top})} style={ { animationDelay : 0.05*delay+'s'} }>
          <Link to={`/@${post.user.handle}`} className="post-profile"> 
            <img src={profileUri} className="post-profile-img" alt={"profile"} />
          </Link>
          <Menu 
            my={my} 
            handleClickRemove={this.handleClickRemove} 
            handleClickHide={this.handleClickHide} 
          />
          <div className="post-inform">
            <Link to={`/@${post.user.handle}`} className="post-user"> 
              {post.user.name} 
            </Link>
            <div className="post-date"> {this.getDateString(post.createdAt)} </div>
          </div>
          <div className="post-inside">
            { post.text.split('\n').map( line => 
              line.split(linkRegex).map( link => {
                if( linkRegex.test(link) ) {
                  return (<a href={link} target="_blank">{link}</a>);
                } else if( link ){
                  return (<span>{link}</span>)
                }
              })
            )}
          </div>
          { post.file ?
            <div className="post-img-outer">
              <img className="post-img-inner" src={`/files/post/${post.id}/1.png`} alt="post img" />
            </div> : null
          }
        </div>
      );
    }
  }
}

export default Post;

