// KATEGORI_PERKARA schema
module.exports = (sequelize, DataTypes) => {
    const KategoriPerkara = sequelize.define('Kategori_perkara', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		kategori: DataTypes.STRING,
		createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    { freezeTableName: true }
    );

    return KategoriPerkara;
}