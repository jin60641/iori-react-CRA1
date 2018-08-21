module.exports = function(sequelize, DataTypes) {
	const Group =  sequelize.define('Group', {
		id : { type : DataTypes.INTEGER, primaryKey : true, autoIncrement : true },
		handle : {
			type : DataTypes.STRING,
			get : function(){
				return this.getDataValue('id').toString()
			},
		},
		name : { type : DataTypes.STRING }
	},{
		timestamps : true,
		paranoid : true,
	});
	Group.attributeNames = ["id","handle","name"];
	Group.associate = models => {
		models.User.belongsToMany(Group, { as : 'groups', through : models.UserGroup });
		Group.belongsToMany(models.User, { as : 'users', through : models.UserGroup });

		Group.include = { model : models.User, as : 'users', attributes : models.User.attributeNames };
	}
	return Group;
};
