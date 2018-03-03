const express = require('express');

const router = express.Router();

const newsfeed = require('./controllers/newsfeed');
router.use('/api/newsfeed',newsfeed);
const auth = require('./controllers/auth');
router.use('/api/auth',auth);
const search = require('./controllers/search');
router.use('/api/search',search);

module.exports = router;
