const debug = require('debug');
const log = debug('perkara-service:services:');

const { isEmpty } = require('lodash');

const { Master_file_penyelidikan, File_penyelidikan, Logs } = require('../models');
const { Op } = require('sequelize');

async function Create (masterData, user) {
    const { nama } = masterData;
    log('[Master File Penyelidikan] Create', { masterData, user });
    try {
        const checkMasterFile = await Master_file_penyelidikan.findOne({ 
            where: { nama },
            raw: true
        });
        if (checkMasterFile) throw { error: 'Nama master file penyelidikan sudah tersedia.' };

        const created = await Master_file_penyelidikan.create({ nama });

        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Tambah) master file penyelidikan dengan nama ${nama}.`,
            user_id: user.id
        });

        return {
            message: 'Master file penyelidikan berhasil dibuat.',
            data: await Master_file_penyelidikan.findOne({ 
                where: { id: created.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Update (masterId, masterData, user) {
    const { nama } = masterData;
    log('[Master File Panyelidikan] Update', { masterId, masterData, user });
    try {
        const checkMasterFile = await Master_file_penyelidikan.findOne({
            where: { id: masterId },
            raw: true
        });
        if (!checkMasterFile) throw { error: 'Master file penyelidikan tidak tersedia.' };

        const checkMasterFilename = await Master_file_penyelidikan.findOne({
            where: { id: { [Op.ne]: masterId }, nama},
            raw: true
        });
        if (checkMasterFilename) throw { error: 'Nama master file penyelidikan sudah digunakan.' };

        await Master_file_penyelidikan.update({ nama }, { where: { id: masterId } });

        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Update) master file penyelidikan dengan nama ${checkMasterFile.nama}.`,
            user_id: user.id
        });

        return {
            message: 'Master file penyelidikan berhasil diubah.',
            data: await Master_file_penyelidikan.findOne({
                where: { id: masterId }, 
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Delete (masterId, user) {
    log('[Master File Panyelidikan] Delete', { masterId, user });
    try {
        const checkMasterFile = await Master_file_penyelidikan.findOne({
            where: { id: masterId },
            raw: true
        });
        if (!checkMasterFile) throw { error: 'Master file penyelidikan tidak tersedia.' };

        await Master_file_penyelidikan.destroy({ where: { id: masterId } });

        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Hapus) master file penyelidikan dengan nama ${checkMasterFile.nama}.`,
            user_id: user.id
        });

        return {
            message: 'Master file penyelidikan berhasil dihapus.'
        };
    } catch (error) {
        return error;
    }
}

async function GetById (masterId) {
    log('[Master File Penyelidikan] GetById', masterId);
    try {
        const checkMasterFile = await Master_file_penyelidikan.findOne({
            where: { id: masterId }
        });
        if (!checkMasterFile) throw { error: 'Master file penyelidikan tidak tersedia.' };

        return checkMasterFile;
    } catch (error) {
        return error;
    }
}

async function Get () {
    log('[Master File Penyelidikan] Get');
    try {
        const checkMasterFile = await Master_file_penyelidikan.findAll({ raw: true });

        return checkMasterFile;
    } catch (error) {
        return error;
    }
}

async function GetDatatables (masterData) {
    const { draw, order, start, length, search } = masterData;
    log('[Master File Panyelidikan] GetDatatables', masterData);
    try {
        let where;
        !isEmpty(search.value)
            ? (where = {
                nama: { 
                    [Op.iLike]: `%${search.value}%`
                }
            })
            : (where = {});
        
        // let searchOrder
        // if (!isEmpty(order)) {
        //     if (order[0].column === '5') {
        //         searchOrder = [['createdAt', order[0].dir]];
        //     }
        // }

        const [recordsTotal, recordsFiltered, data] = await Promise.all([
            Master_file_penyelidikan.count({}),
            Master_file_penyelidikan.count({ where }),
            Master_file_penyelidikan.findAll({
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
    Get,
    GetDatatables
}