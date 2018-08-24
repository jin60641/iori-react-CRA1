module.exports = (sequelize, DataTypes) => {
	const Follow =  sequelize.define('Follow', {
		id : { type : DataTypes.INTEGER, primaryKey : true, autoIncrement : true },
	},{
		timestamps : true,
	});
	Follow.associate = models => {
		Follow.belongsTo(models.User, { as : 'to', foreignKey : 'toId', targetKey : 'id' });
		Follow.belongsTo(models.User, { as : 'from', foreignKey : 'fromId', targetKey : 'id' });
		Follow.include = [
			{ model : models.User, as : 'to', attributes : models.User.attributeNames },
			{ model : models.User, as : 'from', attributes : models.User.attributeNames }
		]
	}
	return Follow;
};
