module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Author', {
		ID:
			{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		UUID:
			{ type: DataTypes.STRING, allowNull: false },
		BLOG_ID:
			{ type: DataTypes.INTEGER, allowNull: false },
		CREATED:
			{ type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		POSTCOUNT:
			{ type: DataTypes.INTEGER, defaultValue: 0 }
	});
}
