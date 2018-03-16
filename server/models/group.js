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
	Group.associate = function(models) {
		models.User.belongsToMany(Group, { as : 'groups', through : models.UserGroup });
		Group.belongsToMany(models.User, { as : 'users', through : models.UserGroup });
		//Group.hasMany(models.User, { as : 'users', foreignKey : 'userIds', targetKey : 'id' });
		//models.User.hasMany(Group, { as : 'groups', foreignKey : 'groupIds', targetKey : 'id' });
	}
	return Group;
};
