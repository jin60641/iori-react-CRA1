module.exports = function(sequelize, DataTypes){
	const User = sequelize.define('User', {
		id : { type : DataTypes.INTEGER, primaryKey : true, autoIncrement : true },
		admin : { type : DataTypes.BOOLEAN, defaultValue : false },
		email : { type : DataTypes.STRING, allowNull : false },
		name : { type : DataTypes.STRING(32), allowNull : false },
		password : { type : DataTypes.STRING, allowNull : false },
		verify : { type : DataTypes.BOOLEAN, defaultValue : false },
		profile : { type : DataTypes.BOOLEAN, defaultValue : false }
	},{
		timestamps : true,
		paranoid : true
	});
	return User;
};
