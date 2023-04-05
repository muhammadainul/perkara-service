const debug = require('debug');
const log = debug('perkara-service:log_perkara:services:');

const { isEmpty } = require('lodash');

const { 
    Users, 
    Perkara,  
    Kategori_perkara,
    Log_perkara 
} = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

async function Create (logData, user) {
    const { 
        id_perkara, 
        logdetail, 
        dokumen,
        kategori_id
    } = logData;
    log('[Log Perkara] Create', { logData, user });
    try {
        if (!id_perkara || !logdetail || !dokumen || !kategori_id) {
            throw { error: 'id_perkara / logdetail / dokumen harus dilampirkan.' };
        }

        const checkPerkara = await Perkara.findOne({
            where: { id: id_perkara },
            raw: true
        });
        if (!checkPerkara) {
            throw { error: 'Perkara tidak tersedia.' };
        }

        const checkKategori = await Kategori_perkara.findOne({
            where: { id: kategori_id },
            raw: true
        });
        if (!checkKategori) throw { error: 'Kategori tidak tersedia.' };

        let created;
        if (logdetail === 'upload') {
            created = await Log_perkara.create({
                id_perkara,
                user_id: user.id,
                logdetail: `Upload dokumen ${dokumen}`,
                kategori_id
            });
        } else if (logdetail === 'download') {
            created = await Log_perkara.create({
                id_perkara,
                user_id: user.id,
                logdetail: `Download dokumen ${dokumen}`,
                kategori_id
            });
        } else if (logdetail === 'edit') {
            created = await Log_perkara.create({
                id_perkara,
                user_id: user.id,
                logdetail: `Edit dokumen ${dokumen}`,
                kategori_id
            });
        } else if (logdetail === 'delete') {
            created = await Log_perkara.create({
                id_perkara,
                user_id: user.id,
                logdetail: `Hapus dokumen ${dokumen}`,
                kategori_id
            });
        } else if (logdetail === 'view') {
            created = await Log_perkara.create({
                id_perkara,
                user_id: user.id,
                logdetail: `View dokumen ${dokumen}`,
                kategori_id
            });
        } else {
            created = await Log_perkara.create({
                id_perkara,
                user_id: user.id,
                logdetail: null,
                kategori_id
            });
        }

        return {
            message: 'Log perkara berhasil dibuat.',
            log: await Log_perkara.findOne({
                where: { id: created.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function GetById (perkaraId) {
    log('[Log Perkara] GetById', perkaraId);
    try {
        const logData = await Log_perkara.findAll({
            include: [
                {
                    model: Perkara,
                    attributes: ['no_perkara', 'judul_perkara'],
                    as: 'perkara'
                },
                {
                    model: Users,
                    attributes: ['username', 'nama_lengkap'],
                    as: 'user'
                }
            ],
            attributes: ['id', 'logtime', 'logdetail'],
            where: { id_perkara: perkaraId },
            raw: true
        });
        if (isEmpty(logData)) throw { error: 'Log data tidak tersedia.' };

        return { data: logData };
    } catch (error) {
        return error;
    }
}

async function GetDatatables (logData) {
    const { 
        draw, 
        // order, 
        start, 
        length, 
        // search, 
        // urutan,
        id_perkara,
        no_perkara,
        judul_perkara,
        user_id,
        kategori_id
    } = logData;
    log('[Log Perkara] GetDatatables', logData);
    try {
        if (!kategori_id) throw { error: 'Kategori_id harus dilampirkan.' };

        let whereByKategori = { kategori_id };

        let whereByIdPerkara;
        (id_perkara)
            ? (whereByIdPerkara = { id_perkara })
            : (whereByIdPerkara = {});

        let whereByNoPerkara;
        (no_perkara)
             ? (whereByNoPerkara = { '$perkara.no_perkara$': { [Op.iLike]: `%${no_perkara}%` } })
             : (whereByNoPerkara = {});

        let whereByJudulPerkara;
        (judul_perkara)
            ? (whereByJudulPerkara = { '$perkara.judul_perkara$': { [Op.iLike]: `%${judul_perkara}%` } })
            : (whereByJudulPerkara = {});

        let whereByUserId;
        (user_id)
            ? (whereByUserId = { user_id })
            : (whereByUserId = {});

        const where = {
            ...whereByKategori,
            ...whereByIdPerkara,
            ...whereByNoPerkara,
            ...whereByJudulPerkara,
            ...whereByUserId
        }

        const [recordsTotal, recordsFiltered, data] = await Promise.all([
            Log_perkara.count({}),
            Log_perkara.count({ 
                include: [
                    {
                        model: Perkara,
                        attributes: ['no_perkara', 'judul_perkara'],
                        as: 'perkara'
                    }
                ],
                distinct: true,
                col: 'id_perkara',
                where
            }),
            Log_perkara.findAll({
                attributes: [
                    sequelize.literal('DISTINCT ON ("Log_perkara"."id_perkara") "Log_perkara"."id_perkara"'),
                    'id',
                    'id_perkara',
                    'kategori_id',
                    'logdetail',
                    'logtime'
                ],
                include: [
                    {
                        model: Perkara,
                        attributes: ['no_perkara', 'judul_perkara'],
                        as: 'perkara'
                    }
                ],
                where,
                order: ['id_perkara', ['logtime', 'desc']],
                offset: start,
                limit: length,
                nest: true
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

async function GetDatatablesDetail (logData) {
    const { 
        draw, 
        // order, 
        start, 
        length, 
        // search, 
        urutan,
        id_perkara,
        no_perkara,
        judul_perkara,
        user_id,
        logdetail
    } = logData;
    log('[Log Perkara] GetDatatablesDetail', logData);
    try {
        if (!id_perkara) throw { error: 'ID perkara harus dilampirkan.' };

        let whereByIdPerkara;
        (id_perkara)
            ? (whereByIdPerkara = { id_perkara })
            : (whereByIdPerkara = {});

        let whereByNoPerkara;
        (no_perkara)
             ? (whereByNoPerkara = { '$perkara.no_perkara$': { [Op.iLike]: `%${no_perkara}%` } })
             : (whereByNoPerkara = {});

        let whereByJudulPerkara;
        (judul_perkara)
            ? (whereByJudulPerkara = { '$perkara.judul_perkara$': { [Op.iLike]: `%${judul_perkara}%` } })
            : (whereByJudulPerkara = {});

        let whereByUserId;
        (user_id)
            ? (whereByUserId = { user_id })
            : (whereByUserId = {});


        let whereByLogdetail;
        (logdetail)
            ? (whereByLogdetail = { logdetail: { [Op.iLike]: `%${logdetail}%` } })
            : (whereByLogdetail = {});

        let searchOrder;
        (urutan) 
            ? (searchOrder = [['logtime', urutan]])
            : (searchOrder = [['logtime', 'desc']])

        const where = {
            ...whereByIdPerkara,
            ...whereByNoPerkara,
            ...whereByJudulPerkara,
            ...whereByLogdetail,
            ...whereByUserId
        }

        const [recordsTotal, recordsFiltered, data] = await Promise.all([
            Log_perkara.count({}),
            Log_perkara.count({ 
                include: [
                    {
                        model: Perkara,
                        attributes: ['no_perkara', 'judul_perkara'],
                        as: 'perkara'
                    },
                    {
                        model: Users,
                        attributes: ['id', 'username', 'nama_lengkap'],
                        as: 'user'
                    }
                ],
                where
            }),
            Log_perkara.findAll({
                include: [
                    {
                        model: Perkara,
                        attributes: ['no_perkara', 'judul_perkara'],
                        as: 'perkara'
                    },
                    {
                        model: Users,
                        attributes: ['id', 'username', 'nama_lengkap'],
                        as: 'user'
                    }
                ],
                where,
                order: searchOrder,
                offset: start,
                limit: length,
                nest: true,
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
    GetById,
    GetDatatables,
    GetDatatablesDetail
}