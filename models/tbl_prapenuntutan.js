// Tbl_prapenuntutan_tmp schema
module.exports = (sequelize, DataTypes) => {
    const Tbl_prapenuntutan_tmp = sequelize.define('Tbl_prapenuntutan_tmp', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
        kode_satker: DataTypes.STRING,
        inst_nama: DataTypes.STRING,
		nomor_berkas: DataTypes.STRING,
        tanggal_berkas: DataTypes.DATEONLY,
        tanggal_terima: DataTypes.DATEONLY,
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

    return Tbl_prapenuntutan_tmp;
}