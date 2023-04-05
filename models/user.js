// USERS schema
module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        enabled: DataTypes.BOOLEAN,
        nip: {
            type: DataTypes.STRING,
            unique: true
        },
        nama_lengkap: DataTypes.STRING,
        email: DataTypes.STRING,
        golongan: DataTypes.STRING,
        pangkat: DataTypes.STRING,
        jabatan: DataTypes.STRING,
        kewenangan_id: DataTypes.INTEGER,
        gambar_id: DataTypes.UUID,
        consumer_id: DataTypes.STRING
    },
    {}
    );

    Users.associate = function (models) {
        Users.hasMany(models.Logs, {
            foreignKey: 'user_id'
        });
    };
    
    return Users;
}