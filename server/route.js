const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require("path");

const controllers = path.join(__dirname,"controllers");

fs
	.readdirSync(controllers)
	.forEach( file => {
		const [name,format,swp] = file.split('.');
		if( !swp ) {
			router.use(`/api/${name}`,require(path.join(controllers,file)));
		}
	})
	
module.exports = router;
