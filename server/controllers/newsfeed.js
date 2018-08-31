const express = require('express');
const router = express.Router();

const newsfeedMws = require('../middlewares/newsfeed');
const authMws = require('../middlewares/auth');

router.post( '/post/get', newsfeedMws.getPosts );
router.post( '/post/write', authMws.checkSession, newsfeedMws.filter, newsfeedMws.writePost );
router.post( '/post/remove', authMws.checkSession, newsfeedMws.removePost );
router.post( '/post/hide', authMws.checkSession, newsfeedMws.hidePost );
//router.post( '/reply/get', newsfeedMws.getReplys );
//router.post( '/reply/write', authMws.checkSession, newsfeedMws.writeReply );
//router.post( '/reply/remove', authMws.checkSession, newsfeedMws.removePost );
//router.post( '/reply/hide', authMws.checkSession, newsfeedMws.hidePost );

module.exports = router;
