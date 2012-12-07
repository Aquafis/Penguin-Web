module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Session', {
		USER_UUID:
			{
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
				validate: { isUUID: 4 }
			},
		SESS_ID:
			{
				type: DataTypes.STRING,
				allowNull: true,
				unique: true
			},
		UPDATED:
			{
				type: DataTypes.DATE,
				allowNull: true
			}
	});
}
