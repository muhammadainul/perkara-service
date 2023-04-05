'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.createTable("Log_integration", {
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true
                },
                type: Sequelize.STRING,
                log: {
                    type: Sequelize.STRING,
                    allowNull: false
                }
            })
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.createTable("Log_integration", {
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true
                },
                type: Sequelize.STRING,
                log: {
                    type: Sequelize.STRING,
                    allowNull: false
                }
            })
        ]);
    }
};
