module.exports = {
    up: async (queryInterface, Sequelize) =>
        await queryInterface.createTable("Log_penyelidikan", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            id_penyelidikan: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Penyelidikan',
                    key: 'id'
                }
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            logtime: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('now')
            },
            logdetail: { 
                type: Sequelize.STRING,
                allowNull: true
            }
        }),
    down: async (queryInterface /* , Sequelize */) => await queryInterface.dropTable("Log_penyelidikan"),
  }