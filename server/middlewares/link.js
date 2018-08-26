const obj = {}
  
const db = require('../models/index.js');

const fetch = require('node-fetch');
const utils = require('../utils');

obj.link = async ( req, res ) => {
  const { link } = req.body;
  const exist = await db.Link.findOne({ where : { link } });
  if( exist ){
    res.send({ data : exist.get({ plain : true }) });
  } else {
    try { 
      const resp = await utils.timeout( 2000, fetch( link ) );
      const body = await resp.text();
      const metas = await utils.getMeta(body);
      const { title, description, image } = metas;
      const current = {
        link,
        title,
        description,
        image
      };
      await db.Link.create(current);
      res.send({ data : current });
    } catch (e) {
      const current = { link }
      await db.Link.create(current);
      res.send({ data : current });
    }
  }
};

module.exports = obj;

