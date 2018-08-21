module.exports = function(sequelize, DataTypes) {
	const Chat =  sequelize.define('Chat', {
		id : { type : DataTypes.INTEGER, primaryKey : true, autoIncrement : true },
		text : { type : DataTypes.STRING, defaultValue : "" },
		file : { type : DataTypes.BOOLEAN, defaultValue : false },
		type : { type : DataTypes.STRING, allowNull : false }
	},{
		timestamps : true,
		paranoid : true,
	});
	Chat.associate = function(models) {
		Chat.belongsTo(models.User, { as : 'to', foreignKey : 'toId', targetKey : 'id' });
		Chat.belongsTo(models.User, { as : 'from', foreignKey : 'fromId', targetKey : 'id' });
		Chat.belongsTo(models.Group, { as : 'group', foreignKey : 'groupId', targetKey : 'id' });
		Chat.include = [
			{ model : models.User, as : 'from', attributes : models.User.attributeNames },
			{ model : models.User, as : 'to', attributes : models.User.attributeNames },
			{ model : models.Group, as : 'group', attributes : models.Group.attributeNames, include : [{ model : models.User, as : 'users', attributes : models.User.attributeNames}] }
		]
	}
	return Chat;
};
