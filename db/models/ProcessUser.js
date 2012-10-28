module.exports = function (sequelize, DataTypes) {
	return sequelize.define('ProcessUser', {
		UUID:
			{
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
				validate: { isUUID: 4 }
			},
		FIRST:
			{
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					isAlpha: true,
					len: [2, 25]
				}
				
			},
		LAST:
			{
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					isAlpha: true,
					len: [2, 25]
				}
			},
		STUID:
			{
				type: DataTypes.INTEGER,
				allowNull: false,
				unique: true,
				validate: {
					isNumeric: true,
					len: [7, 9]
				}
			},
		TOKEN:
			{
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validate: { isAlphanumeric: true }
			},
		CREATED:
			{ type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		DELETE:
			{ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 },
		PROCESS:
			{ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 1 },
		WAITING:
			{ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 },
		LAST_UPDATED:
			{ type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
	});
}
