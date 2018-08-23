let obj = {}

let db = require('../models/index.js');
const fs = require('fs-extra');
const path = require('path');
obj.fs = fs;
obj.path = path;
const multer = require('multer');
const noticeMws = require('./notice.js');

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

obj.sendChat = async (req,res) => {
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
	const created = await db.Chat.create(current);
	const raw = await db.Chat.findOne({ where : { id : created.dataValues.id }, include : db.Chat.include });
	const chat = await raw.get({ plain : true });
	const chr = strToChar[chat.type];
	chat.to = chat.type==="user"?chat.to:chat.group;
	if( req.file ){
		const dir = path.join(__dirname,'..','..','files','chat');
		fs.move(req.file.path,path.join(dir,chat.id+".png"));
	}
  const userIds = await (chat.group?chat.group.users.filter( user => user.id !== req.user.id ):[chat.to]).map( user => user.id );
	userIds.forEach( userId => {
		const socketId = socketIds[userId];
		if( socketId ){
			io.sockets.connected[socketId].emit( 'GET_CHAT', { from : req.user, handle : chr + (chat.type==="user"?chat.from.handle:chat.to.handle), chat } );
		}
	})
  noticeMws.makeNotice(req.user,'chat',chat.id,userIds);
	res.send({ 
		"data" : {
			handle : chr + chat.to.handle,
			chat
		}
	});
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
				groupId : { $in : groups }
			}]
		},
		order : [ ['id','ASC'] ],
		include : db.Chat.include,
	}).then( chats => {
		let dialogs = {};
		chats.forEach( item => { 
			const chat = item.get({ plain : true });
			chat.to = chat.type==="user"?chat.to:chat.group;
			chat.handle = strToChar[chat.type] + ((chat.toId === req.user.id)?chat.from.handle:chat.to.handle);
			dialogs[ chat.handle ] = chat;
		});
		res.send({ "data" : dialogs });
	});
}

obj.getChats = ( req, res ) => {
	const { limit = 10, offset = 0, from, type } = req.body;
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
				chats : chats.map( chat => chat.get({ plain : true })  )
			}
		});
	});
};

obj.makeGroup = async (req,res) => {
	let { userIds } = req.body;
	if( !( userIds.find( num => num === req.user.id ) >= 0 ) ){
		userIds.push(req.user.id);
	}
	const users = await db.User.findAll({ where : { id : { $in : userIds } }, order : ['id'] })
	if( users.length === userIds.length ){
		const current = {
			userIds
		}
		const created = await db.Group.create(current);
		const { id } = created.dataValues;
		const promises = users.map( user => 
			new Promise( resolve => {
				user.addGroup(created, { through : { groupId : id } }).then(()=>resolve(user.dataValues.name));
			})
		);
		Promise.all(promises).then( async names => {
			await created.update({ name : names.length <= 7 ? names.join(", ") : `${names.slice(0,5).join(", ")} 외 ${names.length-5}명` });
			const raw = await db.Group.findOne({ where : { id }, include : db.Group.include });
			const group = raw.get({ plain : true });
			res.send({ "data" : {
        handle : strToChar['group'] + group.handle,
        chat : {
          to : group,
          group,
          from : req.user,
          type : 'group'
        }
      }});
		});
	}
}

module.exports = obj;
