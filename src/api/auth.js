import Fetch from './Fetch';

const loginUri = '/api/auth/login/local';
const logoutUri = '/api/auth/logout';
const loggedInUri = '/api/auth/loggedin';
const joinUri = '/api/auth/join';
const verifyMailUri = '/api/auth/verify';
const findPwUri = '/api/auth/findpw';
const changePwUri = '/api/auth/changepw';

const obj = {};

obj.login = data => Fetch('POST', loginUri, data);
obj.logout = () => Fetch('POST', logoutUri);
obj.loggedIn = () => Fetch('POST', loggedInUri);
obj.join = data => Fetch('POST', joinUri, data);
obj.verifyMail = data => Fetch('POST', verifyMailUri, data);
obj.findPw = data => Fetch('POST', findPwUri, data);
obj.changePw = data => Fetch('POST', changePwUri, data);

export default obj;
