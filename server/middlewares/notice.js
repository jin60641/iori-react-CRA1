const db = require('../models/index.js');
const obj = {};

const noticeString = {
  post : from => `${from}님이 새 게시글을 작성하셨습니다.`,
  chat : from => `${from}님으로부터 새 쪽지가 도착하였습니다.`,
  follow : from => `${from}님이 당신을 팔로우합니다.`,
}


obj.makeNotice = async (user,type,id,to) => {
  const current = {
    type,
    text : noticeString[type](user.name),
    [`${type}Id`] : id,
    fromId : user.id,
    toId : to
  };
  const created = await db.Notice.create(current);
  const result = await db.Notice.findOne({
    where : {
      id : created.dataValues.id
    },
    include : db.Notice.include
  });
  const notice = await result.get({ plain : true });
  (to.constructor === Array?to:[to]).forEach( userId => {
    const socketId = socketIds[userId];
    if( socketId ){
      io.sockets.connected[socketId].emit( 'getnotice', notice );
    }
  })
}

obj.getNotices = (req,res) => {
  
}

module.exports = obj;
