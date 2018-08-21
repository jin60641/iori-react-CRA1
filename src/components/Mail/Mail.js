import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './Mail.css';
import { verifyMail } from '../../actions/auth';

class Mail extends Component {
	constructor(props){
		super(props);
	}
	componentDidMount(){
		const { verifyMail, match } = this.props;
		const data = match.params;
		verifyMail(data)
	}
	render(){
		return(
			<div className="Mail">
				<div className="mail-helper"></div>
				<div className="mail-wrap">
					<div className="mail-head">
						<img className="mail-head-logo" src="/images/email_logo_mono.png" alt="iori logo"/>
					</div>
					<div className="mail-body">
						<div className="mail-text">
							E-mail verification complete
						</div>
						<Link to="/auth/login" className="mail-btn">
							Back to login
						</Link>
					</div>
				</div>
			</div>
		);
	}
}

const actionToProps = {
	verifyMail : verifyMail.REQUEST
}

export default connect(undefined,actionToProps)(Mail);
