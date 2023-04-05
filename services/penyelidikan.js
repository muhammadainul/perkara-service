const debug = require('debug');
const log = debug('perkara-service:services:');

const { isEmpty } = require('lodash');
const moment = require('moment');

const { 
    Penyelidikan, 
    File_penyelidikan, 
    Lapdumas,
    Users, 
    User_jaksa,
    Logs,
    Master_file_penyelidikan
} = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

async function Create (penyelidikanData, user) {
    const { 
        id_lapdumas = null,
        inst_nama,
        no_sprintlid, 
        tanggal_sprintlid, 
        perihal, 
        kasus_posisi,
        status = null
    } = penyelidikanData;
    log('[Penyelidikan] Create', { penyelidikanData, user });
    try {
        const checkLapdumas = await Lapdumas.findOne({ 
            where: { id: id_lapdumas },
            raw: true
        });
        if (!checkLapdumas) throw { error: 'Lapdumas tidak tersedia.' };
 
        const created = await Penyelidikan.create({
            inst_nama,
            no_sprintlid, 
            tanggal_sprintlid, 
            perihal, 
            kasus_posisi,
            status,
            id_lapdumas,
            created_by: user.id
        });

        // const checkMasterFile = await Master_file_penyelidikan.findAll({});
        // checkMasterFile.forEach(data => {
        //     File_penyelidikan.create({
        //         id_penyelidikan: created.id,
        //         id_master_file: data.id
        //     });
        // });

        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Tambah) data penyelidikan dengan nomor lapdumas ${checkLapdumas.no_laporan}.`,
            user_id: user.id
        });

        return {
            message: 'Data penyelidikan berhasil dibuat.',
            data: await Penyelidikan.findOne({
                where: { id: created.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Update (penyelidikan_id, penyelidikanData, user) {
    const { 
        inst_nama,
        no_sprintlid, 
        tanggal_sprintlid, 
        perihal, 
        kasus_posisi,
        id_lapdumas,
        status
    } = penyelidikanData;
    log('[Penyelidikan] Update', { penyelidikan_id, penyelidikanData, user });
    try {
        const checkPenyelidikan = await Penyelidikan.findOne({
            where: { id: penyelidikan_id },
            raw: true
        });
        if (!checkPenyelidikan) throw { error: 'Penyelidikan tidak tersedia.' };

        const checkLapdumas = await Lapdumas.findOne({ 
            where: { id: id_lapdumas },
            raw: true
        });
        if (!checkLapdumas) throw { error: 'Lapdumas tidak tersedia.' };
 
        await Penyelidikan.update({
            inst_nama,
            no_sprintlid, 
            tanggal_sprintlid, 
            perihal, 
            kasus_posisi,
            status,
            id_lapdumas,
            created_by: user.id
            },
            { where: { id: penyelidikan_id } }
            );

        // const checkMasterFile = await Master_file_penyelidikan.findAll({});
        // checkMasterFile.forEach(data => {
        //     File_penyelidikan.create({
        //         id_penyelidikan: created.id,
        //         id_master_file: data.id
        //     });
        // });

        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Update) data penyelidikan dengan nomor lapdumas ${checkLapdumas.no_laporan}.`,
            user_id: user.id
        });

        return {
            message: 'Data penyelidikan berhasil diupdate.',
            data: await Penyelidikan.findOne({
                where: { id: penyelidikan_id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function GetById (penyelidikan_id) {
    log('[Penyelidikan] GetById', penyelidikan_id);
    try {
        const checkPenyelidikan = await Penyelidikan.findOne({ 
            include: [
                {
                    model: Lapdumas,
                    as: 'lapdumas'
                },
                {
                    model: File_penyelidikan,
                    attributes: [
                        'id', 
                        'id_penyelidikan', 
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
                    model: User_jaksa,
                    attributes: [
                        'id', 
                        'id_penyelidikan',
                        'username',
                        'nama_lengkap', 
                        'nip', 
                        'email'
                    ],
                    as: 'user_jaksa'
                }
            ], 
            where: { id: penyelidikan_id },
            nest: true
        });
        if (!checkPenyelidikan) throw { error: 'Data penyelidikan tidak tersedia.' };
        
        return checkPenyelidikan;
    } catch (error) {
        return error;
    }
}

async function GetByNo (penyelidikanData) {
    const { no_sprintlid } = penyelidikanData;
    log('[Penyelidikan] GetByNo', penyelidikanData);
    try {
        const checkPenyelidikan = await Penyelidikan.findOne({ 
            include: [
                {
                    model: Lapdumas,
                    as: 'lapdumas'
                },
                {
                    model: File_penyelidikan,
                    attributes: [
                        'id', 
                        'id_penyelidikan', 
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
                    model: User_jaksa,
                    attributes: [
                        'id', 
                        'id_penyelidikan',
                        'username',
                        'nama_lengkap', 
                        'nip', 
                        'email'
                    ],
                    as: 'user_jaksa'
                }
            ], 
            where: { no_sprintlid },
            nest: true
        });
        if (!checkPenyelidikan) throw { error: 'Data penyelidikan tidak tersedia.' };
        
        return checkPenyelidikan;
    } catch (error) {
        return error;
    }
}

async function Get () {
    log('[Penyelidikan] Get');
    try {
        const penyelidikanData = await Penyelidikan.findAll({ 
            attributes: ['id', 'no_sprintlid'],
            raw: true
        });

        return penyelidikanData;
    } catch (error) {
        return error;
    }
}

async function List (penyelidikanData) {
    const { nip } = penyelidikanData;
    log('[Penyelidikan] List', penyelidikanData);
    try {
        let where;
        (nip) 
            ? (where = { '$user_jaksa.nip$': nip })
            : (where = {});

        const penyelidikanData = await Penyelidikan.findAll({ 
            include: [
                {
                    model: User_jaksa,
                    attributes: [
                        'id', 
                        'id_penyelidikan',
                        'username',
                        'nama_lengkap', 
                        'nip', 
                        'email'
                    ],
                    as: 'user_jaksa',
                    required: (nip) ? true : false,
                    duplicating: (nip) ? false : true
                }
            ],
            where,
            nest: true 
        });

        return penyelidikanData;
    } catch (error) {
        return error;
    }
}

async function ListNotExists (penyelidikanData) {
    const { nip } = penyelidikanData;
    log('[Penyelidikan] ListNotExists', penyelidikanData);
    try {
        let whereByNip;
        (nip) 
            ? (whereByNip = { '$user_jaksa.nip$': nip })
            : (whereByNip = {});

        const penyelidikanData = await Penyelidikan.findAll({ 
            include: [
                {
                    model: User_jaksa,
                    attributes: [
                        'id', 
                        'id_penyelidikan',
                        'username',
                        'nama_lengkap', 
                        'nip', 
                        'email'
                    ],
                    as: 'user_jaksa',
                    required: (nip) ? true : false,
                    duplicating: (nip) ? false : true
                }
            ],
            where: {
                [Op.and]: [
                    whereByNip,
                    sequelize.literal(
                        `not exists (select * from "Penyidikan" as p where "Penyelidikan"."id" = "p"."id_penyelidikan")`
                    )
                ]
            },
            nest: true 
        });

        return penyelidikanData;
    } catch (error) {
        return error;
    }
}

async function TotalData (penyelidikanData) {
    const { nip } = penyelidikanData;
    log('[Penyelidikan] Total Data', penyelidikanData);
    try {
        let whereByNip;
        let whereByUserFile;
        let include;
        if (nip !== '') {
            whereByNip = { '$user_jaksa.nip$': nip };
            whereByUserFile = { '$penyelidikan.user_jaksa.nip$': nip };

            include = {
                model: Penyelidikan,
                as: 'penyelidikan',
                include: {
                    model: User_jaksa,
                    as: 'user_jaksa',
                    required: true,
                    duplicating: false
                }
            }
        }

        const [total_surat, total_berkas] = await Promise.all([
            Penyelidikan.count({ 
                include: {
                    model: User_jaksa,
                    as: 'user_jaksa',
                    required: true,
                    duplicating: false
                },
                where: whereByNip 
            }),
            File_penyelidikan.count({ 
                include,
                where: whereByUserFile 
            })
        ]);

        return { total_surat, total_berkas };
    } catch (error) {
        return error;
    }
}

async function GetDatatables (penyelidikanData) {
    const { 
        draw, 
        // order, 
        start, 
        length, 
        // search, 
        id_lapdumas,
        no_sprintlid,
        perihal, 
        kasus_posisi,
        status, 
        startDate,
        endDate,
        nip,
        urutan
    } = penyelidikanData;
    log('[Penyelidikan] GetDatatables', penyelidikanData);
    try {
        let whereByNoSprintlid;
        (no_sprintlid) 
            ? 
                (whereByNoSprintlid = {
                    no_sprintlid: { 
                        [Op.iLike]: `%${no_sprintlid}%`
                    }
                })
            : (whereByNoSprintlid = {});
        
        let whereByPerihal;
        (perihal)
            ?
                (whereByPerihal = {
                    perihal: {
                        [Op.iLike]: `%${perihal}%`
                    }
                })
            : (whereByPerihal = {});
            
        let whereByKasusPosisi;
        (kasus_posisi)
            ?
                (whereByKasusPosisi = {
                    kasus_posisi: {
                        [Op.iLike]: `%${kasus_posisi}%`
                    }
                })
            : (whereByKasusPosisi = {});
    
        let whereByStatus;
        (status)
            ? (whereByStatus = { status })
            : (whereByStatus = {});

        let whereByDate;
        (startDate || endDate)
            ?
                (whereByDate = {
                    [Op.and]: [
                        { tanggal_sprintlid: { [Op.gte]: moment(startDate).format() } },
                        { tanggal_sprintlid: { [Op.lte]: moment(endDate).format() } }
                    ]
                })
            : (whereByDate = {} );

        let whereByLapdumas;
        (id_lapdumas)
            ? (whereByLapdumas = { id_lapdumas })
            : (whereByLapdumas = {});

        let whereByNip;
        (nip) 
            ? (whereByNip = { '$user_jaksa.nip$': nip })
            : (whereByNip = {});

        const where = {
            ...whereByNoSprintlid,
            ...whereByPerihal,
            ...whereByKasusPosisi,
            ...whereByStatus,
            ...whereByDate,
            ...whereByLapdumas,
            ...whereByNip
        };

        let searchOrder;
        if (urutan !== '') {
            searchOrder = [['tanggal_sprintlid', urutan]];
        };

        const [recordsTotal, recordsFiltered, data] = await Promise.all([
            Penyelidikan.count({}),
            Penyelidikan.count({ 
                include: {
                    model: User_jaksa,
                    as: 'user_jaksa',
                    required: true,
                    duplicating: false
                },
                where 
            }),
            Penyelidikan.findAll({
                include: [
                    {
                        model: Lapdumas,
                        as: 'lapdumas'
                    },
                    {
                        model: File_penyelidikan,
                        attributes: [
                            'id', 
                            'id_penyelidikan', 
                            'destination', 
                            'filename', 
                            'path', 
                            'tanggal',
                            'keterangan'
                        ],
                        as: 'files'
                    },
                    {
                        model: User_jaksa,
                        attributes: [
                            'id', 
                            'id_penyelidikan',
                            'username',
                            'nama_lengkap', 
                            'nip', 
                            'email'
                        ],
                        as: 'user_jaksa',
                        required: (nip) ? true : false,
                        duplicating: (nip) ? false : true
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

async function DatatablesSearchValue (penyelidikanData) {
    const { 
        draw, 
        // order, 
        start, 
        length, 
        search,
        nip
    } = penyelidikanData;
    log('[Penyelidikan] DatatablesSearchValue', penyelidikanData);
    try {
        let whereByNip;
        (nip) 
            ? (whereByNip = { '$user_jaksa.nip$': nip })
            : (whereByNip = {});
        
        let where;
        !isEmpty(search.value)
            ? (where = {
                [Op.and]: [
                    {
                        [Op.or]: {
                            no_sprintlid: {
                                [Op.iLike]: `%${search.value}%`
                            },
                            perihal: {
                                [Op.iLike]: `%${search.value}%`
                            },
                            status: {
                                [Op.iLike]: `%${search.value}%` 
                            },
                            kasus_posisi: {
                                [Op.iLike]: `%${search.value}%` 
                            },
                            inst_nama: {
                                [Op.iLike]: `%${search.value}%` 
                            }
                        }
                    },
                    whereByNip
                ]
            })
            : (where = {
                [Op.and]: [
                    whereByNip
                ]
            });

        const [recordsTotal, recordsFiltered, data] = await Promise.all([
            Penyelidikan.count({}),
            Penyelidikan.count({ 
                include: {
                    model: User_jaksa,
                    as: 'user_jaksa',
                    required: (nip) ? true : false,
                    duplicating: (nip) ? false : true
                },
                where 
            }),
            Penyelidikan.findAll({
                include: [
                    { 
                        model: Lapdumas,
                        as: 'lapdumas'
                    },
                    {
                        model: File_penyelidikan,
                        attributes: [
                            'id', 
                            'id_penyelidikan', 
                            'destination', 
                            'filename', 
                            'path', 
                            'tanggal',
                            'keterangan'
                        ],
                        as: 'files'
                    },
                    {
                        model: User_jaksa,
                        attributes: [
                            'id', 
                            'id_penyelidikan',
                            'username',
                            'nama_lengkap', 
                            'nip', 
                            'email'
                        ],
                        as: 'user_jaksa',
                        required: (nip) ? true : false,
                        duplicating: (nip) ? false : true
                    }
                ],
                where,
                order: [['createdAt', 'desc']],
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
    Update,
    List,
    ListNotExists,
    GetById,
    Get,
    GetByNo,
    TotalData,
    GetDatatables,
    DatatablesSearchValue
}