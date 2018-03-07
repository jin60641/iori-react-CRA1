module.exports = function(sequelize, DataTypes) {
	const Group =  sequelize.define('Group', {
		id : { type : DataTypes.INTEGER, primaryKey : true, autoIncrement : true }
	},{
		timestamps : true,
		paranoid : true,
	});
	return Group;
};
