// Penyidikan schema
module.exports = (sequelize, DataTypes) => {
    const Penyidikan = sequelize.define('Penyidikan', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
        id_penyelidikan: DataTypes.STRING,
        inst_nama: DataTypes.STRING,
		no_sprintdik: {
            type: DataTypes.STRING,
            unique: true
        },
        tanggal_sprintdik: DataTypes.DATEONLY,
        nama_perkara: DataTypes.STRING,
        nama_tersangka: DataTypes.STRING,
        jenis_perkara: DataTypes.STRING,
        tppu: DataTypes.STRING,
        status: DataTypes.BOOLEAN,
        keterangan: DataTypes.STRING,
        created_by: DataTypes.UUID,
		createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    { freezeTableName: true }
    );

    Penyidikan.associate = function (models) {
        Penyidikan.hasMany(models.File_penyidikan, { 
            foreignKey: 'id_penyidikan', 
            as: 'files'
        });
        Penyidikan.belongsTo(models.Users, {
            foreignKey: 'created_by',
            as: 'user'
        });

        Penyidikan.belongsTo(models.Penyelidikan, {
            foreignKey: 'id_penyelidikan',
            as: 'penyelidikan'
        });
    };
    return Penyidikan;
};