'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Tbl_penyelidikan_files_tmp', {
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            id_penyelidikan: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Tbl_penyelidikan_tmp',
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
        await queryInterface.dropTable('Tbl_penyelidikan_files_tmp');
    }
};
