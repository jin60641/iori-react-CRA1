const obj = {}
let db = require('../models/index.js');
const fs = require('fs-extra');
const im = require('imagemagick');
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
}).fields([
	{ name: 'profile', maxCount: 1 },
	{ name: 'header', maxCount: 1 }
]);

obj.profile = async (req,res) => {
	try {
		const query = {};
		await ['profile','header'].forEach( async key => {
			const file = (req.files&&req.files[key])?req.files[key][0]:null;
			req.user[key] = query[key] = ( !!file || (!req.body[key] || !req.body[key].remove ));
			if( query[key] && file ){
				const { width, height, x, y, crop } = req.body[key];
				if( crop === 'true' && x>=0 && y >= 0 && width >=1 && height>=1 ){
					await im.convert([file.path,'-crop',width+'x'+height+'+'+x+'+'+y,file.path]);
				}
				const dir = path.join(__dirname,'..','..','files',key);
				fs.move(file.path,path.join(dir,req.user.id+".png"), { overwrite : true });
			}
		});
		await ['name','introduce'].forEach( async key => {
			if( req.body[key] ){
				req.user[key] = query[key] = req.body[key];
			}
		});
		db.User.update(query,{ where : { id : req.user.id } })
		.then( result => {
			res.send({ data : query });
		})
	} catch( e ){
		console.log(e);
	}
}

module.exports = obj;
