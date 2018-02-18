const express = require('express');

const router = express.Router();

const newsfeed = require('./controllers/newsfeed');
const auth = require('./controllers/auth');
router.use('/api/newsfeed',newsfeed);
router.use('/api/auth',auth);

module.exports = router;
