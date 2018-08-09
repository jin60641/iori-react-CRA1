const express = require('express');
const router = express.Router();

const searchMws = require('../middlewares/search');

router.post( '/follows', searchMws.follows );
router.post( '/users', searchMws.users );
router.post( '/user/handle', searchMws.userByHandle );
router.post( '/group/id', searchMws.groupById );

module.exports = router;
