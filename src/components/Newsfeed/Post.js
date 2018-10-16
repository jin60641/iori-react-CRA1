import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import Menu from './Menu';
import Preview from '../Preview/Preview';
import { getPosts, removePost, hidePost } from '../../actions/newsfeed';
import { getLink } from '../../actions/link';
import style from './Post.scss';

const cx = classNames.bind(style);

const initialState = {
  link: null,
};

const linkRegex = /((?:(?:http|https)):\/\/(?:[\w-]+(?:\.[\w-]+)+(?:[\w.@?^=%&amp;:/~+#-])*[\w@?^=%&amp;/~+#-]))/gi;

const stateToProps = ({ user, posts, links }, props) => ({ user, post: props.post ? props.post : posts.detail, links });
const actionToProps = {
  getPost: getPosts.REQUEST,
  resetPost: getPosts.RESET,
  removePost: removePost.REQUEST,
  hidePost: hidePost.REQUEST,
  getLink: getLink.REQUEST,
};

@connect(stateToProps, actionToProps)
class Post extends Component {
  constructor(props) {
    super(props);
    this.state = { ...initialState };
  }

  componentDidMount = () => {
    const { post, getPost } = this.props;
    const id = this.props.match ? this.props.match.params.id : null;
    if ((!post && id) || (post && id && id !== post.id)) {
      getPost({ key: 'detail', id });
    } else {
      this.init();
    }
  }

  init() {
    const { getLink, post: { text } } = this.props;
    const match = text.match(linkRegex);
    if (match) {
      const [link] = match;
      this.setState({
        link,
      });
      getLink({ link });
    }
  }

  componentWillUnmount = () => {
    const { resetPost } = this.props;
    resetPost('detail');
  }

  getDateString(str) {
    const date = new Date(str);
    const now = new Date();
    const gap = Math.floor(now.getTime() / 1000) - Math.floor(date.getTime() / 1000);
    if (gap < 60) {
      return '방금';
    } if (gap < 3600) {
      return `${Math.floor(gap / 60)}분 전`;
    } if (gap < 86400) {
      return `${Math.floor(gap / 60 / 60)}시간 전`;
    }
    const day = Math.floor(gap / 60 / 60 / 24);
    if (day === 1) {
      return '어제';
    } if (day <= 7) {
      return `${day}일 전`;
    }
    return `${date.getYear() + 1900}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  }

  componentDidUpdate = (prevProps) => {
    if (!prevProps.post.id && this.props.post.id) {
      this.init();
    }
  }

  handleClickRemove = () => {
    const { removePost, post, newsfeed } = this.props;
    removePost({ id: post.id, key: newsfeed });
  }

  handleClickHide = () => {
    const { hidePost, post, newsfeed } = this.props;
    hidePost({ id: post.id, key: newsfeed });
  }

  shouldComponentUpdate = (nextProps, nextState) => (
    nextProps.post.id !== this.props.post.id ||
      nextProps.post.deleted !== this.props.post.deleted ||
      (!this.state.link && !!nextState.link) ||
      (!!this.state.link && !!nextProps.links[this.state.link] && !this.props.links[this.state.link])
  )

  render() {
    const { link } = this.state;
    const {
      post, user, delay, animation, top, links,
    } = this.props;
    if (!post.id) {
      return null;
    }
    const my = post.user.id === user.id;
    if (post.deleted) {
      return (
        <div className='Post'>
          <div className='post-inside'>
            { my ? '삭제되었습니다.' : '더 이상 이 게시글이 표시되지 않습니다.' }
            <div className='post-delete-cancel' onClick={my ? this.handleClickRemove : this.handleClickHide}>
              취소
            </div>
          </div>
        </div>
      );
    }
    const profileUri = post.user.profile ? `/files/profile/${post.user.id}.png` : '/images/profile.png';
    return (
      <div className={cx('Post', { 'Post-animation': animation && !top, 'Post-top': top })} style={{ animationDelay: `${0.05 * delay}s` }}>
        <Link to={`/@${post.user.handle}`} className='post-profile'>
          <img src={profileUri} className='post-profile-img' alt='profile' />
        </Link>
        <Menu
          my={my}
          handleClickRemove={this.handleClickRemove}
          handleClickHide={this.handleClickHide}
        />
        <div className='post-inform'>
          <Link to={`/@${post.user.handle}`} className='post-user'>
            {post.user.name}
          </Link>
          <div className='post-date'>
            {' '}
            {this.getDateString(post.createdAt)}
            {' '}
          </div>
        </div>
        <div className='post-inside'>
          { post.text.split('\n').map((line, i) => {
            const key = `post-${post.id}-text-${i}`;
            return (
              <div key={key}>
                { link
                  ? line.split(linkRegex).map((word, j) => (linkRegex.test(word)
                    ? <a href={word} key={`${key}-${j}`} target='_blank' rel='noopener noreferrer'>{word}</a>
                    : <span key={`${key}-${j}`}>{word}</span>))
                  : <span>{line}</span>
              }
              </div>
            );
          })}
        </div>
        { link ? <Preview {...links[link]} link={link} imgHeight={300} />
          : (post.file
            ? (
              <div className='post-img-outer'>
                <img className='post-img-inner' src={`/files/post/${post.id}/1.png`} alt='post img' />
              </div>
            ) : null)
          }
      </div>
    );
  }
}

export default Post;
