import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getNotices } from '../../actions/notice';
import Item from './Item';

import styles from './Notice.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const limit = 20;
const types = [{
  key : 'all',
  name : '전체',
  link : ''
},{
  key : 'post',
  name : '게시글',
  link : '/post'
},{
  key : 'chat',
  name : '쪽지',
  link : '/chat'
},{
  key : 'follow',
  name : '팔로우',
  link : '/follow'
}];

const stateToProps = ({ notices, isFetching }) => ({ notices, isFetching });
const actionToProps = {
  getNotices : getNotices.REQUEST,
  resetNotices : getNotices.RESET
}

@connect(stateToProps,actionToProps)
class Notice extends Component {
  componentDidMount = () => {
    const { notices } = this.props;
    if( notices.length < limit ){
      this.handleGetNotices();
    }
  }
  componentDidUpdate = (prevProps,prevState) => {
    if( prevProps.match.params.type !== this.props.match.params.type ){
      const { resetNotices } = this.props;
      resetNotices();
    } else if( ( prevProps.notices.length && !this.props.notices.length ) || ( !prevProps.isBottom && this.props.isBottom ) ){
      this.handleGetNotices();
    }
  }
  handleGetNotices = (options = {}) => {
    const { getNotices, notices } = this.props;
    const { type } = this.props.match.params;
    getNotices({ limit, offset : notices.length, type });
  }
	render(){
    const { url, notices, isFetching } = this.props;
    const match = this.props.match.params.type;
    return (
		  <div className="Notice">
        <div className="notice-types">
          { types.map( type => (
            <Link to={`${url}${type.link}`} className={cx("notice-type",{"notice-type-active":!match&&type.key==='all'||match===type.key})} key={`notice-type-${type.key}`}>
              {type.name}
            </Link>
          ))}
        </div>
        { !isFetching.getNotices && ( notices.length ? 
          notices.map( notice => <Item notice={notice} key={`Notice-${notice.id}`} /> )
          : <div className="notice-none">
            알림이 존재하지 않습니다.
          </div> )
        }
			</div>
		);
	}
}

export default Notice;
