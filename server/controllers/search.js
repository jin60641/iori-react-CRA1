const express = require('express');
const router = express.Router();

const searchMws = require('../middlewares/search');

router.post( '/users', searchMws.searchUsers );
router.post( '/user', searchMws.searchUser );

module.exports = router;
