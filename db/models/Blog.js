module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Blog', {
		BLOG_ID:
			{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		OWNER_UUID:
			{ type: DataTypes.STRING, allowNull: false },
		CREATED:
			{ type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		NAME:
			{ type: DataTypes.TEXT, allowNull: false },
		DESCRIPTION:
			{ type: DataTypes.TEXT, allowNull: false },
		POSTCOUNT:
			{ type: DataTypes.INTEGER, defaultValue: 0 }
	});
}
