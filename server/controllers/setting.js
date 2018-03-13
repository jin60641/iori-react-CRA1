const express = require('express');
const router = express.Router();

const settingMws = require('../middlewares/setting');
const authMws = require('../middlewares/auth');

router.post('/profile', authMws.checkSession, settingMws.filter.single('file'), settingMws.profile );

module.exports = router;
