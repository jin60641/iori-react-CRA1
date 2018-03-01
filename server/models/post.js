module.exports = function(sequelize, DataTypes) {
	const Post =  sequelize.define('Post', {
		id : { type : DataTypes.INTEGER, primaryKey : true, autoIncrement : true },
		text : { type : DataTypes.STRING, defaultValue : "" },
		html : { type : DataTypes.STRING, defaultValue : "" },
		file : { type : DataTypes.INTEGER, defaultValue : 0 },
	},{
		timestamps : true,
		paranoid : true
	});
	Post.associate = function(models) {
		models.User.hasMany(Post);
		Post.belongsTo(models.User);
	}
	return Post;
};
