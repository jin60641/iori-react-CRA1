import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import Header from './components/Header/Header';
import Body from './components/Body/Body';
import Toastr from './components/Toastr/Toastr';
// import Footer from './components/Footer/Footer';
import { loggedIn, logout } from './actions/auth';

const stateToProps = ({ user, socket }) => ({ user, socket });

const actionToProps = {
  logout: logout.REQUEST,
  loggedIn: loggedIn.REQUEST,
};

@connect(stateToProps, actionToProps)
class App extends Component {
  componentDidMount() {
    const { loggedIn } = this.props;
    loggedIn();
  }

  render() {
    const { logout, user } = this.props;
    if (!user) {
      return null;
    }
    return (
      <Router>
        <div>
          <Toastr />
          <Header logout={logout} user={user} />
          <Body user={user} />
        </div>
      </Router>
    );
  }
}

export default App;
