module.exports = function(sequelize, DataTypes){
	const Notice = sequelize.define('Notice', {
		id : { type : DataTypes.INTEGER, primaryKey : true, autoIncrement : true },
    text : { type : DataTypes.STRING },
    type : { type : DataTypes.STRING },
	},{
		timestamps : true,
		paranoid : true,
	});
	Notice.associate = models => {
    Notice.belongsTo(models.User, { as : 'from', foreignKey : 'fromId', targetKey : 'id' });
    Notice.belongsTo(models.User, { as : 'to', foreignKey : 'toId', targetKey : 'id' });
    Notice.belongsTo(models.Chat, { as : 'chat', foreignKey : 'chatId', targetKey : 'id' });
    Notice.belongsTo(models.Post, { as : 'post', foreignKey : 'postId', targetKey : 'id' });
    Notice.belongsTo(models.Follow, { as : 'follow', foreignKey : 'followId', targetKey : 'id' });
    Notice.include = [
      { model : models.User, as : 'from', attributes : models.User.attributes },
      { model : models.User, as : 'to', attributes : models.User.attributes },
      { model : models.Chat, as : 'chat', attributes : models.Chat.attributes, include : [{ model : models.Group, as : 'group', attributes : models.Group.attributeNames }] },
      { model : models.Post, as : 'post', attributes : models.Post.attributes },
      { model : models.Follow, as : 'follow', attributes : models.Follow.attributes },
    ]
	}
	return Notice;
};
