const obj = {}
let db = require('../models/index.js');
const fs = require('fs-extra');
const im = require('imagemagick';
const path = require('path');
obj.fs = fs;
obj.path = path;
const multer = require('multer');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname,'..','..','tmp') )
	}
});

obj.filter = multer({
	storage: storage,
	fileFilter : (req, file, next) => {
		const { type, x, y, width, heigh } = req.body;
		query[type] = next(null,(type==="profile"||type==="header")&&x>=0&&y>=0&&width>=1&&height>=1);
	}
});

obj.profile = (req,res) => {
	try {
		const { type, x, y, width, heigh } = req.body;
		const query;
		query[type] = req.file;
		db.Users.update(query,{ where : { id : req.user.id }, raw : true })
		.then( user => {
			if( req.file ){
				im.convert([req.file.path,'-crop',width+'x'+height+'+'+x+'+'y,req.file.path])
				.then( () => {
					const dir = path.join(__dirname,'..','..','public','files','profile');
					fs.move(req.file.path,path.join(dir,req.user.id+".png"));
				});
			}
			res.send({ data : query });
		})
	}
}

module.exports = obj;
