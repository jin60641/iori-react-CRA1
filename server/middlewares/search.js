let obj = {}
let db = require('../models/index.js');

const filter = {
	User : ["id","handle","name","profile","header"],
	Group : ["id","handle","name"]
};

const include = {
	User : [{ model : db.Group, as : 'groups' }],
	Group : [{ model : db.Group, as : 'users' }]
}


obj.searchGroup = (req,res) => {
	const { query } = req.body;
	if( query.length ){
		const where = {
			id : query
		}
		db.Group.find({ where, include : include.Group, attributes : filter.Group })
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
		db.User.find({ where, include : include.User, attributes : filter.User })
		.then( result => {
			res.send({ data : result.get({ plain : true }) });
		})
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
	db.User.findAll({ where, include : include.User, attributes : filter.User })
	.then( result => {
		res.send({ data : result.map( obj => obj.get({ plain : true }) ) });
	})
}

module.exports = obj;
