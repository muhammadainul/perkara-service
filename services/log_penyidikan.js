const debug = require('debug');
const log = debug('perkara-service:log_penyidikan:services:');

const { isEmpty } = require('lodash');

const { 
    Users, 
    Penyidikan,
    Log_penyidikan 
} = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

async function Create (logData, user) {
    const { 
        id_penyidikan, 
        logdetail, 
        dokumen
    } = logData;
    log('[Log Penyidikan] Create', { logData, user });
    try {
        if (!id_penyidikan || !logdetail || !dokumen) {
            throw { error: 'Form harus dilampirkan.' };
        }

        const checkPenyidikan = await Penyidikan.findOne({
            where: { id: id_penyidikan },
            raw: true
        });
        if (!checkPenyidikan) {
            throw { error: 'Penyidikan tidak tersedia.' };
        }

        let created;
        if (logdetail === 'upload') {
            created = await Log_penyidikan.create({
                id_penyidikan,
                user_id: user.id,
                logdetail: `Upload dokumen ${dokumen}`
            });
        } else if (logdetail === 'download') {
            created = await Log_penyidikan.create({
                id_penyidikan,
                user_id: user.id,
                logdetail: `Download dokumen ${dokumen}`
            });
        } else if (logdetail === 'edit') {
            created = await Log_penyidikan.create({
                id_penyidikan,
                user_id: user.id,
                logdetail: `Edit dokumen ${dokumen}`
            });
        } else if (logdetail === 'delete') {
            created = await Log_penyidikan.create({
                id_penyidikan,
                user_id: user.id,
                logdetail: `Hapus dokumen ${dokumen}`
            });
        } else if (logdetail === 'view') {
            created = await Log_penyidikan.create({
                id_penyidikan,
                user_id: user.id,
                logdetail: `View dokumen ${dokumen}`
            });
        } else {
            created = await Log_penyidikan.create({
                id_penyidikan,
                user_id: user.id,
                logdetail: null
            });
        }

        return {
            message: 'Log penyidikan berhasil dibuat.',
            log: await Log_penyidikan.findOne({
                where: { id: created.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function GetById (penyidikan_id) {
    log('[Log Penyidikan] GetById', penyidikan_id);
    try {
        const logData = await Log_penyidikan.findAll({
            include: [
                {
                    model: Penyidikan,
                    as: 'penyidikan'
                },
                {
                    model: Users,
                    attributes: ['username', 'nama_lengkap'],
                    as: 'user'
                }
            ],
            attributes: ['id', 'logtime', 'logdetail'],
            where: { id_penyidikan: penyidikan_id },
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
        id_penyidikan,
        no_sprintdik,
        nama_perkara,
        user_id,
        logdetail
    } = logData;
    log('[Log Penyidikan] GetDatatables', logData);
    try {
        let whereByIdPenyidikan;
        (id_penyidikan) 
            ? (whereByIdPenyidikan = { id_penyidikan })
            : (whereByIdPenyidikan = {});

        let whereByNoSprintdik;
        (no_sprintdik)
            ? (whereByNoSprintdik = { '$penyidikan.no_sprintdik$': { [Op.iLike]: `%${no_sprintdik}%` } })
            : (whereByNoSprintdik = {});

        let whereByPerkara;
        (nama_perkara)
            ? (whereByPerkara = { '$penyidikan.nama_perkara$': { [Op.iLike]: `%${nama_perkara}%` } })
            : (whereByPerkara = {});

        let whereByLogdetail;
        (logdetail)
            ? (whereByLogdetail = { logdetail: { [Op.iLike]: `%${logdetail}%` } })
            : (whereByLogdetail = {});

        let whereByUserId;
        (user_id) 
            ? (whereByUserId = { user_id })
            : (whereByUserId = {});

        const where = {
            ...whereByIdPenyidikan,
            ...whereByNoSprintdik,
            ...whereByPerkara,
            ...whereByLogdetail,
            ...whereByUserId
        }

        const [recordsTotal, recordsFiltered, data] = await Promise.all([
            Log_penyidikan.count({}),
            Log_penyidikan.count({ 
                include: [
                    {
                        model: Penyidikan,
                        as: 'penyidikan'
                    }
                ],
                distinct: true,
                col: 'id_penyidikan',
                where
            }),
            Log_penyidikan.findAll({
                attributes: [
                    sequelize.literal('DISTINCT ON ("Log_penyidikan"."id_penyidikan") "Log_penyidikan"."id_penyidikan"'),
                    'id',
                    'id_penyidikan',
                    'logdetail',
                    'logtime'
                ],
                include: [
                    {
                        model: Penyidikan,
                        as: 'penyidikan'
                    }
                ],
                where,
                order: ['id_penyidikan', ['logtime', 'desc']],
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
        id_penyidikan,
        no_sprintdik,
        nama_perkara,
        user_id,
        logdetail
    } = logData;
    log('[Log Penyidikan] GetDatatablesDetail', logData);
    try {
        if (!id_penyidikan) throw { error: 'Penyidikan harus dilampirkan.' };

        let whereByIdPenyidikan;
        (id_penyidikan) 
            ? (whereByIdPenyidikan = { id_penyidikan })
            : (whereByIdPenyidikan = {});

        let whereByNoSprintdik;
        (no_sprintdik)
            ? (whereByNoSprintdik = { '$penyidikan.no_sprintdik$': { [Op.iLike]: `%${no_sprintdik}%` } })
            : (whereByNoSprintdik = {});

        let whereByPerkara;
        (nama_perkara)
            ? (whereByPerkara = { '$penyidikan.nama_perkara$': { [Op.iLike]: `%${nama_perkara}%` } })
            : (whereByPerkara = {});

        let whereByLogdetail;
        (logdetail)
            ? (whereByLogdetail = { logdetail: { [Op.iLike]: `%${logdetail}%` } })
            : (whereByLogdetail = {});

        let whereByUserId;
        (user_id) 
            ? (whereByUserId = { user_id })
            : (whereByUserId = {});

        const where = {
            ...whereByIdPenyidikan,
            ...whereByNoSprintdik,
            ...whereByPerkara,
            ...whereByLogdetail,
            ...whereByUserId
        }

        let searchOrder;
        (urutan) 
            ? (searchOrder = [['logtime', urutan]])
            : (searchOrder = [['logtime', 'desc']])

        const [recordsTotal, recordsFiltered, data] = await Promise.all([
            Log_penyidikan.count({}),
            Log_penyidikan.count({ 
                include: [
                    {
                        model: Penyidikan,
                        as: 'penyidikan'
                    },
                    {
                        model: Users,
                        attributes: ['id', 'username', 'nama_lengkap'],
                        as: 'user'
                    }
                ],
                where
            }),
            Log_penyidikan.findAll({
                include: [
                    {
                        model: Penyidikan,
                        as: 'penyidikan'
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