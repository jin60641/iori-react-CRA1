const crypto = require('crypto');
module.exports = function(sequelize, DataTypes){
	const User = sequelize.define('User', {
		id : { type : DataTypes.INTEGER, primaryKey : true, autoIncrement : true },
		admin : { type : DataTypes.BOOLEAN, defaultValue : false },
		email : { type : DataTypes.STRING, allowNull : false },
		name : { type : DataTypes.STRING(32), allowNull : false },
		handle : { type : DataTypes.STRING(32), allowNull : false },
		password : { type : DataTypes.STRING, allowNull : false },
		introduce : { type : DataTypes.STRING, defaultValue : "" },
		verify : { type : DataTypes.BOOLEAN, defaultValue : false },
		profile : { type : DataTypes.BOOLEAN, defaultValue : false },
		header : { type : DataTypes.BOOLEAN, defaultValue : false },
	},{
		timestamps : true,
		paranoid : true,
		hooks: {
			afterValidate: function(user) {
				if (user.password) {
					user.password = User.createHashedPassword(user.password);
				}
			}
		}
	});
	User.createHashedEmail = function (source) {
		const shasum = crypto.createHash('sha1');
		return shasum.update(source).digest('hex');
	};
	User.createHashedPassword = function (source) {
		const shasum = crypto.createHash('sha1');
		return shasum.update(source).digest('hex');
	};
	User.attributeNames = ["id","email","name","handle","profile","header","introduce","verify"];
	User.associate = models => {
		User.include = { model : models.Group, as : 'groups', attributes : models.Group.attributeNames };
	}
	return User;
};
