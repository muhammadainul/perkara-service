'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn(
                'Lapdumas',
                'created_by',
                { 
                    type: Sequelize.UUID,
                    allowNull: true,
                    references: {
                        model: 'Users',
                        key: 'id'
                    }
                }
            ),
            queryInterface.changeColumn(
                'Penyelidikan',
                'created_by',
                { 
                    type: Sequelize.UUID,
                    allowNull: true,
                    references: {
                        model: 'Users',
                        key: 'id'
                    }
                }
            ),
            queryInterface.changeColumn(
                'Penyidikan',
                'created_by',
                { 
                    type: Sequelize.UUID,
                    allowNull: true,
                    references: {
                        model: 'Users',
                        key: 'id'
                    }
                }
            ),
            queryInterface.changeColumn(
                'Perkara',
                'created_by',
                { 
                    type: Sequelize.UUID,
                    allowNull: true,
                    references: {
                        model: 'Users',
                        key: 'id'
                    }
                }
            )
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn(
                'Lapdumas',
                'created_by',
                { 
                    type: Sequelize.UUID,
                    allowNull: true,
                    references: {
                        model: 'Users',
                        key: 'id'
                    }
                }
            ),
            queryInterface.changeColumn(
                'Penyelidikan',
                'created_by',
                { 
                    type: Sequelize.UUID,
                    allowNull: true,
                    references: {
                        model: 'Users',
                        key: 'id'
                    }
                }
            ),
            queryInterface.changeColumn(
                'Penyidikan',
                'created_by',
                { 
                    type: Sequelize.UUID,
                    allowNull: true,
                    references: {
                        model: 'Users',
                        key: 'id'
                    }
                }
            ),
            queryInterface.changeColumn(
                'Perkara',
                'created_by',
                { 
                    type: Sequelize.UUID,
                    allowNull: true,
                    references: {
                        model: 'Users',
                        key: 'id'
                    }
                }
            )
        ]);
    }
};
