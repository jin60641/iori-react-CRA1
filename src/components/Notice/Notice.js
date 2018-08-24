import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Notice.css';

import { getNotices } from '../../actions/notice';
import Item from './Item';

const stateToProps = ({ notices }) => ({ notices });
const actionToProps = {
  getNotices : getNotices.REQUEST
}

const limit = 20;

@connect(stateToProps,actionToProps)
class Notice extends Component {
  componentDidMount = () => {
    const { notices } = this.props;
    if( notices.length < limit ){
      this.handleGetNotices();
    }
  }
  componentDidUpdate = (prevProps,prevState) => {
    if( !prevProps.isBottom && this.props.isBottom ){
      this.handleGetNotices();
    }
  }
  handleGetNotices = (options = {}) => {
    const { getNotices, notices } = this.props;
    getNotices({ limit, offset : notices.length });
  }
	render(){
    const { notices } = this.props;
    return (
		  <div className="Notice">
        { notices.length ? 
          notices.map( notice => <Item notice={notice} key={`Notice-${notice.id}`} /> )
          : <div className="notice-none">
            알림이 존재하지 않습니다.
          </div>
        }
			</div>
		);
	}
}

export default Notice;
