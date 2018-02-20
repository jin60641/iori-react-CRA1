let db = require('../models/index.js');
let fs = require('fs-extra');

let obj = {}

String.prototype.xssFilter = function(){
	return this.replace( /</g , "&lt" ).replace( />/g , "&gt" );
};

obj.writePost = function( req, res ){
	let current = {
		user : req.user._id,
	}
	const uploadDir = __dirname + '/../../public/files/post/' + pid;
	fs.mkdirSync( uploadDir, "0755" );
	fs.mkdirSync( uploadDir + '/reply', "0755" );
	let filecount = 0;
	req.pipe( req.busboy );
	req.busboy.on( 'file', ( filedname, file, filename ) => {
		++filecount;
		let fstream;
		fstream = fs.createWriteStream( uploadDir + '/' + filecount );
		file.pipe( fstream );
		fstream.on( 'close', () => {} );
	});
	req.busboy.on( 'field', ( fieldname, val ) => {
		if( fieldname == "text" ){
			current.text = val.trim().xssFilter().substr(0,120).replace(/((\r\n)|\n|\r){3,}/g,"\r\n\r\n");
		}
	});
	req.busboy.on( 'finish', () => {
		current.file = filecount;
		db.Post.create(current).then( function(task){
			res.send({ "data" : [current] });
		})
	});
};

obj.getPosts = function( req, res ){
	const limit = req.body['limit']?req.body['limit']:10;
	const skip = req.body['skip']?req.body['skip']:0;
	db.Post.find({ order : 'id DESC', limit : limit, skip : skip })
		.then((posts) => {
			res.send({ "data" : posts });
		}).catch((err) => {
			console.log(err);
			res.send({ "msg" : "fail" });
		});
};

module.exports = obj;
