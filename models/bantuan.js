// Bantuan schema
module.exports = (sequelize, DataTypes) => {
    const Bantuan = sequelize.define('Bantuan', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		reported_by: DataTypes.UUID,
        keluhan: DataTypes.TEXT,
        status: DataTypes.BOOLEAN,
        keterangan: DataTypes.STRING,
		createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    { freezeTableName: true }
    );

    Bantuan.associate = function (models) {
        Bantuan.belongsTo(models.Users, {
            foreignKey: 'reported_by',
            as: 'reported'
        });
        models.Users.hasMany(Bantuan, {
            foreignKey: 'reported_by',
            as: 'keluhan'
        });
    };

    return Bantuan;
}