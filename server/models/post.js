module.exports = (sequelize, DataTypes) => {
	const Post =  sequelize.define('Post', {
		id : { type : DataTypes.INTEGER, primaryKey : true, autoIncrement : true },
		text : { type : DataTypes.STRING, defaultValue : "" },
		html : { type : DataTypes.STRING, defaultValue : "" },
		file : { type : DataTypes.INTEGER, defaultValue : 0 },
	},{
		timestamps : true,
		paranoid : true,
	});
	Post.associate = (models) => {
		Post.belongsTo(models.User, { as : 'user', foreignKey : 'userId', targetKey : 'id' });
		Post.include = { model : models.User, as : 'user' };
	}
	return Post;
};
