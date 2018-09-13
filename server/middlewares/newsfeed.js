let obj = {}

let db = require('../models/index.js');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');
const noticeMws = require('./notice.js');

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

obj.hidePost = async (req,res) => {
	const { id, key } = req.body;
	const where = {
		postId : id,
	}
	const post = await db.Post.findOne({ where : { id } });
	if( post ){
    const exist = await db.Hide.findOne({ where });
    if( exist ){
		  await db.Hide.destroy({ where });
    } else {
		  await db.Hide.create(where);
    }
		res.send({ data : { id, key, status : !exist } });
	} else {
		res.status(401).send({ message : '존재하지 않는 게시글입니다.' });
	}
}
obj.removePost = async (req,res) => {
	const { id, key } = req.body;
	const where = {
		id,
		userId : req.user.id 
	}
	const post = await db.Post.findOne({ where, paranoid : false });
	if( post ){
    const exist = !post.dataValues.deletedAt;
    if( exist ){
		  await db.Post.destroy({ where });
    } else {
      await db.Post.update({ deletedAt : null },{ where, paranoid : false })
    }
		req.user.posts += exist?-1:1;
		res.send({ data : { id, key, status : !exist } });
	} else {
		res.status(401).send({ message : '존재하지 않는 게시글입니다.' });
	}
}

obj.writePost = async (req,res) => {
	const current = {
		userId : req.user.id,
		text : req.body.text.trim().substr(0,120),
		file : req.files.length
	}
	const created = await db.Post.create(current);
	const result = await db.Post.findOne({
		where : {
			id : created.dataValues.id
		},
		include : db.Post.include
	});
	const post = await result.get({ plain : true });
	req.user.posts += 1;
	const dir = path.join(__dirname,'..','..','files','post',post.id.toString());
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}
	req.files.forEach( ( file, i ) => {
		fs.move(file.path,path.join(dir,(i+1)+".png"));
	});

	const follows = await db.Follow.findAll({ where : { toId : req.user.id }});
	const userIds = follows.map( follow => follow.dataValues.fromId ).filter( userId => userId !== req.user.id );
	userIds.forEach( userId => {
		const socketId = socketIds[userId];
		if( socketId && io.sockets.connected[socketId] ){
			io.sockets.connected[socketId].emit( 'GET_POST', post );
		}
	});
  noticeMws.makeNotice(req.user,'post',post.id,userIds);
	res.send({ "data" : post });
}

obj.getPosts = async ( req, res ) => {
	const { key, userId, id, limit, offset, file, gt, text } = req.body;
	const where = {};
	if( userId ){
		where.userId = userId;
	} else if( req.user ){
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
			query.where.id = { $gt : id };
		} else {
			query.where.id = id;
		}
	} else {
    if( req.user ){
      const hides = await db.Hide.findAll({ where : { userId : req.user.id }}).then( hides => hides.map( hide => hide.dataValues.postId ) );
      if( hides.length ){
        query.where.id = { $notIn : hides };
      }
    }
		query.limit = limit?limit:20;
	}
	const posts = await db.Post.findAll(query);
	res.send({ data : {
    posts : posts.map( post => post.get({ plain : true }) ),
    key
  }});
};

module.exports = obj;
