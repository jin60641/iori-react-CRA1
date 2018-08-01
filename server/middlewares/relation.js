
let db = require('../models/index.js');
const obj = {};

obj.follow = async (req,res) => {
	const { to } = req.body;
	const toId = req.body.to;
	const fromId = req.user.id;
	
	if( toId === fromId ){
		res.send({ "msg" : "자신을 팔로우 할 수 없습니다." });
	} else {
		const current = { toId, fromId };
		const deleted = await db.Follow.destroy({ where : current });
		if( deleted ){
			res.send({ "data" : false });
		} else {
			const [updated] = await db.Follow.update({ deletedAt : null },{ where : current, paranoid : false });
			if( updated ){
				res.send({ "data" : true });
			} else {
				db.Follow.create(current)
				.then( () => {
					res.send({ "data" : true });
				});
			}
		}
	}
}

module.exports = obj;
