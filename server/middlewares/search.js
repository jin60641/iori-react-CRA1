let obj = {}
let db = require('../models/index.js');
const authMws = require('./auth.js');

obj.searchGroup = (req,res) => {
	const { query } = req.body;
	const where = {
		id : query
	}
	db.Group.find({ where, include : db.Group.include, attributes : db.Group.attributes })
	.then( result => {
		res.send({ data : result.get({ plain : true }) });
	})
}

obj.searchUserByHandle = (req,res) => {
	const { query } = req.body;
	const where = {
		handle : query,
		verify : true
	}
	db.User.find({ where, attributes : db.User.attributes })
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

obj.searchFollows = (req,res) => {
	const { query } = req.body;
	db.Follow.findAll({ where : query, include : db.Follow.include })
	.then( follows => {
		res.send({ data : follows.map( follow => follow.get({ plain : true })[query.toId?"to":"from"] ) });
	});
}

obj.searchUsers = (req,res) => {
	const { query } = req.body;
	const where = {
		$or : {
			name : { $like : `%${query}%` },
			handle : { $like : `%${query}%` }
		}
	}
	db.User.findAll({ where, attributes : db.User.attributes })
	.then( result => {
		res.send({ data : result.map( obj => obj.get({ plain : true }) ) });
	})
}

module.exports = obj;
