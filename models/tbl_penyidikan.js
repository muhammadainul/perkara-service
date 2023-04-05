// Tbl_penyidikan_tmp schema
module.exports = (sequelize, DataTypes) => {
    const Tbl_penyidikan_tmp = sequelize.define('Tbl_penyidikan_tmp', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
        id_penyelidikan: DataTypes.STRING,
        kode_satker: DataTypes.STRING,
        inst_nama: DataTypes.STRING,
		nomor_sprintdik: DataTypes.STRING,
        tanggal_sprintdik: DataTypes.DATEONLY,
        nama_perkara: DataTypes.STRING,
        nama_tersangka: DataTypes.STRING,
        jenis_perkara: DataTypes.STRING,
        tppu: DataTypes.STRING,
        status: DataTypes.STRING,
		createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    { freezeTableName: true }
    );

    Tbl_penyidikan_tmp.associate = function (models) {
        Tbl_penyidikan_tmp.belongsTo(models.Tbl_penyelidikan_tmp, {
            foreignKey: 'id_penyelidikan',
            as: 'penyelidikan'
        });
    };

    return Tbl_penyidikan_tmp;
}