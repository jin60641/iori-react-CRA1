const express = require('express');
const router = express.Router();

const noticeMws = require('../middlewares/notice');
const authMws = require('../middlewares/auth');

router.post( '/removenotice', authMws.checkSession, noticeMws.removeNotice );
router.post( '/getnotices', authMws.checkSession, noticeMws.getNotices );

module.exports = router;
