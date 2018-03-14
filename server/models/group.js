module.exports = function(sequelize, DataTypes) {
	const Group =  sequelize.define('Group', {
		id : { type : DataTypes.INTEGER, primaryKey : true, autoIncrement : true },
		userIds : { 
			type : DataTypes.STRING,
			get : function(){
				return this.getDataValue('userIds').split(',')
			},
			set: function (val) {
				this.setDataValue('userIds',val.toString());
			}
		},
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
	return Group;
};
