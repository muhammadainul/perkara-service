const debug = require('debug');
const log = debug('perkara-service:services:');

const { isEmpty } = require('lodash');

const { Kategori_perkara, Logs } = require('../models');
const { Op } = require('sequelize');

async function Create (kategoriData, user) {
    const { kategori } = kategoriData;
    log('[Kategori Perkara] Create', { kategoriData, user });
    try {
        const created = await Kategori_perkara.create({ kategori });

        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Tambah) kategori perkara dengan kategori ${created.kategori}.`,
            user_id: user.id
        });

        return {
            message: 'Kategori perkara berhasil dibuat.',
            data: await Kategori_perkara.findOne({
                where: { id: created.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Update (kategoriId, kategoriData, user) {
    const { kategori } = kategoriData;
    log('[Kategori Perkara] Update', { kategoriId, kategoriData, user });
    try {
        const checkKategori = await Kategori_perkara.findOne({ 
            where: { id: kategoriId },
            raw: true
        })
        if (!checkKategori) throw { error: 'Kategori tidak tersedia.' };

        await Kategori_perkara.update({
            kategori
            },
            { where: { id: kategoriId }}
        );

        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Update) kategori perkara dengan kategori ${checkKategori.kategori}.`,
            user_id: user.id
        });

        return {
            message: 'Kategori perkara berhasil diubah.',
            data: await Kategori_perkara.findOne({
                where: { id: checkKategori.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Delete (kategoriId, user) {
    log('[Kategori Perkara] Delete', { kategoriId, user });
    try {
        const checkKategori = await Kategori_perkara.findOne({ 
            where: { id: kategoriId },
            raw: true
        })
        if (!checkKategori) throw { error: 'Kategori tidak tersedia.' };
        
        await Kategori_perkara.destroy({ where: { id: kategoriId }});
       
        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Hapus) kategori perkara dengan kategori ${checkKategori.kategori}.`,
            user_id: user.id
        });

        return {
            message: 'Kategori perkara berhasil dihapus.'
        };
    } catch (error) {
        return error;
    }
}

async function GetById (kategoriId) {
    log('[Kategori Perkara] GetById', kategoriId);
    try {
        const checkKategori = await Kategori_perkara.findOne({ 
            where: { id: kategoriId },
            raw: true
        })
        if (!checkKategori) throw { error: 'Kategori tidak tersedia.' };
        
        return {
            data: checkKategori
        };
    } catch (error) {
        return error;
    }
}

async function Get () {
    log('[Kategori Perkara] Get');
    try {
        const kategoriData = await Kategori_perkara.findAll({ raw: true });
        
        return { kategori_perkara: kategoriData };
    } catch (error) {
        return error;
    }
}

async function GetDatatables (kategoriData) {
    const { draw, order, start, length, search } = kategoriData;
    log('[Kategori Perkara] GetDatatables', kategoriData);
    try {
        let where;
        !isEmpty(search.value)
            ? (where = {
                kategori: { 
                    [Op.iLike]: `%${search.value}%`
                }
            })
            : (where = {});

        const [recordsTotal, recordsFiltered, data] = await Promise.all([
            Kategori_perkara.count({}),
            Kategori_perkara.count({ where }),
            Kategori_perkara.findAll({
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