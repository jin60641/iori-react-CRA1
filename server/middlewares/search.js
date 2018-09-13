let obj = {}
let db = require('../models/index.js');
const authMws = require('./auth.js');

obj.groupById = (req,res) => {
  const { query } = req.body;
  const where = {
    id : query
  }
  db.Group.find({ where, include : db.Group.include, attributes : db.Group.attributeNames })
  .then( result => {
    res.send({ data : result.get({ plain : true }) });
  })
}

const makeUserObj = async (req,user) => {
  if( req.user && req.user.verify ){
    user.following = !!( await db.Follow.findOne({ where : { fromId : req.user.id, toId : user.id }, raw : true }) );
    user.follower = !!( await db.Follow.findOne({ where : { fromId : user.id, toId : req.user.id }, raw : true }) );
  }
  return user;
}

obj.userByHandle = (req,res) => {
  const { query } = req.body;
  const where = {
    handle : query,
    verify : true
  }
  db.User.findOne({ where, attributes : db.User.attributeNames })
  .then( async result => {
    if( result ){
      let user = result.get({ plain : true });
      user = await makeUserObj(req,user);
      user.posts = await db.Post.count({ where: { userId : user.id } });
      user.followings = await db.Follow.count({ where : { fromId : user.id } });
      user.followers = await db.Follow.count({ where : { toId : user.id } });
      res.send({ "data" : user });
    } else {
      res.status(400).send({ "message" : "잘못된 접근입니다." });
    }
  });
}

obj.follows = async (req,res) => {
  const { type, userId } = req.body;
  if( type === 'to' || type === 'from' ){
    const user = await db.User.findOne({ where : { id : userId } });
    if( user ){
      const query = {
        [type==='to'?'toId':'fromId'] : userId
      };
      db.Follow.findAll({ where : query, include : db.Follow.include })
      .then( async follows => {
        Promise.all(follows.map( async follow => {
          let friend = follow.get({ plain : true })[query.toId?"from":"to"];
          friend = await makeUserObj(req,friend);
          return friend;
        })).then( data => {
          res.send({ data });
        });
      });
    } else {
      res.status(400).send({ "message" : "잘못된 접근입니다." });
    }
  } else {
    res.status(400).send({ "message" : "잘못된 접근입니다." });
  }
}

obj.users = (req,res) => {
  const { query } = req.body;
  const where = {
    $or : {
      name : { $like : `%${query}%` },
      handle : { $like : `%${query}%` }
    }
  }
  if( req.user ){
    where.id = { $not : req.user.id };
  }
  db.User.findAll({ where, attributes : db.User.attributeNames })
  .then( result => {
    Promise.all( result.map( async obj => (await makeUserObj(req, obj.get({ plain : true }))) ) )
    .then( data =>{
      res.send({ 
        data
      });
    })
  })
}

module.exports = obj;
