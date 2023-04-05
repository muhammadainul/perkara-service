'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn(
                'File_lapdumas',
                'filename',
                { 
                    type: Sequelize.TEXT,
                    allowNull: true
                }
            ),
            queryInterface.changeColumn(
                'File_penyelidikan',
                'filename',
                { 
                    type: Sequelize.TEXT,
                    allowNull: true
                }
            ),
            queryInterface.changeColumn(
                'File_penyidikan',
                'filename',
                { 
                    type: Sequelize.TEXT,
                    allowNull: true
                }
            ),
            queryInterface.changeColumn(
                'File_perkara',
                'filename',
                { 
                    type: Sequelize.TEXT,
                    allowNull: true
                }
            )
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn(
                'File_lapdumas',
                'filename',
                { 
                    type: Sequelize.TEXT,
                    allowNull: true
                }
            ),
            queryInterface.changeColumn(
                'File_penyelidikan',
                'filename',
                { 
                    type: Sequelize.TEXT,
                    allowNull: true
                }
            ),
            queryInterface.changeColumn(
                'File_penyidikan',
                'filename',
                { 
                    type: Sequelize.TEXT,
                    allowNull: true
                }
            ),
            queryInterface.changeColumn(
                'File_perkara',
                'filename',
                { 
                    type: Sequelize.TEXT,
                    allowNull: true
                }
            )
        ]);
    }
};
