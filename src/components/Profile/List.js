import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSearchFollows } from '../../actions/search';

class List extends Component {
	constructor(props){
		super(props);
		this.state = {
			init : false
		}
	}
	componentWillMount = () => {
		const { userId, fetchSearchFollows } = this.props;
		const tab = this.props.match.url.split('/').slice(-1);
		const query = {}
		query[tab === "follower"?"toId":"fromId"] = userId;
		fetchSearchFollows({ query })
		.then( action => {
			if( !action.error ) {
				console.log(action.payload)
			}
		});
	}
	render(){
		const { userId } = this.props;
		return(<div>{userId}</div>);
	}
}

const stateToProps = ({searched}) => ({searched});

const actionToProps = {
    fetchSearchFollows
}

export default connect(stateToProps,actionToProps)(List);
