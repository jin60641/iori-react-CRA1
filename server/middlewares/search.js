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
			handle : query
		}
		db.User.find({ where, attributes : filter.User })
		.then( result => {
			const user = result.get({ plain : true });
			if( authMws.isLoggedIn(req) ){
				db.Follow.findAll({ 
					where : { 
						$or : [{
							fromId : req.user.id,
							toId : user.id
						},{
							fromId : user.id,
							toId : req.user.id
						}]
					}
				}).then( follows => {
					user.following = false; 
					user.follower = false;
					(follows?follows.map( follow => follow.get({ plain : true }) ):[]).forEach( follow => {
						if( follow.fromId == req.user.id ){
							user.following = true; 
						} else {
							user.follower = true;
						}
					});
					res.send({ "data" : user });
				});
			} else {
				res.send({ "data" : user });
			}
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
