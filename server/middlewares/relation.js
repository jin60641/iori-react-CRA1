
let db = require('../models/index.js');
const obj = {};

obj.follow = (req,res) => {
	const { to } = req.body;
	const toId = req.body.to;
	const fromId = req.user.id;
	
	if( toId === fromId ){
		res.send({ "msg" : "자신을 팔로우 할 수 없습니다." });
	} else {
		const current = { toId, fromId };
		db.Follow.destroy({ where : current })
		.then( deleted => {
			if( deleted ){
				res.send({ "data" : false });
			} else {
				db.Follow.update({ deletedAt : null },{ where : current, paranoid : false })
				.then( updated => {
					if( updated[0] ){
						res.send({ "data" : true });
					} else {
						db.Follow.create(current)
						.then( follow => {
							res.send({ "data" : true });
						}).catch( e => {
							throw e;
						});
					}
				}).catch( e => {
					throw e;
				});
			}
		}).catch( e => {
			throw e;
		});
	}
}

module.exports = obj;
