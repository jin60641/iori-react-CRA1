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
			text : text?text.trim().substr(0,120):"",
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
				include : db.Chat.include
			}).then( result => {
				const chat = result.get({ plain : true });
				const chr = strToChar[chat.type];
				chat.to = chat.type==="user"?chat.to:chat.group;
				if( req.file ){
					const dir = path.join(__dirname,'..','..','files','chat');
					fs.move(req.file.path,path.join(dir,cid+".png"));
				}
				(chat.group?chat.group.users:[chat.to]).forEach( user => {
					const socketId = socketIds[user.id];
					if( socketId && req.user.id != user.id ){
						io.sockets.connected[socketId].emit( 'getchat', { from : req.user, handle : chr + (chat.type==="user"?chat.from.handle:chat.to.handle), chat } );
					}
				})
				res.send({ 
					"data" : {
						handle : chr + chat.to.handle,
						chat
					}
				})
			})
		})
	} catch(e){
		res.send({  msg : e.message });
	}
}

obj.getDialogs = async ( req, res ) => {
	const groups = await db.UserGroup.findAll({ where: { UserId : req.user.id } }).map( item => item.GroupId );
	db.Chat.findAll({
		where : {
			$or : [{
				toId : req.user.id,
			},{
				fromId : req.user.id
			},{
				groupId : { $in : [ groups ] }
			}]
		},
		include : db.Chat.include,
		order : [ ['id'] ]
	}).then( chats => {
		let dialogs = {};
		chats.forEach( item => { 
			const chat = item.get({ plain : true });
			chat.to = chat.type==="user"?chat.to:chat.group;
			chat.handle = strToChar[chat.type] + ((chat.toId === req.user.id)?chat.from.handle:chat.to.handle);
			chat.text = chat.file?"사진":chat.text;
			dialogs[ chat.handle ] = chat;
		});
		res.send({ "data" : dialogs });
	}).catch( e => {
		console.log(e);
	});
}

obj.getChats = ( req, res ) => {
	let { limit, offset, from, type } = req.body;
	limit = limit?limit:10;
	offset = offset?offset:0;
	const query = {
		include : db.Chat.include,
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
	let { userIds } = req.body;
	userIds.push(req.user.id);
	db.User.findAll({ where : { id : { $in : userIds } }})
	.then( result => {
		const users = result.map( user => { return user.get({ plain : true}) } );
		const names = users.map( user => { return user.name });
		if( names.length === userIds.length ){
			const current = {
				userIds,
				name : names.join(", ")
			}
			db.Group.create(current,{ include : db.Group.include })
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
