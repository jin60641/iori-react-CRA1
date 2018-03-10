const path = require("path");
const Sequelize = require("sequelize");
const settings = require(__dirname + '/../config/settings.js');
const fs = require('fs-extra');
const sequelize = new Sequelize(settings.db.database, settings.db.username, settings.db.password, settings.db);
const db = {};

fs
	.readdirSync(__dirname)
	.filter( (file) => {
		return (file.indexOf('.') !== 0) && (file !== 'index.js');
	})
	.forEach( (file) => {
		const model = sequelize.import(path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach( (modelName) => {
	if ("associate" in db[modelName]) {
		db[modelName].associate(db);
	}
});

sequelize.sync(
	{force:true}
);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
