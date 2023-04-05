// LAPDUMAS schema
module.exports = (sequelize, DataTypes) => {
    const Lapdumas = sequelize.define('Lapdumas', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
        inst_nama: DataTypes.STRING,
		no_laporan: {
            type: DataTypes.STRING,
            unique: true
        },
        tanggal_surat: DataTypes.DATEONLY,
        tanggal_terima: DataTypes.DATEONLY,
        asal_surat: DataTypes.STRING,
        perihal: DataTypes.STRING,
        isi: DataTypes.STRING,
        status: DataTypes.STRING,
        kasus_posisi: DataTypes.STRING,
        pembuat_catatan: DataTypes.STRING,
        created_by: DataTypes.UUID,
		createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    { freezeTableName: true }
    );

    Lapdumas.associate = function (models) {
        Lapdumas.hasMany(models.File_lapdumas, { 
            foreignKey: 'id_lapdumas', 
            as: 'files'
        });
        Lapdumas.belongsTo(models.Users, {
            foreignKey: 'created_by',
            as: 'user'
        });``
    };
    return Lapdumas;
};