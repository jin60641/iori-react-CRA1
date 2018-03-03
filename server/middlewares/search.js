let obj = {}
let db = require('../models/index.js');

obj.search = function(req,res){
	const { type, query } = req.body;
	console.log(query);
	db[type].findAll({ where: query, raw : true })
	.then( function(result){
		res.send({ data : result });
	})
}

module.exports = obj;
