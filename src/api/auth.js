
import Fetch from './Fetch';
const loginUri = '/api/auth/login/local';
const logoutUri = '/api/auth/logout';
const loggedInUri = '/api/auth/loggedin';
const joinUri = '/api/auth/join';
const verifyMailUri = '/api/auth/verify';
const findPwUri = '/api/auth/findpw';
const changePwUri = '/api/auth/changepw';

const obj = {};


obj.loggedIn = () => Fetch('POST',loggedInUri);

export default obj;
