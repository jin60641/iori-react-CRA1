let express = require('express');
let router = express.Router();

let authMws = require('./../middlewares/auth.js');
router.post('/join', authMws.join );
router.post('/findpw', authMws.findPw );
router.post('/local', authMws.authLocal );
router.post('/findpw/:email/:link', authMws.findPwVerifyMail );
router.post('/mail', authMws.verifyMail );
router.post('/loggedin', authMws.checkSession, authMws.loggedIn );
router.post('/logout', authMws.logOut );

module.exports = router;
