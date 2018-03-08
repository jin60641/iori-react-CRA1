import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSearchUser } from '../../actions/search';

import Newsfeed from '../Newsfeed/Newsfeed';
import styles from './Profile.css';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);


const maxHeight = 200;
const minHeight = 80;

const initialState = {
	user : null
}
class Profile extends Component {
	constructor(props){
		super(props);
		this.state = initialState;
	}
	componentWillMount = () => {
		const { fetchSearchUser } = this.props;
		const { handle } = this.props.match.params;
		fetchSearchUser({ query : handle })
		.then( action => {
			console.log(action);
			if( !action.error ){
				this.setState({
					user : action.payload
				})
			}
		});
	}
	calcHeight(){
		const { scrollTop } = this.props;
		const height = maxHeight-scrollTop;
		return height<minHeight?minHeight:height;
	}
	render(){
		const { user } = this.state;
		const { isBottom } = this.props;
		const height = this.calcHeight();
		if( !user ){
			return( null );
		} else {
			return(
				<div>
					<div className="Profile" style={{height:maxHeight}}>
						<div className="profile-container" style={{height}}>
							<form className="profile-header">
								<div className="profile-header-back">
								
								</div>
								<input className="profile-header-file" type="file" />
							</form>
							<form className="profile-img">
								
							</form>
						</div>
					</div>
					<Newsfeed
						isBottom = { isBottom }
						options = { { userId : user.id } }
					/>
				</div>
			);
		}
	}
}
const stateToProps = ({searched}) => ({searched});

const actionToProps = {
	fetchSearchUser
}

export default connect(stateToProps,actionToProps)(Profile);

