const express = require('express');
const router = express.Router();

const newsfeedMws = require('../middlewares/newsfeed');
const authMws = require('../middlewares/auth');

router.post( '/writepost', authMws.checkSession, newsfeedMws.filter.array('file',20), newsfeedMws.writePost );
router.post( '/getposts', newsfeedMws.getPosts );

module.exports = router;
