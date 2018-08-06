const express = require('express');
const router = express.Router();

const searchMws = require('../middlewares/search');

router.post( '/follows', searchMws.searchFollows );
router.post( '/users', searchMws.searchUsers );
router.post( '/user/handle', searchMws.searchUserByHandle );
router.post( '/group/id', searchMws.searchGroupById );

module.exports = router;
