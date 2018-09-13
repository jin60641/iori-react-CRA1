const express = require('express');
const router = express.Router();

const linkMws = require('../middlewares/link');

router.post( '/get', linkMws.link );

module.exports = router;
