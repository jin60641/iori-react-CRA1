
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
		const follow = await db.Follow.findOne({ where : current });

    if( follow ){
		  await db.Follow.destroy({ where : current });
    } else {
			const created = await db.Follow.create(current);
      noticeMws.makeNotice(req.user,'follow',created.dataValues.id,toId);
    }
    req.user.followings += follow?1:-1;
	  res.send({ "data" : {
      to : toId,
      following : !follow
    }});
	}
}

module.exports = obj;
