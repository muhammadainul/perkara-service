// LOG penyelidikan schema
module.exports = (sequelize, DataTypes) => {
    const LogPenyelidikan = sequelize.define('Log_penyelidikan', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
		id_penyelidikan: DataTypes.STRING,
		user_id: DataTypes.UUID,
		logtime: {
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('now')
		},
		logdetail: DataTypes.STRING
    },
    { 
        timestamps: false,
        freezeTableName: true
    }
    );

    LogPenyelidikan.associate = function (models) {
        LogPenyelidikan.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'user'
        });
        LogPenyelidikan.belongsTo(models.Penyelidikan, {
            foreignKey: 'id_penyelidikan',
            as: 'penyelidikan'
        });
    }

    return LogPenyelidikan;
}