module.exports = function(sequelize, DataTypes){
	const Link = sequelize.define('Link', {
		id : { type : DataTypes.INTEGER, primaryKey : true, autoIncrement : true },
    link : { type : DataTypes.STRING, allowNull : false },
    title : { type : DataTypes.STRING },
    description : { type : DataTypes.STRING },
    image : { type : DataTypes.STRING },
	},{
		timestamps : true,
    paranoid : true
	});
	return Link;
};
