const express = require('express');
const router = express.Router();

const noticeMws = require('../middlewares/notice');
const authMws = require('../middlewares/auth');

router.post( '/remove', authMws.checkSession, noticeMws.removeNotice );
router.post( '/gets', authMws.checkSession, noticeMws.getNotices );

module.exports = router;
