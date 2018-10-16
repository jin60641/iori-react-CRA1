import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './Mail.scss';
import { verifyMail } from '../../actions/auth';

const actionToProps = {
  verifyMail: verifyMail.REQUEST,
};

@connect(undefined, actionToProps)
class Mail extends Component {
  componentDidMount() {
    const { verifyMail, match } = this.props;
    const data = match.params;
    verifyMail(data);
  }

  render() {
    return (
      <div className='Mail'>
        <div className='mail-helper' />
        <div className='mail-wrap'>
          <div className='mail-head'>
            <img className='mail-head-logo' src='/images/email_logo_mono.png' alt='iori logo' />
          </div>
          <div className='mail-body'>
            <div className='mail-text'>
              E-mail verification complete

            </div>
            <Link to='/auth/login' className='mail-btn'>
              Back to login

            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Mail;
