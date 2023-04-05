const debug = require('debug');
const log = debug('perkara-service:log_integration:services:');

const { Log_integration } = require('../models');

async function GetLog (logData, user) {
    const { type } = logData;
    log('[Log Integration] Get Log', { logData, user });
    try {
        if (!type) throw { error: 'Tipe harus dilampirkan.' };

        const data = await Log_integration.findOne({
            where: { type },
            raw: true
        });

        if (!data) throw { error: 'Data tidak tersedia.' };

        return data;
    } catch (error) {
        return error;
    }
}

module.exports = {
    GetLog
}