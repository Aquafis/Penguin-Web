module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Media', {
		ID:
			{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		IMGJSON:
			{ type: DataTypes.TEXT, allowNull: true },
		VIDJSON:
			{ type: DataTypes.TEXT, allowNull: true }
	});
}
