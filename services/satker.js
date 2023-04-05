const debug = require('debug');
const log = debug('perkara-service:services:');

const { isEmpty } = require('lodash');

const { Satker, Logs } = require('../models');
const { Op } = require('sequelize');

async function Create (satkerData, user) {
    const { nama_satker, akronim } = satkerData;
    log('[Satker] Create', { satkerData, user });
    try {
        const checkSatker = await Satker.findOne({ 
            where: {
                [Op.or]: [ { nama_satker }, { akronim } ]
            },
            raw: true
        });
        if (checkSatker) throw { error: 'Nama satker / akronim satker sudah digunakan.' };

        const created = await Satker.create({ nama_satker, akronim });

        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Tambah) satker dengan nama ${nama_satker}.`,
            user_id: user.id
        });

        return {
            message: 'Satker berhasil dibuat.',
            data: await Satker.findOne({ 
                where: { id: created.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Update (satkerId, satkerData, user) {
    const { nama_satker, akronim } = satkerData;
    log('[Satker] Update', { satkerId, satkerData, user });
    try {
        const checkSatker = await Satker.findOne({
            where: { id: satkerId },
            raw: true
        });
        if (!checkSatker) throw { error: 'Satker tidak tersedia.' };

        const checkSatkerName = await Satker.findOne({
            where: {
                [Op.and]: [
                    { 
                        id: { [Op.ne]: satkerId },
                        [Op.or]: [ { nama_satker }, { akronim } ]
                    }
                ]
            },
            raw: true
        });
        if (checkSatkerName) throw { error: 'Nama satker / akronim satker sudah digunakan.' };

        await Satker.update({ nama_satker, akronim }, { where: { id: satkerId } });

        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Update) satker dengan nama ${checkSatker.nama_satker}.`,
            user_id: user.id
        });

        return {
            message: 'Satker berhasil diubah.',
            data: await Satker.findOne({
                where: { id: satkerId }, 
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Delete (satkerId, user) {
    log('[Satker] Delete', { satkerId, user });
    try {
        const checkSatker = await Satker.findOne({
            where: { id: satkerId },
            raw: true
        });
        if (!checkSatker) throw { error: 'Satker tidak tersedia.' };

        await Satker.destroy({ where: { id: satkerId } });

        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Hapus) satker dengan nama ${checkSatker.nama_satker}.`,
            user_id: user.id
        });

        return {
            message: 'Satker berhasil dihapus.'
        };
    } catch (error) {
        return error;
    }
}

async function GetById (satkerId) {
    log('[Satker] GetById', satkerId);
    try {
        const checkSatker = await Satker.findOne({
            where: { id: satkerId }
        });
        if (!checkSatker) throw { error: 'Satker tidak tersedia.' };

        return {
            data: checkSatker
        };
    } catch (error) {
        return error;
    }
}

async function Get () {
    log('[Satker] Get');
    try {
        const satkerData = await Satker.findAll({});
        
        return { satker: satkerData };
    } catch (error) {
        return error;
    }
}

async function GetDatatables (satkerData) {
    const { draw, order, start, length, search } = satkerData;
    log('[Satker] GetDatatables', satkerData);
    try {
        let where;
        !isEmpty(search.value)
            ? (where = {
                [Op.and]: [
                    {
                        [Op.or]: {
                            nama_satker: { 
                                [Op.iLike]: `%${search.value}%`
                            },
                            akronim: {
                                [Op.iLike]: `%${search.value}%`
                            }
                        }
                    }
                ]
            })
            : (where = {});
        
        // let searchOrder
        // if (!isEmpty(order)) {
        //     if (order[0].column === '5') {
        //         searchOrder = [['createdAt', order[0].dir]];
        //     }
        // }

        const [recordsTotal, recordsFiltered, data] = await Promise.all([
            Satker.count({}),
            Satker.count({ where }),
            Satker.findAll({
                where,
                offset: start,
                limit: length,
                raw: true 
            })
        ]);

        return {
            draw,
            recordsTotal,
            recordsFiltered,
            data
        };
    } catch (error) {
        return error;
    }
}

module.exports = {
    Create,
    Update,
    Delete,
    GetById,
    GetDatatables,
    Get
}