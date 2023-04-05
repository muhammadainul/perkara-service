'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Tbl_penyelidikan_jaksa_tmp', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
            },
            id_penyelidikan: {
                type: Sequelize.STRING,
                allowNull: true,
                references: {
                    model: 'Tbl_penyelidikan_tmp',
                    key: 'id'
                }
            },
            nip: Sequelize.STRING,
            nama: Sequelize.STRING,
            golongan: Sequelize.STRING,
            pangkat: Sequelize.STRING,
            jabatan: Sequelize.STRING,
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Tbl_penyelidikan_jaksa_tmp');
    }
};
