let obj = {}
let db = require('../models/index.js');

const filter = {
	User : ["id","handle","name","profile"]
};


obj.searchUser = (req,res) => {
	const { query } = req.body;
	if( query.length ){
		const where = {
			handle : query
		}
		db.User.find({ where, attributes : filter.User, raw : true })
		.then( function(result){
			res.send({ data : result });
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
	db.User.findAll({ where, attributes : filter.User, raw : true })
	.then( function(result){
		res.send({ data : result });
	})
}

module.exports = obj;
