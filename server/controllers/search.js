const express = require('express');
const router = express.Router();

const searchMws = require('../middlewares/search');

router.post( '/', searchMws.search );

module.exports = router;
