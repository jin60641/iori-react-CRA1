const db = require('../server/models/index.js');
const chai = require('chai');
const chaiDeepMatch = require('chai-deep-match');
const chaiArrays = require('chai-arrays');
const crypto = require('crypto');

chai.use(chaiDeepMatch);
chai.use(chaiArrays);

global.expect = chai.expect;

global.setup = async function () {
	this.timeout(5000);
	await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', {raw: true});
	await db.sequelize.sync({force: true});
	await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', {raw: true});
};

global.teardown = async function () {
};

global.defaultUserInfos = Array.from(Array(100)).map( (x,i) => ({
	email : `test${i}@iori.kr`,
	handle : `test${i}`,
	password : "1234",
	name : `테스트${i}`,
	verify : true
}) );

global.prepareUsers = () => {
	const promises = global.defaultUserInfos.map( userInfo => 
		new Promise( resolve => {
			let shasum = crypto.createHash('sha1');
			shasum.update(userInfo.password);
			const sha_pw = shasum.digest('hex');
			db.User.create({ ...userInfo, password : sha_pw })
			.then( created => {
				resolve(created.get({ plain : true }));
			})
		})
	);
	return Promise.all(promises);
}

global.defaultUserChatInfos = Array.from(Array(100)).map( (x,i) => ({
	text : `test chat ${i}.`,
	file : false,
	type : "user",
	fromId : 1,
	toId : 2
}) );

global.defaultGroupChatInfos = Array.from(Array(100)).map( (x,i) => ({
	text : `test chat ${i}.`,
	file : false,
	type : "group",
	fromId : 1,
	groupId : 1
}) );

/*
global.prepareChats = async () => {
	await global.defaultChatInfos.forEach( async chatInfo => {
		await db.Chat.create(chatInfo);
	});
}
*/
