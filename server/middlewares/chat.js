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

const strToChar = {
    'user' : '@',
    'group' : '$',
}

obj.sendChat = (req,res) => {
	try {
		const { to, text, type } = req.body;
		let current = {
			fromId : req.user.id,
			text : text.trim().substr(0,120),
			file : req.file?true:false,
			type
		}
		if( type === "user" ){
			current.toId = to;
		} else if( type === "group" ){
			current.groupId = to;
		}
		db.Chat.create(current).then( model => {
			const cid = model.dataValues.id;
			db.Chat.findOne({
				where : {
					id : cid
				},
				include : [
					{ model : db.User, as : 'from' },
					{ model : db.User, as : 'to' },
					{ model : db.Group, as : 'group' }
				]
			}).then( result => {
				const chat = result.get({ plain : true });
				chat.to = chat.type==="user"?chat.to:chat.group;
				if( req.file ){
					const dir = path.join(__dirname,'..','..','public','files','chat');
					fs.move(req.file.path,path.join(dir,cid+".png"));
				}
				chat.with = chat.to.id;
				chat.handle = strToChar[chat.type] + chat.to.handle;
				(chat.group?chat.group.userIds:[to]).forEach( userId => {
					const socketId = socketIds[userId];
					if( socketId && req.user.id != userId ){
						io.sockets.connected[socketId].emit( 'getchat', { from : req.user, handle : chat.handle, chat } );
					}
				})
				res.send({ 
					"data" : {
						with : chat.to.id,
						handle : chat.handle,
						chat
					}
				})
			})
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
			{ model : db.User, as : 'to' },
			{ model : db.Group, as : 'group' }
		],
		order : [ ['id'] ]
	}).then( chats => {
		let obj = {};
		chats
		.map( chat => { return chat.get({ plain : true }); } )
		.forEach( chat => { 
			chat.to = chat.type==="user"?chat.to:chat.group;
			chat.handle = strToChar[chat.type] + (chat.toId === req.user.id?chat.from.handle:chat.to.handle);
			chat.with = chat.toId === req.user.id?chat.from.id:chat.to.id;
			obj[ chat.handle ] = chat;
		});
		res.send({ "data" : obj });
	});
}

obj.getChats = ( req, res ) => {
	let { limit, offset, from, type } = req.body;
	limit = limit?limit:10;
	offset = offset?offset:0;
	const query = {
		include : [
			{ model : db.User, as : 'from' },
			{ model : db.User, as : 'to' }
		],
		order : [ ['id','DESC'] ], 
		limit, 
		offset
	};
	if( type === "user" ){
		query.where = {
			$or : [{
				toId : req.user.id,
				fromId : from.id
			},{
				toId : from.id,
				fromId : req.user.id
			}]
		}
	} else if( type === "group" ){
		query.where = {
			groupId : from.id
		}
	}
	db.Chat.findAll(query)
	.then( chats => {
		res.send({ 
			"data" : {
				handle : strToChar[type] + from.handle,
				chats : chats.map( chat => { return chat.get({ plain : true }); } )
			}
		});
	}).catch( err => {
		res.send({ "msg" : "fail" });
	});
};

obj.makeGroup = (req,res) => {
	const { userIds } = req.body;
	db.User.findAll({ where : { id : { $in : userIds } }})
	.then( result => {
		const users = result.map( user => { return user.get({ plain : true}) } );
		const names = users.map( user => { return user.name });
		if( names.length === userIds.length ){
			const current = {
				userIds,
				name : names.join(", ")
			}
			db.Group.create(current,{ include : [{ model : db.User, as : 'users'}] })
			.then( created => {
				const group = created.get({ plain : true });
				result.forEach( user => { user.addGroup(created, { through : { groupId : group.id } }) });
				res.send({ "data" : group });
			});
		}
	}).catch( e => {
		console.log(e);
	});
}

module.exports = obj;
