// MASTER_FILE_PERKARA Schema
module.exports = (sequelize, DataTypes) => {
    const Master_file_perkara = sequelize.define('Master_file_perkara',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            nama: {
                type: DataTypes.STRING,
                allowNull: true
            },
            keterangan: DataTypes.TEXT,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        },
        { freezeTableName: true }
    );

    return Master_file_perkara;
};