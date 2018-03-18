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
				include : db.Post.include
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
	if( req.body.userId ){
		getPostsByUserId( req, res );
	} else {
		getPosts( req, res );
	}
}

getPosts = ( req, res ) => {
	let { limit, offset } = req.body;
	db.Follow.findAll({ where : { fromId : req.user.id }})
	.then( follows => {
		const userIds = follows.map( follow => follow.get({ plain : true }).toId );
		userIds.push(req.user.id);
		db.Post.findAll({ 
			where : {
				userId : { $in : userIds }
			},
			include : db.Post.include,
			order : [ ['id','DESC'] ], 
			limit : limit, 
			offset : offset
		}).then( posts => {
			res.send({ "data" : posts.map( post => post.get({ plain : true }) ) });
		}).catch( e => {
			res.send({ "msg" : "fail" });
		});
	}).catch( e => {
		res.send({ "msg" : "fail" });
	});
};

getPostsByUserId = ( req, res ) => {
	let { limit, offset, userId } = req.body;
	db.Post.findAll({ 
		where : { userId },
		include : db.Post.include,
		order : [ ['id','DESC'] ], 
		limit : limit, 
		offset : offset
	}).then( posts => {
		res.send({ "data" : posts.map( post => post.get({ plain : true }) ) });
	}).catch( e => {
		res.send({ "msg" : "fail" });
	});
};

module.exports = obj;
