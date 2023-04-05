// MASTER FILE_LAPDUMAS Schema
module.exports = (sequelize, DataTypes) => {
    const Master_file_lapdumas = sequelize.define('Master_file_lapdumas',
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
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        },
        { freezeTableName: true }
    );

    return Master_file_lapdumas;
};