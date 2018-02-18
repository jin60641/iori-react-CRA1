
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Post', {
		id : { type : DataTypes.INTEGER, primaryKey : true, autoIncrement : true },
		text : { type : DataTypes.STRING, defaultValue : "" },
		html : { type : DataTypes.STRING, defaultValue : "" },
		file : { type : DataTypes.INTEGER, defaultValue : 0 }
	},{
		tableName : 'post',
		timestamps : true,
		paranoid : true,
		freezeTableName : true
	},{
		classMethods : {
			associate : function(models) {
				Post.belongsTo(models.User);
			}
		}
	});
};
