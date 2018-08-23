import React, { Component } from 'react';
import { connect } from 'react-redux';
//import './Item.css';

//import { removeNotice } from '../../actions/notice';

const actionToProps = {
//  removeNotice
}

@connect(undefined,actionToProps)
class Item extends Component {
	render(){
    const { notice } = this.props;
//  const profileLink = `/@${user.handle}`;
//  const profileImg = user.profile?`/files/profile/${user.id}.png`:"/images/profile.png";
    return (
		  <div className="Notice-Item">
        { notice.text }
			</div>
		);
	}
}

export default Item;
