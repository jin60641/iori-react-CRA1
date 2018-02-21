module.exports = function(sequelize, DataTypes) {
	const Post =  sequelize.define('Post', {
		id : { type : DataTypes.INTEGER, primaryKey : true, autoIncrement : true },
		text : { type : DataTypes.STRING, defaultValue : "" },
		html : { type : DataTypes.STRING, defaultValue : "" },
		file : { type : DataTypes.INTEGER, defaultValue : 0 },
		userId : { type : DataTypes.INTEGER, allowNull : false }
	},{
		tableName : 'post',
		timestamps : true,
		paranoid : true,
		freezeTableName : true
	});
	Post.associate = function(models) {
		models.User.hasMany(Post, { foreignKey : 'id', as : 'user' });
		Post.belongsTo(models.User, { foreignKey : 'userId', targetKey : 'id', as : 'user' });
	}
	return Post;
};
