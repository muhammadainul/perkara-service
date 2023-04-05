const debug = require('debug');
const log = debug('perkara-service:services:');

const { isEmpty } = require('lodash');
const moment = require('moment');

const { 
    Lapdumas, 
    File_lapdumas, 
    Users, 
    Logs,
    Master_file_lapdumas
} = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

async function Create (lapdumasData, user) {
    const { 
        no_laporan, 
        tanggal_surat, 
        tanggal_terima, 
        asal_surat, 
        perihal, 
        isi, 
        status,
        pembuat_catatan
    } = lapdumasData;
    log('[Lapdumas] Create', { lapdumasData, user });
    try {
        const checkLapdumas = await Lapdumas.findAll({ 
            where: { no_laporan },
            raw: true
        });
        if (checkLapdumas.length > 0) throw { error: 'Nomor laporan sudah tersedia.' };
 
        const created = await Lapdumas.create({
            no_laporan,
            tanggal_surat,
            tanggal_terima, 
            asal_surat, 
            perihal, 
            isi,
            status,
            pembuat_catatan,
            created_by: user.id
        });

        // const checkMasterFile = await Master_file_lapdumas.findAll({});
        // checkMasterFile.forEach(data => {
        //     File_lapdumas.create({
        //         id_lapdumas: created.id,
        //         id_master_file: data.id
        //     });
        // });

        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Tambah) data lapdumas dengan nomor laporan ${created.no_laporan}.`,
            user_id: user.id
        });

        return {
            message: 'Data lapdumas berhasil dibuat.',
            data: await Lapdumas.findOne({
                where: { id: created.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function GetById (lapdumas_id) {
    log('[Lapdumas] GetById', lapdumas_id);
    try {
        const checkLapdumas = await Lapdumas.findOne({ 
            include: [
                {
                    model: File_lapdumas,
                    attributes: [
                        'id', 
                        'id_lapdumas', 
                        'destination', 
                        'filename', 
                        'path', 
                        'tanggal',
                        'keterangan',
                        'createdAt', 
                        'updatedAt'
                    ],
                    as: 'files'
                },
                {
                    model: Users,
                    attributes: [
                        'id', 
                        'username', 
                        'nama_lengkap', 
                        'nip', 
                        'email'
                    ],
                    as: 'user'
                }
            ], 
            where: { id: lapdumas_id },
            nest: true
        });
        if (!checkLapdumas) throw { error: 'Data lapdumas tidak tersedia.' };
        
        return checkLapdumas;
    } catch (error) {
        return error;
    }
}

async function GetByNo (lapdumasData) {
    const { no_laporan } = lapdumasData;
    log('[Lapdumas] GetByNo', lapdumasData);
    try {
        const checkLapdumas = await Lapdumas.findOne({ 
            include: [
                {
                    model: File_lapdumas,
                    attributes: [
                        'id', 
                        'id_lapdumas', 
                        'destination', 
                        'filename', 
                        'path', 
                        'tanggal',
                        'createdAt', 
                        'updatedAt'
                    ],
                    as: 'files',
                    include: [
                        {
                            model: Master_file_lapdumas,
                            attributes: [['id', 'id_master_file'], 'nama'],
                            as: 'master_file',
                            required: false
                        }
                    ]
                },
                {
                    model: Users,
                    attributes: [
                        'id', 
                        'username', 
                        'nama_lengkap', 
                        'nip', 
                        'email'
                    ],
                    as: 'user'
                }
            ], 
            where: { no_laporan },
            nest: true
        });
        if (!checkLapdumas) throw { error: 'Data lapdumas tidak tersedia.' };
        
        return checkLapdumas;
    } catch (error) {
        return error;
    }
}

async function Get () {
    log('[Lapdumas] Get');
    try {
        const lapdumasData = await Lapdumas.findAll({ 
            attributes: ['id', 'no_laporan'],
            raw: true
        });

        return lapdumasData;
    } catch (error) {
        return error;
    }
}

async function List (lapdumasData) {
    const { user_id } = lapdumasData;
    log('[Lapdumas] List', lapdumasData);
    try {
        let whereByUser;
        if (user_id !== '') {
            whereByUser = {
                created_by: user_id
            };
        }
        const lapdumasData = await Lapdumas.findAll({ 
            where: {
                [Op.and]: [
                    whereByUser,
                    sequelize.literal(
                        `not exists (select * from "Penyelidikan" as p where "Lapdumas"."id" = "p"."id_lapdumas")`
                    )
                ]
            },
            raw: true 
        });

        return lapdumasData;
    } catch (error) {
        return error;
    }
}

async function GetDatatables (lapdumasData) {
    const { 
        draw, 
        // order, 
        start, 
        length, 
        // search, 
        no_laporan,
        asal_surat, 
        perihal, 
        isi, 
        status, 
        kasus_posisi,
        startDate,
        endDate,
        user_id,
        urutan
    } = lapdumasData;
    log('[Lapdumas] GetDatatables', lapdumasData);
    try {
        let whereByNoLaporan;
        (no_laporan)
            ? (whereByNoLaporan = { no_laporan: { [Op.iLike]: `%${no_laporan}%` } })
            : (whereByNoLaporan = {});
        
        let whereByPerihal;
        (perihal)
            ? (whereByPerihal = { perihal: { [Op.iLike]: `%${perihal}%` } })
            : (whereByPerihal = {});

        let whereByIsi;
        (isi)
            ? (whereByIsi = { isi: { [Op.iLike]: `%${isi}%` } })
            : (whereByIsi = {});

        let whereByAsalSurat;
        (asal_surat)
            ? (whereByAsalSurat = { asal_surat: { [Op.iLike]: `%${asal_surat}%` } })
            : (whereByAsalSurat = {});

        let whereByStatus;
        (status)
            ? (whereByStatus = { status })
            : (whereByStatus = {});

        let whereByKasusPosisi;
        (kasus_posisi)
            ? (whereByKasusPosisi = { kasus_posisi })
            : (whereByKasusPosisi = {});

        let whereByDate;
        (startDate || endDate)
            ? 
            (whereByDate = {
                [Op.and]: [
                    { tanggal_surat: { [Op.gte]: moment(startDate).format() } },
                    { tanggal_surat: { [Op.lte]: moment(endDate).format() } }
                ]
            })
            : (whereByDate = {});

        let whereByUserId;
        (user_id)
            ? (whereByUserId = { created_by: user_id })
            : (whereByUserId = {});

        const where = {
            ...whereByNoLaporan,
            ...whereByPerihal,
            ...whereByIsi,
            ...whereByAsalSurat,
            ...whereByStatus,
            ...whereByKasusPosisi,
            ...whereByDate,
            ...whereByUserId
        };

        let searchOrder;
        if (urutan !== '') {
            searchOrder = [['tanggal_surat', urutan]];
        };

        let lapdumas = [];
        const [recordsTotal, recordsFiltered, data] = await Promise.all([
            Lapdumas.count({}),
            Lapdumas.count({ where }),
            Lapdumas.findAll({
                include: [
                    {
                        model: File_lapdumas,
                        attributes: [
                            'id', 
                            'id_lapdumas', 
                            'destination', 
                            'filename', 
                            'path', 
                            'tanggal',
                            'keterangan'
                        ],
                        as: 'files'
                    },
                    {
                        model: Users,
                        attributes: [
                            'id', 
                            'username',
                            'nama_lengkap', 
                            'nip', 
                            'email'
                        ],
                        as: 'user'
                    }
                ],
                where,
                order: searchOrder,
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

module.exports = {
    Create,
    List,
    GetById,
    Get,
    GetByNo,
    GetDatatables
}