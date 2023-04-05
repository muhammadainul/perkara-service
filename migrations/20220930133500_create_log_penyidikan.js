module.exports = {
    up: async (queryInterface, Sequelize) =>
        await queryInterface.createTable("Log_penyidikan", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            id_penyidikan: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Penyidikan',
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
    down: async (queryInterface /* , Sequelize */) => await queryInterface.dropTable("Log_penyidikan"),
  }