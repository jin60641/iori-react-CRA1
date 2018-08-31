module.exports = function(sequelize, DataTypes){
	const Reply = sequelize.define('Reply', {
		id : { type : DataTypes.INTEGER, primaryKey : true, autoIncrement : true },
    text : { type : DataTypes.STRING }
	},{
		timestamps : true,
	});
	Reply.associate = models => {
    Reply.belongsTo(models.User, { as : 'user', foreignKey : 'userId', targetKey : 'id' });
    Reply.belongsTo(models.Post, { as : 'post', foreignKey : 'postId', targetKey : 'id' });
    Reply.include = [
      { model : models.User, as : 'user', attributes : models.User.attributes },
      { model : models.Post, as : 'post', attributes : models.Post.attributes },
    ]
	}
	return Reply;
};
