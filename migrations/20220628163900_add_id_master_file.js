'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn(
                'File_lapdumas',
                'id_master_file',
                { 
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'Master_file_lapdumas',
                        key: 'id'
                    }
                }
            ),
            queryInterface.addColumn(
                'File_penyelidikan',  
                'id_master_file',
                { 
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'Master_file_penyelidikan',
                        key: 'id'
                    }
                }
            )
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn(
                'File_lapdumas',
                'id_master_file',
                { 
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'Master_file_lapdumas',
                        key: 'id'
                    }
                }
            ),
            queryInterface.addColumn(
                'File_penyelidikan',  
                'id_master_file',
                { 
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'Master_file_penyelidikan',
                        key: 'id'
                    }
                }
            )
        ]);
    }
};
