module.exports = function(sequelize, DataTypes) {
	const userGroup =  sequelize.define('UserGroup', {
	},{
		timestamps : true,
		paranoid : true,
	});
	return userGroup;
};
