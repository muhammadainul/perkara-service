// Penyelidikan schema
module.exports = (sequelize, DataTypes) => {
    const Penyelidikan = sequelize.define('Penyelidikan', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
        id_lapdumas: DataTypes.STRING,
		no_sprintlid: {
            type: DataTypes.STRING,
            unique: true
        },
        inst_nama: DataTypes.STRING,
        tanggal_sprintlid: DataTypes.DATEONLY,
        perihal: DataTypes.STRING,
        kasus_posisi: DataTypes.STRING,
        status: DataTypes.STRING,
        created_by: DataTypes.UUID,
		createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    { freezeTableName: true }
    );

    Penyelidikan.associate = function (models) {
        Penyelidikan.hasMany(models.File_penyelidikan, { 
            foreignKey: 'id_penyelidikan', 
            as: 'files'
        });
        Penyelidikan.belongsTo(models.Users, {
            foreignKey: 'created_by',
            as: 'user'
        });

        Penyelidikan.belongsTo(models.Lapdumas, {
            foreignKey: 'id_lapdumas',
            as: 'lapdumas'
        });
    };
    return Penyelidikan;
};