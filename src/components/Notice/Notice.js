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
    const { notices, getNotices } = this.props;
    if( notices.length < limit ){
      getNotices({ limit, offset : notices.length });
    }
  }
	render(){
    const { notices } = this.props;
    return (
		  <div className="Notice">
        { notices.length ? 
          notices.map( notice => <Item notice={notice} key={`Notice-${notice.id}`} /> )
          : <div className="notice-none">
          </div>
        }
			</div>
		);
	}
}

export default Notice;
