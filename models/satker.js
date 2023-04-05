// SATKER Schema
module.exports = (sequelize, DataTypes) => {
    const Satker = sequelize.define('Satker',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            nama_satker: DataTypes.STRING,
            akronim: DataTypes.STRING,
            id_kejati: DataTypes.STRING,
            id_kejari: DataTypes.STRING,
            id_cabjari: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        },
        { freezeTableName: true }
    );

    return Satker;
};