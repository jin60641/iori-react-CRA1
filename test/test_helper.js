const db = require('../server/models/index.js');
const chai = require('chai');
const chaiDeepMatch = require('chai-deep-match');
const chaiArrays = require('chai-arrays');

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

global.defaultUserInfo = {
	email : "test@iori.kr",
	handle : "test",
	password : "1234",
	name : "테스트",
}
