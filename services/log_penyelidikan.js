const debug = require('debug');
const log = debug('perkara-service:log_penyelidikan:services:');

const { isEmpty } = require('lodash');

const { 
    Users, 
    Penyelidikan,
    User_jaksa,
    Log_penyelidikan 
} = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

async function Create (logData, user) {
    const { 
        id_penyelidikan, 
        logdetail, 
        dokumen
    } = logData;
    log('[Log Penyelidikan] Create', { logData, user });
    try {
        if (!id_penyelidikan || !logdetail || !dokumen) {
            throw { error: 'Form harus dilampirkan.' };
        }

        const checkPenyelidikan = await Penyelidikan.findOne({
            where: { id: id_penyelidikan },
            raw: true
        });
        if (!checkPenyelidikan) {
            throw { error: 'Penyelidikan tidak tersedia.' };
        }

        let created;
        if (logdetail === 'upload') {
            created = await Log_penyelidikan.create({
                id_penyelidikan,
                user_id: user.id,
                logdetail: `Upload dokumen ${dokumen}`
            });
        } else if (logdetail === 'download') {
            created = await Log_penyelidikan.create({
                id_penyelidikan,
                user_id: user.id,
                logdetail: `Download dokumen ${dokumen}`
            });
        } else if (logdetail === 'edit') {
            created = await Log_penyelidikan.create({
                id_penyelidikan,
                user_id: user.id,
                logdetail: `Edit dokumen ${dokumen}`
            });
        } else if (logdetail === 'delete') {
            created = await Log_penyelidikan.create({
                id_penyelidikan,
                user_id: user.id,
                logdetail: `Hapus dokumen ${dokumen}`
            });
        } else if (logdetail === 'view') {
            created = await Log_penyelidikan.create({
                id_penyelidikan,
                user_id: user.id,
                logdetail: `View dokumen ${dokumen}`
            });
        } else {
            created = await Log_penyelidikan.create({
                id_penyelidikan,
                user_id: user.id,
                logdetail: null
            });
        }

        return {
            message: 'Log penyelidikan berhasil dibuat.',
            log: await Log_penyelidikan.findOne({
                where: { id: created.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function GetById (penyelidikan_id) {
    log('[Log Penyelidikan] GetById', penyelidikan_id);
    try {
        const logData = await Log_penyelidikan.findAll({
            include: [
                {
                    model: Penyelidikan,
                    as: 'penyelidikan'
                },
                {
                    model: Users,
                    attributes: ['username', 'nama_lengkap'],
                    as: 'user'
                }
            ],
            attributes: ['id', 'logtime', 'logdetail'],
            where: { id_penyelidikan: penyelidikan_id },
            raw: true
        });
        if (isEmpty(logData)) throw { error: 'Log data tidak tersedia.' };

        return logData;
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
        id_penyelidikan,
        perihal,
        no_sprintlid,
        kasus_posisi,
        user_id,
        logdetail
    } = logData;
    log('[Log Penyelidikan] GetDatatables', logData);
    try {
        let whereByIdPenyelidikan;
        (id_penyelidikan) 
            ? (whereByIdPenyelidikan = { id_penyelidikan })
            : (whereByIdPenyelidikan = {});

        let whereByNosprintlid;
        (no_sprintlid) 
            ? (whereByNosprintlid = { '$penyelidikan.no_sprintlid$': { [Op.iLike]: `%${no_sprintlid}%` } })
            : (whereByNosprintlid = {});

        let whereByPerihal;
        (perihal)
            ? (whereByPerihal = { '$penyelidikan.perihal$': { [Op.iLike]: `%${perihal}%` } })
            : (whereByPerihal = {});

        let whereByKasusPosisi;
        (kasus_posisi)
            ? (whereByKasusPosisi = { '$penyelidikan.kasus_posisi$': { [Op.iLike]: `%${kasus_posisi}%` } })
            : (whereByKasusPosisi = {});
    
        
        let whereByLogdetail;
        (logdetail)
            ? (whereByLogdetail = { logdetail: { [Op.iLike]: `%${logdetail}%` } })
            : (whereByLogdetail = {});

        let whereByUser;
        (user_id) 
            ? (whereByUser = { user_id })
            : (whereByUser = {});

        const where = {
            ...whereByIdPenyelidikan,
            ...whereByNosprintlid,
            ...whereByPerihal,
            ...whereByLogdetail,
            ...whereByKasusPosisi,
            ...whereByUser
        }

        const [recordsTotal, recordsFiltered, data] = await Promise.all([
            Log_penyelidikan.count({}),
            Log_penyelidikan.count({ 
                include: [
                    {
                        model: Penyelidikan,
                        as: 'penyelidikan'
                    }
                ],
                distinct: true,
                col: 'id_penyelidikan',
                where
            }),
            Log_penyelidikan.findAll({
                attributes: [
                    sequelize.literal('DISTINCT ON ("Log_penyelidikan"."id_penyelidikan") "Log_penyelidikan"."id_penyelidikan"'),
                    'id',
                    'id_penyelidikan',
                    'logdetail',
                    'logtime'
                ],
                include: [
                    {
                        model: Penyelidikan,
                        as: 'penyelidikan'
                    }
                ],
                where,
                order: [sequelize.col('Log_penyelidikan.id_penyelidikan'), ['logtime', 'desc']],
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
        id_penyelidikan,
        perihal,
        no_sprintlid,
        kasus_posisi,
        user_id,
        logdetail
    } = logData;
    log('[Log Penyelidikan] GetDatatablesDetail', logData);
    try {
        let whereByIdPenyelidikan;
        (id_penyelidikan) 
            ? (whereByIdPenyelidikan = { id_penyelidikan })
            : (whereByIdPenyelidikan = {});

        let whereByNosprintlid;
        (no_sprintlid) 
            ? (whereByNosprintlid = { '$penyelidikan.no_p2$': { [Op.iLike]: `%${no_sprintlid}%` } })
            : (whereByNosprintlid = {});

        let whereByPerihal;
        (perihal)
            ? (whereByPerihal = { '$penyelidikan.perihal$': { [Op.iLike]: `%${perihal}%` } })
            : (whereByPerihal = {});

        let whereByKasusPosisi;
        (kasus_posisi)
            ? (whereByKasusPosisi = { '$penyelidikan.kasus_posisi$': { [Op.iLike]: `%${kasus_posisi}%` } })
            : (whereByKasusPosisi = {});
    
        
        let whereByLogdetail;
        (logdetail)
            ? (whereByLogdetail = { logdetail: { [Op.iLike]: `%${logdetail}%` } })
            : (whereByLogdetail = {});

        let whereByUser;
        (user_id) 
            ? (whereByUser = { user_id })
            : (whereByUser = {});

        const where = {
            ...whereByIdPenyelidikan,
            ...whereByNosprintlid,
            ...whereByPerihal,
            ...whereByLogdetail,
            ...whereByKasusPosisi,
            ...whereByUser
        }

        let searchOrder;
        (urutan) 
            ? (searchOrder = [['logtime', urutan]])
            : (searchOrder = [['logtime', 'desc']])

        const [recordsTotal, recordsFiltered, data] = await Promise.all([
            Log_penyelidikan.count({}),
            Log_penyelidikan.count({ 
                include: [
                    {
                        model: Penyelidikan,
                        as: 'penyelidikan'
                    },
                    {
                        model: Users,
                        attributes: ['id', 'username', 'nama_lengkap'],
                        as: 'user'
                    }
                ],
                where
            }),
            Log_penyelidikan.findAll({
                include: [
                    {
                        model: Penyelidikan,
                        as: 'penyelidikan'
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