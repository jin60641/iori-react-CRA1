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

obj.writePost = (req,res) => {
	try {
		const current = {
			userId : req.user.id,
			text : req.body.text.trim().substr(0,120),
			file : req.files.length
		}
		db.Post.create(current).then( model => {
			const pid = model.dataValues.id;
			db.Post.findOne({
				where : {
					id : pid
				},
				include : db.Post.include
			}).then( post => {
				req.user.posts += 1;
				const dir = path.join(__dirname,'..','..','files','post',pid.toString());
				if (!fs.existsSync(dir)){
					fs.mkdirSync(dir);
				}
				req.files.forEach( ( file, i ) => {
					fs.move(file.path,path.join(dir,(i+1)+".png"));
				});
				res.send({ "data" : post.get({ plain : true }) });
			})
		})
	} catch(e){
		console.log(e);
		res.status(401).send({  message : e.message });
	}
}

obj.getPosts = ( req, res ) => {
	if( req.body.userId ){
		getPostsByUserId( req, res );
	} else {
		getPosts( req, res );
	}
}

makeQuery = (req,options) => {
	let { id, limit, offset, file } = req.body;
	const where = { ...options };
	if( file ){
		where.file = { $gte : 1 } 
	}
	const query = {
		where,
		include : db.Post.include,
		order : [ ['id','DESC'] ],
		offset,
	}
	if( id ){
		query.where.id = { $gt : id }
	} else {
		query.limit = limit?limit:20;
	}
	return query;
}

getPosts = ( req, res ) => {
	db.Follow.findAll({ where : { fromId : req.user.id }})
	.then( follows => {
		const userIds = follows.map( follow => follow.get({ plain : true }).toId );
		userIds.push(req.user.id);
		const where = {
			userId : { $in : userIds }
		}
		db.Post.findAll(makeQuery(req,where))
		.then( posts => {
			res.send({ "data" : posts.map( post => post.get({ plain : true }) ) });
		});
	});
};

getPostsByUserId = ( req, res ) => {
	let { userId } = req.body;
	const where = {
		userId
	}
	db.Post.findAll(makeQuery(req,where))
	.then( posts => {
		res.send({ "data" : posts.map( post => post.get({ plain : true }) ) });
	});
};

module.exports = obj;
