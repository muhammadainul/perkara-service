'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn(
                'Penyidikan',
                'status',
                { 
                    type: Sequelize.BOOLEAN,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'Penyidikan',
                'keterangan',
                { 
                    type: Sequelize.STRING,
                    allowNull: true
                }
            )
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn(
                'Penyidikan',
                'status',
                { 
                    type: Sequelize.BOOLEAN,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'Penyidikan',
                'keterangan',
                { 
                    type: Sequelize.STRING,
                    allowNull: true
                }
            )
        ]);
    }
};
