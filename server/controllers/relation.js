let express = require('express');
let router = express.Router();

let authMws = require('./../middlewares/auth.js');
let relationMws = require('./../middlewares/relation.js');
router.post('/follow', authMws.checkSession, relationMws.follow );

module.exports = router;
