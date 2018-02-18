import React, { Component } from 'react';
class Join extends Component {
	constructor(props){
		super(props);
	}
	handleJoin = (data) => {
		const { fetchJoin, history } = this.props;
		fetchJoin(data)
			.then( (action) => {
console.log(action);
				if( action.error ){
					alert(action.payload.message);
				} else {
					alert(action.payload);
				}
			});
	}
	test = () => {
		this.handleJoin({email:"jin60641@naver.com",password:"test",name:"진상"});
	}
	render(){
		return(<div className="Join" onClick ={ this.test } >asd </div>);
	}
}

export default Join;
