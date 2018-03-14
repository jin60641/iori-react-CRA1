const express = require('express');
const router = express.Router();

const chatMws = require('../middlewares/chat');
const authMws = require('../middlewares/auth');

router.post( '/sendchat', authMws.checkSession, chatMws.filter.single('file'), chatMws.sendChat );
router.post( '/getchats', authMws.checkSession, chatMws.getChats );
router.post( '/getdialogs', authMws.checkSession, chatMws.getDialogs );
router.post( '/makegroup', authMws.checkSession, chatMws.makeGroup );

module.exports = router;
