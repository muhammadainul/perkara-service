'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Tbl_prapenuntutan_files_tmp', {
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            id_prapenuntutan: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Tbl_prapenuntutan_tmp',
                    key: 'id'
                }
            },
            filename: Sequelize.TEXT,
            originalname: Sequelize.STRING,
            keterangan: Sequelize.STRING,
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
        await queryInterface.dropTable('Tbl_prapenuntutan_files_tmp');
    }
};
