const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require("path");

const controllers = path.join(__dirname,"controllers");

fs
	.readdirSync(controllers)
	.forEach( file => {
		const name = file.split('.')[0];
		router.use(`/api/${name}`,require(path.join(controllers,file)));
	})
	
module.exports = router;
