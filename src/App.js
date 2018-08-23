import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom'

import Header from './components/Header/Header';
import Body from './components/Body/Body';
//import Footer from './components/Footer/Footer';
import { loggedIn, logout } from './actions/auth';
import ReduxToastr from 'react-redux-toastr'

const stateToProps = ({user,socket}) => ({user,socket});

const actionToProps = {
  logout : logout.REQUEST,
  loggedIn : loggedIn.REQUEST,
}

@connect(stateToProps,actionToProps)
class App extends Component {
  componentDidMount(){
    const { loggedIn } = this.props;
    loggedIn();
  }
  componentWillReceiveProps(nextProps){
    //console.log(socket,nextProps);
    if( !this.props.socket && nextProps.socket ){
      /*
      nextProps.socket.on( 'say', (data) => {
      });
      */
    }
  }
  render() {
    const { logout, user } = this.props;
    if( !user ){
      return null;
    }
    return (
      <Router>
        <div>
          <ReduxToastr
            timeOut={4000}
            newestOnTop={false}
            position='bottom-right'
            transitionIn='fadeIn'
            transitionOut='fadeOut'
            progressBar
            closeOnToastrClick
          />
          <Header logout={ logout } user={ user } />
          <Body user={ user } />
        </div>
      </Router>
    );
  }
};

export default App;

