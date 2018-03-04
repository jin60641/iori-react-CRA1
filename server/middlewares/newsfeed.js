let obj = {}

let db = require('../models/index.js');
const fs = require('fs-extra');
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
		next(null,true);
	}
});

obj.writePost = (req,res) => {
	try {
		const current = {
			userId : req.user.id,
			text : req.body.text.trim().substr(0,120),
			file : req.files.length
		}
		db.Post.create(current).then( model => {
			const pid = model.dataValues.id;
			db.Post.findOne({
				where : {
					id : pid
				},
				include : { model : db.User, as : 'user' }
			}).then( post => {
				const dir = path.join(__dirname,'..','..','public','files','post',pid.toString());
				if (!fs.existsSync(dir)){
					fs.mkdirSync(dir);
				}
				req.files.forEach( ( file, i ) => {
					fs.move(file.path,path.join(dir,(i+1)+".png"));
				});
				res.send({ "data" : post.get({ plain : true }) });
			})
		})
	} catch(e){
		res.send({  msg : e.message });
	}
}

obj.getPosts = ( req, res ) => {
	const limit = req.body['limit']?req.body['limit']:10;
	const offset = req.body['offset']?req.body['offset']:0;
	db.Post.findAll({ 
		where : {
			userId : req.user.id
		},
		include : { model : db.User, as : 'user' },
		order : [ ['id','DESC'] ], 
		limit : limit, 
		offset : offset
	}).then( posts => {
		res.send({ "data" : posts.map( function(post){ return post.get({ plain : true }); } ) });
	}).catch( err => {
		res.send({ "msg" : "fail" });
	});
};

module.exports = obj;
