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
		const { to, text, type } = req.body;
		const current = {
			fromId : req.user.id,
			toId : to,
			text : text.trim().substr(0,120),
			file : req.file?true:false,
			type
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
			}).then( result => {
				const chat = result.get({ plain : true });
				if( req.file ){
					const dir = path.join(__dirname,'..','..','public','files','chat');
					fs.move(req.file.path,path.join(dir,cid+".png"));
				}
				res.send({ 
					"data" : {
						type,
						to : chat.to,
						chats : [ chat ]
					}
				})
			})
		})
	} catch(e){
		res.send({  msg : e.message });
	}
}

obj.getChats = ( req, res ) => {
	let { limit, offset, to, type } = req.body;
	limit = limit?limit:10;
	offset = offset?offest:0;
	db.Chat.findAll({
		where : {
			$or : [{
				toId : req.user.id,
				fromId : to.id
			},{
				toId : to.id,
				fromId : req.user.id
			}]
		},
		include : [
			{ model : db.User, as : 'from' },
			{ model : db.User, as : 'to' }
		],
		order : [ ['id','DESC'] ], 
		limit, 
		offset
	}).then((chats) => {
		res.send({ 
			"data" : {
				type,
				to,
				chats : chats.map( function(chat){ return chat.get({ plain : true }); } )
			}
		});
	}).catch((err) => {
		res.send({ "msg" : "fail" });
	});
};

module.exports = obj;
