module.exports = function(sequelize, DataTypes){
	const Hide = sequelize.define('Hide', {
		id : { type : DataTypes.INTEGER, primaryKey : true, autoIncrement : true },
	},{
		timestamps : true,
	});
	Hide.associate = models => {
    Hide.belongsTo(models.Post, { as : 'post', foreignKey : 'postId', targetKey : 'id' });
    Hide.include = [
      { model : models.Post, as : 'post', attributes : models.Post.attributes },
    ]
	}
	return Hide;
};
