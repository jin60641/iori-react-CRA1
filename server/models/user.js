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
					const shasum = crypto.createHash('sha1');
					user.password = shasum.update(user.password).digest('hex');
				}
			}
		}
	});
	User.prototype.validateLink = function (source) {
		const shasum = crypto.createHash('sha1');
		return shasum.update(this.email).digest('hex') === source;
	};
	User.prototype.validatePassword = function (source) {
		const shasum = crypto.createHash('sha1');
		return shasum.update(source).digest('hex') === this.password;
	};
	User.attributeNames = ["id","email","name","handle","profile","header","introduce","verify"];
	User.associate = models => {
		User.include = { model : models.Group, as : 'groups', attributes : models.Group.attributes };
	}
	return User;
};
