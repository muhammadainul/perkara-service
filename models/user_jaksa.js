// User_jaksa schema
module.exports = (sequelize, DataTypes) => {
    const User_jaksa = sequelize.define('User_jaksa', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        id_penyelidikan: DataTypes.STRING,
        id_penyidikan: DataTypes.STRING,
        id_perkara: DataTypes.STRING,
        username: DataTypes.STRING,
        nip: DataTypes.STRING,
        nama_lengkap: DataTypes.STRING,
        email: DataTypes.STRING,
        golongan: DataTypes.STRING,
        pangkat: DataTypes.STRING,
        jabatan: DataTypes.STRING
    },
    { freezeTableName: true }
    );

    User_jaksa.associate = function (models) {
        // User_jaksa.belongsTo(models.Penyelidikan, {
        //     foreignKey: 'id_penyelidikan',
        //     as: 'penyelidikan'
        // });

        User_jaksa.belongsTo(models.Penyidikan, {
            foreignKey: 'id_penyidikan',
            as: 'penyidikan'
        });
        models.Penyidikan.hasMany(User_jaksa, {
            foreignKey: 'id_penyidikan',
            as: 'user_jaksa'
        });

        User_jaksa.belongsTo(models.Penyelidikan, {
            foreignKey: 'id_penyelidikan',
            as: 'penyelidikan'
        });
        models.Penyelidikan.hasMany(User_jaksa, {
            foreignKey: 'id_penyelidikan',
            as: 'user_jaksa'
        });

        User_jaksa.belongsTo(models.Perkara, {
            foreignKey: 'id_perkara',
            as: 'perkara'
        });
        models.Perkara.hasMany(User_jaksa, {
            foreignKey: 'id_perkara',
            as: 'user_jaksa'
        });

        User_jaksa.hasOne(models.Users, {
            foreignKey: 'nip',
            as: 'user'
        });
        models.Users.belongsTo(User_jaksa, {
            foreignKey: 'nip',
            as: 'user_jaksa'
        });
    };
    
    return User_jaksa;
}