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

obj.sendChat = (req,res) => {
	try {
		const current = {
			fromId : req.user.id,
			toId : req.body.to,
			text : req.body.text.trim().substr(0,120),
			file : req.file?true:false,
			type : req.body.type
		}
		db.Chat.create(current).then( model => {
			const cid = model.dataValues.id;
			db.Chat.findOne({
				where : {
					id : cid
				},
				include : [
					{ model : db.User, as : 'from' },
					{ model : db.User, as : 'to' }
				]
			}).then( chat => {
				if( req.file ){
					const dir = path.join(__dirname,'..','..','public','files','chat');
					fs.move(req.file.path,path.join(dir,cid+".png"));
				}
				res.send({ "data" : chat.get({ plain : true }) });
			})
		})
	} catch(e){
		res.send({  msg : e.message });
	}
}

obj.getChats = function( req, res ){
	const limit = req.body['limit']?req.body['limit']:10;
	const offset = req.body['offset']?req.body['offset']:0;
	db.Chat.findAll({ 
		include : { model : db.User },
		order : [ ['id','DESC'] ], 
		limit : limit, 
		offset : offset
	}).then((chats) => {
		res.send({ "data" : chats.map( function(chat){ return chat.get({ plain : true }); } ) });
	}).catch((err) => {
		res.send({ "msg" : "fail" });
	});
};

module.exports = obj;
