'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Tbl_prapenuntutan_jaksa_tmp', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
            },
            id_penuntutan: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Tbl_prapenuntutan_tmp',
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
        await queryInterface.dropTable('Tbl_prapenuntutan_jaksa_tmp');
    }
};
