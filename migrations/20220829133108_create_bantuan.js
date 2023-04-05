'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Bantuan', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            reported_by: {
                type: Sequelize.UUID,
                allowNull: false
            },
            keluhan: Sequelize.TEXT,
            status: { 
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            keterangan: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Bantuan');
    }
};
