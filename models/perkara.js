// PERKARA schema
module.exports = (sequelize, DataTypes) => {
    const Perkara = sequelize.define('Perkara', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
        inst_nama: DataTypes.STRING,
		no_perkara: {
            type: DataTypes.STRING,
            unique: true
        },
        judul_perkara: DataTypes.STRING,
        tanggal_berkas: DataTypes.DATEONLY,
        tanggal_terima: DataTypes.DATEONLY,
        nama_tersangka: DataTypes.STRING,
        tppu: DataTypes.STRING,
        keterangan: DataTypes.STRING,
        status: DataTypes.BOOLEAN,
        kategori_id: DataTypes.INTEGER,
        kode_satker: DataTypes.STRING,
        uraian: DataTypes.STRING,
        tahun: DataTypes.SMALLINT,
        bulan: DataTypes.INTEGER,
        jenis: DataTypes.STRING,
        kondisi: DataTypes.STRING,
        lokasi_berkas: DataTypes.STRING,
        created_by: DataTypes.UUID,
		createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    { freezeTableName: true }
    );

    Perkara.associate = function (models) {
        Perkara.hasMany(models.File_perkara, { 
            foreignKey: 'id_perkara', 
            as: 'files'
        });

        Perkara.belongsTo(models.Users, {
            foreignKey: 'created_by',
            as: 'user'
        });

        Perkara.belongsTo(models.Kategori_perkara, {
            foreignKey: 'kategori_id',
            as: 'kategori_perkara'
        });

        models.Kategori_perkara.hasMany(Perkara, {
            foreignKey: 'kategori_id',
            as: 'perkara'
        });

        Perkara.belongsTo(models.Satker, {
            foreignKey: 'kode_satker',
            as: 'satker'
        });

        Perkara.hasMany(models.Log_perkara, {
            foreignKey: 'id_perkara',
            as: 'log_perkara'
        });
    };

    return Perkara;
};