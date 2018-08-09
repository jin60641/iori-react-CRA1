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
	limits: { fieldSize: 30 * 1024 * 1024 },
	storage: storage,
	fileFilter : (req, file, next) => {
		next(null,true);
	}
}).array('file',4);

obj.removePost = (req,res) => {
	const { id } = req.body;
	const where = {
		id,
		userId : req.user.id 
	}
	db.Post.findOne({ where })
	.then( post => {
		if( post ){
			req.user.posts -= 1;
			db.Post.destroy({ where })
			.then( () => {
				const raw = post.get({ plain : true });
				raw.deleted = true;
				res.send({ "data" : raw });
			});
		} else {
			res.status(401).send({ message : '존재하지 않는 게시글입니다.' });
		}
	});
}

obj.writePost = async (req,res) => {
	const current = {
		userId : req.user.id,
		text : req.body.text.trim().substr(0,120),
		file : req.files.length
	}
	const created = await db.Post.create(current);
	const result = db.Post.findOne({
		where : {
			id : created.dataValues.id
		},
		include : db.Post.include
	});
	const post = result.get({ plain : true });
	req.user.posts += 1;
	const dir = path.join(__dirname,'..','..','files','post',post.id.toString());
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}
	req.files.forEach( ( file, i ) => {
		fs.move(file.path,path.join(dir,(i+1)+".png"));
	});

	const follows = await db.Follow.findAll({ where : { fromId : req.user.id }});
	const userIds = follows.map( follow => follow.dataValues.toId ).concat([req.user.id]);
	userIds.forEach( user => {
		const socketId = socketIds[user.id];
		if( socketId && req.user.id != user.id ){
			io.sockets.connected[socketId].emit( 'getpost', post );
		}
	});
	res.send({ "data" : post.get({ plain : true }) });
}

obj.getPosts = async ( req, res ) => {
	const { userId, id, limit, offset, file, gt, text } = req.body;
	const where = {};
	if( userId ){
		where.userId = userId;
	} else {
		const follows = await db.Follow.findAll({ where : { fromId : req.user.id }});
		const userIds = follows.map( follow => follow.dataValues.toId ).concat([req.user.id]);
		where.userId = { $in : userIds };
	}
	if( file ){
		where.file = { $gte : 1 };
	}
	if( text ){
		where.text = { $like : `%${text}%` };
	}
	const query = {
		where,
		include : db.Post.include,
		order : [ ['id','DESC'] ],
		offset,
	}
	if( id ){
		if( gt ){
			query.where.id = { id : { $gt : id } }
		} else {
			query.where.id = { id }
		}
	} else {
		query.limit = limit?limit:20;
	}
	const posts = await db.Post.findAll(query);
	res.send({ "data" : posts.map( post => post.get({ plain : true }) ) });
};

module.exports = obj;
