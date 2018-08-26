const db = require('../models/index.js');
const obj = {};

const noticeString = {
  post : from => `${from}님이 새 게시글을 작성하셨습니다.`,
  chat : from => `${from}님으로부터 새 쪽지가 도착하였습니다.`,
  follow : from => `${from}님이 당신을 팔로우합니다.`,
}


obj.makeNotice = (user,type,id,to) => {
  (to.constructor === Array?to:[to]).forEach( async userId => {
    const current = {
      type,
      text : noticeString[type](user.name),
      [`${type}Id`] : id,
      fromId : user.id,
      toId : userId
    };
    const created = await db.Notice.create(current);
    const result = await db.Notice.findOne({
      where : {
        id : created.dataValues.id
      },
      include : db.Notice.include
    });
    const notice = await result.get({ plain : true });
    const socketId = socketIds[userId];
    if( socketId ){
      io.sockets.connected[socketId].emit( 'GET_NOTICE', notice );
    }
  })
}

obj.getNotices = async (req,res) => {
  const { id, limit, offset, type, gt, text } = req.body;
  const where = {
    toId : req.user.id
  };
  if( text ){
    where.text = { $like : `%${text}%` };
  }
  if( type ){
    where.type = type;
  }
  const query = {
    where,
    include : db.Notice.include,
    order : [ ['id','DESC'] ],
    offset,
  }
  if( id ){
    if( gt ){
      query.where.id = { $gt : id };
    } else {
      query.where.id = id;
    }
  } else {
    query.limit = limit?limit:20;
  }
  const notices = await db.Notice.findAll(query);
  res.send({ data : notices.map( notice => notice.get({ plain : true }) ) });
};

obj.removeNotice = async (req,res) => {
  const { id } = req.body;
  const where = {
    id,
    userId : req.user.id
  }
  const notice = await db.Notice.findOne({ where });
  if( notice ){
    await db.Notice.destroy({ where });
    res.send({ data : id });
  } else {
    res.status(401).send({ message : '존재하지 않는 알림입니다.' });
  }
}

module.exports = obj;
