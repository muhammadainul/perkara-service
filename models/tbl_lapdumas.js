// Tbl_lapdumas schema
module.exports = (sequelize, DataTypes) => {
    const Tbl_lapdumas_tmp = sequelize.define('Tbl_lapdumas_tmp', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
        kode_satker: DataTypes.STRING,
        inst_nama: DataTypes.STRING,
		nomor_surat: DataTypes.STRING,
        tanggal_surat: DataTypes.DATEONLY,
        tanggal_terima: DataTypes.DATEONLY,
        kasus_posisi: DataTypes.STRING,
        asal_surat: DataTypes.STRING,
        status: DataTypes.STRING,
		createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    { freezeTableName: true }
    );

    return Tbl_lapdumas_tmp;
}