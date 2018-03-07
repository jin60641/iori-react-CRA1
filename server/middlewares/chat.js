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
			if( type === "user" ){
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
					const socketId = socketIds[to];
					if( socketId && req.user.id != to ){
						io.sockets.connected[socketId].emit( 'getchat', { from : req.user, handle : '@' + req.user.handle, chat } );
					}
					res.send({ 
						"data" : {
							handle : '@' + chat.to.handle,
							chat
						}
					})
				})
			} else {
				db.Chat.findOne({
					where : {
						id : cid
					},
					include : [
						{ model : db.User, as : 'from' },
						{ model : db.Group, as : 'to' }
					]
				}).then( result => {
					const chat = result.get({ plain : true });
					if( req.file ){
						const dir = path.join(__dirname,'..','..','public','files','chat');
						fs.move(req.file.path,path.join(dir,cid+".png"));
					}
					res.send({ 
						"data" : {
							handle : '#' + chat.group.id,
							chat
						}
					})
				})
			}
		})
	} catch(e){
		res.send({  msg : e.message });
	}
}

obj.getDialogs = ( req, res ) => {
	db.Chat.findAll({
		where : {
			$or : [{
				toId : req.user.id,
			},{
				fromId : req.user.id
			}]
		},
		include : [
			{ model : db.User, as : 'from' },
			{ model : db.User, as : 'to' }
		],
		order : [ ['id'] ]
	}).then( chats => {
		let ret = {};
		chats
			.map( chat => { return chat.get({ plain : true }); } )
			.forEach( chat => { 
				ret[ chat.toId === req.user.id ?chat.fromId:chat.toId ] = chat;
			})
		res.send({ "data" : ret });
	});
}

obj.getChats = ( req, res ) => {
	let { limit, offset, from, type } = req.body;
	limit = limit?limit:10;
	offset = offset?offset:0;
	if( type === "user" ){
		db.Chat.findAll({
			where : {
				$or : [{
					toId : req.user.id,
					fromId : from.id
				},{
					toId : from.id,
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
		}).then( chats => {
			res.send({ 
				"data" : {
					handle : '@' + from.handle,
					chats : chats.map( chat => { return chat.get({ plain : true }); } )
				}
			});
		}).catch( err => {
			console.log(err);
			res.send({ "msg" : "fail" });
		});
	}
};

module.exports = obj;
