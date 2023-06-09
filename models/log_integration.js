// LOG INTEGRATION schema
module.exports = (sequelize, DataTypes) => {
    const Log_integration = sequelize.define('Log_integration', {
		id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type: DataTypes.STRING,
		log: DataTypes.STRING
    },
    { 
        timestamps: false,
        freezeTableName: true
    }
    );

    return Log_integration;
}