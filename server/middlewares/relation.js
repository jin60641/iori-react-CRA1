
let db = require('../models/index.js');
const obj = {};
const noticeMws = require('./notice.js');

obj.follow = async (req,res) => {
	const { to : toId } = req.body;
	const fromId = req.user.id;
	if( toId === fromId ){
		res.status(400).send({ "message" : "자신을 팔로우 할 수 없습니다." });
	} else {
		const current = { toId, fromId };
		const deleted = await db.Follow.destroy({ where : current });
		if( deleted ){
			res.send({ "data" : false });
		} else {
			const [updated] = await db.Follow.update({ deletedAt : null },{ where : current, paranoid : false });
			if( updated ){
        noticeMws.makeNotice(req.user,'follow',updated.dataValues.id,userIds);
				res.send({ "data" : true });
			} else {
				db.Follow.create(current)
				.then( created => {
          makeNotice(req.user,'follow',current.dataValues.id,userIds);
					res.send({ "data" : true });
				});
			}
		}
	}
}

module.exports = obj;
