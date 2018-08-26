const express = require('express');
const router = express.Router();

const linkMws = require('../middlewares/link');
const authMws = require('../middlewares/auth');

router.post( '/get', authMws.checkSession, linkMws.link );

module.exports = router;
