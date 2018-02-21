
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
	},
	filename: function (req, file, cb) {
		console.log(file);
		cb(null, req.user.user_id)
	}
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
		const pid = await db.Post.count();
		const tmp = path.join(__dirname,'..','..','tmp',req.user.id.toString());
		const dir = path.join(__dirname,'..','..','public','files','post',(pid+1).toString());
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}
		//fs.move(tmp,path.join(dir,req.body.type+".png"),{ overwrite: true });
		const current = {
			userId : req.user.id,
			text : req.body.text.trim().xssFilter().substr(0,120).replace(/((\r\n)|\n|\r){3,}/g,"\r\n\r\n"),
			file : 0,
		}
		console.log(current);
		db.Post.create(current).then( () => {
			db.Post.find({
				include : { model : db.User, as : 'user' },
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
	const skip = req.body['skip']?req.body['skip']:0;
	db.Post.findAll({ 
		include : { model : db.User, as : 'user' },
		order : [ ['id','DESC'] ], 
		limit : limit, 
		skip : skip
	}).then((posts) => {
		console.log(posts);
		res.send({ "data" : posts.map( function(post){ return post.get({ plain : true }); } ) });
	}).catch((err) => {
		console.log(err);
		res.send({ "msg" : "fail" });
	});
};

module.exports = obj;
