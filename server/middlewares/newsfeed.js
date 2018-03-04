
let obj = {}

let db = require('../models/index.js');
const fs = require('fs-extra');
const path = require('path');
obj.fs = fs;
obj.path = path;
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname,'..','..','tmp') )
	}
	/*
	,
	filename: function (req, file, cb) {
		cb(null, req.user.id.toString())
	}
	*/
});

obj.filter = multer({
	storage: storage,
	fileFilter : function (req, file, next) {
		next(null,true);
	}
});

String.prototype.xssFilter = function(){
	return this.replace( /</g , "&lt" ).replace( />/g , "&gt" );
};


obj.writePost = async function(req,res){
	try {
		const pid = await db.Post.count() + 1;
		const dir = path.join(__dirname,'..','..','public','files','post',pid.toString());
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}
		req.files.forEach( function( file, i ){
			fs.move(file.path,path.join(dir,(i+1)+".png"));
		});
		const current = {
			userId : req.user.id,
			text : req.body.text.trim().xssFilter().substr(0,120).replace(/((\r\n)|\n|\r){3,}/g,"\r\n\r\n"),
			file : req.files.length
		}
		db.Post.create(current).then( () => {
			db.Post.findOne({
				where : {
					id : pid
				},
				include : { model : db.User, as : 'user' }
			}).then( (post) => {
				res.send({ "data" : post.get({ plain : true }) });
			})
		})
	} catch(e){
		res.send({  msg : e.message });
	}
}

obj.getPosts = function( req, res ){
	const limit = req.body['limit']?req.body['limit']:10;
	const offset = req.body['offset']?req.body['offset']:0;
	db.Post.findAll({ 
		include : { model : db.User },
		order : [ ['id','DESC'] ], 
		limit : limit, 
		offset : offset
	}).then((posts) => {
		res.send({ "data" : posts.map( function(post){ return post.get({ plain : true }); } ) });
	}).catch((err) => {
		res.send({ "msg" : "fail" });
	});
};

module.exports = obj;
