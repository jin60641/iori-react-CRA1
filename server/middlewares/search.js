let obj = {}
let db = require('../models/index.js');
const authMws = require('./auth.js');

const filter = {
	User : ["id","handle","name","profile","header"],
	Group : ["id","handle","name"]
};

obj.searchGroup = (req,res) => {
	const { query } = req.body;
	if( query.length ){
		const where = {
			id : query
		}
		db.Group.find({ where, include : db.Group.include, attributes : filter.Group })
		.then( result => {
			res.send({ data : result.get({ plain : true }) });
		})
	}
}

obj.searchUser = (req,res) => {
	const { query } = req.body;
	if( query.length ){
		const where = {
			handle : query,
			verify : true
		}
		db.User.find({ where, attributes : filter.User })
		.then( async result => {
			const user = result.get({ plain : true });
			user.posts = await db.Post.count({ where: { userId : user.id } });
			user.followings = await db.Follow.count({ where : { fromId : user.id } });
			user.followers = await db.Follow.count({ where : { toId : user.id } });
			if( authMws.isLoggedIn(req) ){
				user.following = await db.Follow.findOne({ where : { fromId : req.user.id, toId : user.id }, raw : true })?true:false;
				user.follower = await db.Follow.findOne({ where : { fromId : user.id, toId : req.user.id }, raw : true })?true:false;
			}
			res.send({ "data" : user });
		});
	}
}

obj.searchUsers = (req,res) => {
	const { query } = req.body;
	const where = {
		$or : {
			name : { $like : `%${query}%` },
			handle : { $like : `%${query}%` }
		}
	}
	db.User.findAll({ where, attributes : filter.User })
	.then( result => {
		res.send({ data : result.map( obj => obj.get({ plain : true }) ) });
	})
}

module.exports = obj;
