const debug = require('debug');
const log = debug('perkara-service:services:');

const { 
    isEmpty,
    map,
    split,
    includes,
    intersection 
} = require('lodash');
const moment = require('moment');

const { 
    Penyidikan, 
    File_penyidikan, 
    Penyelidikan,
    Log_penyidikan,
    Master_file_perkara,
    // Users, 
    User_jaksa,
    Logs,
} = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

async function Create (penyidikanData, user) {
    const { 
        id_penyelidikan,
        inst_nama,
        no_sprintdik, 
        tanggal_sprintdik, 
        nama_tersangka, 
        nama_perkara,
        jenis_perkara, 
        keterangan = null,
        status = null
    } = penyidikanData;
    log('[Penyidikan] Create', { penyidikanData, user });
    try {
        let checkPenyelidikan;
        if (id_penyelidikan) {
            checkPenyelidikan = await Penyelidikan.findOne({ 
                where: { id: id_penyelidikan },
                raw: true
            });
            if (!checkPenyelidikan) throw { error: 'Penyelidikan tidak tersedia.' };
        }
 
        const created = await Penyidikan.create({
            id_penyelidikan,
            inst_nama,
            no_sprintdik, 
            tanggal_sprintdik, 
            nama_tersangka, 
            nama_perkara,
            jenis_perkara, 
            keterangan,
            status,
            created_by: user.id
        });

        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Tambah) data penyidikan dengan nomor penyelidikan ${checkPenyelidikan.no_sprintlid}.`,
            user_id: user.id
        });

        return {
            message: 'Data penyidikan berhasil dibuat.',
            data: await Penyidikan.findOne({
                where: { id: created.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Update (penyidikan_id, penyidikanData, user) {
    const { 
        id_penyelidikan,
        inst_nama,
        no_sprintdik, 
        tanggal_sprintdik, 
        nama_tersangka, 
        nama_perkara,
        jenis_perkara, 
        keterangan,
        status
    } = penyidikanData;
    log('[Penyidikan] Update', { penyidikan_id, penyidikanData, user });
    try {
        const checkPenyidikan = await Penyidikan.findOne({
            where: { id: penyidikan_id },
            raw: true
        });
        if (!checkPenyidikan) throw { error: 'Penyidikan tidak tersedia.' };

        let checkPenyelidikan
        if (id_penyelidikan) {
            checkPenyelidikan = await Penyelidikan.findOne({ 
                where: { id: id_penyelidikan },
                raw: true
            });
            if (!checkPenyelidikan) throw { error: 'Penyelidikan tidak tersedia.' };
        }
 
        await Penyidikan.update({
            id_penyelidikan,
            inst_nama,
            no_sprintdik, 
            tanggal_sprintdik, 
            nama_tersangka, 
            nama_perkara,
            jenis_perkara, 
            keterangan,
            status,
            created_by: user.id
            },
            { where: { id: penyidikan_id } }
            );

        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Update) data penyidikan dengan nomor lapdumas ${checkPenyelidikan.no_sprintlid}.`,
            user_id: user.id
        });

        return {
            message: 'Data penyidikan berhasil diupdate.',
            data: await Penyidikan.findOne({
                where: { id: penyidikan_id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function UpdateStatus (penyidikan_id, penyidikanData, user) {
    const { status } = penyidikanData;
    log('[Penyidikan] UpdateStatus', { penyidikan_id, penyidikanData, user });
    try {
        const checkPenyidikan = await Penyidikan.findOne({ 
            where: { id: penyidikan_id },
            raw: true
        })
        if (!checkPenyidikan) throw { error: 'Data penyidikan tidak tersedia.' };

        if (status == true) {
            await Penyidikan.update({
                status: true
                },
                { where: { id: penyidikan_id }}
            );
    
            await Logs.create({
                ip_address: user.ip_address,
                browser: user.browser,
                browser_version: user.browser_version,
                os: user.os,
                logdetail: `(Update) status penyidikan dengan nomor sprintdik ${checkPenyidikan.no_sprintdik}.`,
                user_id: user.id
            });
    
            return {
                message: 'Data penyidikan berhasil diubah.',
                data: await Perkara.findOne({
                    where: { id: checkPenyidikan.id },
                    raw: true
                })
            };
        } else {
            return {
                message: 'Data penyidikan gagal diubah.'
            };
        }
    } catch (error) {
        return error;
    }
}

async function Delete (penyidikan_id, user) {
    log('[Penyidikan] Delete', { penyidikan_id, user });
    try {
        const checkPenyidikan = await Penyidikan.findOne({ 
            where: { id: penyidikan_id },
            raw: true
        });
        if (!checkPenyidikan) throw { error: 'Data penyidikan tidak tersedia.' };

        await File_penyidikan.destroy({ 
            where: { id_penyidikan: penyidikan_id }
        });

        await Log_penyidikan.destroy({
            where: { id_penyidikan: penyidikan_id }
        });

        await Penyidikan.destroy({ 
            where: { id: penyidikan_id } 
        });

        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Hapus) data penyidikan dengan nomor sprintdik ${checkPenyidikan.no_sprintdik}.`,
            user_id: user.id
        });

        return {
            message: 'Data penyidikan berhasil dihapus.'
        };
    } catch (error) {
        return error;
    }
}

async function GetById (penyidikanData) {
    const { nip, penyidikan_id } = penyidikanData;
    log('[Penyidikan] GetById', penyidikanData);
    try {
        if (!penyidikan_id) throw { error: 'Penyidikan id harus dilampirkan.' };
        
        const checkMasterFile = await Master_file_perkara.findAll({ raw: true })

        const checkPenyidikan = await Penyidikan.findOne({ 
            include: [
                {
                    model: Penyelidikan,
                    as: 'penyelidikan'
                },
                {
                    model: File_penyidikan,
                    attributes: [
                        'id', 
                        'id_penyidikan', 
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
                        'id_penyidikan',
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
                    { id: penyidikan_id },
                    (nip) ? { '$user_jaksa.nip$': nip } : {} 
                ]
            },
            nest: true
        });
        if (!checkPenyidikan) throw { error: 'Data penyidikan tidak tersedia.' };

        if (nip) {
            if (!checkPenyidikan) throw { error: 'Data penyidikan tidak tersedia.' };
    
            let newData = [];

            const file_penyidikan = checkPenyidikan.files;

            const nama = map(checkMasterFile, (row) => {
                return row.nama;
            });

            const file = map(checkPenyidikan.files, (row) => {
                const dokumen = split(row.keterangan, " ")[0];
                return dokumen;
            });

            const exists = intersection(nama, file);

            const finish = [];
            map(file_penyidikan, (row) => {
                if (includes(exists, split(row.keterangan, " ")[0])) finish.push(row)
            });

            newData.push({
                id: checkPenyidikan.id,
                id_penyelidikan: checkPenyidikan.id_penyelidikan,
                tanggal_sprintdik: checkPenyidikan.tanggal_sprintdik,
                nama_tersangka: checkPenyidikan.nama_tersangka,
                tppu: checkPenyidikan.tppu,
                keterangan: checkPenyidikan.keterangan,
                no_sprintdik: checkPenyidikan.no_sprintdik,
                nama_perkara: checkPenyidikan.nama_perkara,
                status: checkPenyidikan.status,
                jenis_perkara: checkPenyidikan.kategori_id,
                tppu: checkPenyidikan.tppu,
                createdAt: checkPenyidikan.createdAt,
                updatedAt: checkPenyidikan.updatedAt,
                penyelidikan: checkPenyidikan.penyelidikan,
                user_jaksa: checkPenyidikan.user_jaksa,
                files: finish
            });

            return newData[0]; 
        }

        return checkPenyidikan;
    } catch (error) {
        return error;
    }
}

async function GetByNo (penyidikanData) {
    const { no_sprintdik } = penyidikanData;
    log('[Penyidikan] GetByNo', penyidikanData);
    try {
        const checkPenyidikan = await Penyidikan.findOne({ 
            include: [
                {
                    model: Penyelidikan,
                    as: 'penyelidikan'
                },
                {
                    model: File_penyidikan,
                    attributes: [
                        'id', 
                        'id_penyidikan', 
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
                        'id_penyidikan',
                        'username',
                        'nama_lengkap', 
                        'nip', 
                        'email'
                    ],
                    as: 'user_jaksa'
                }
            ], 
            where: { no_sprintdik },
            nest: true
        });
        if (!checkPenyidikan) throw { error: 'Data penyidikan tidak tersedia.' };
        
        return checkPenyidikan;
    } catch (error) {
        return error;
    }
}

async function Get () {
    log('[Penyidikan] Get');
    try {
        const penyidikanData = await Penyidikan.findAll({ 
            attributes: ['id', 'no_sprintdik'],
            raw: true
        });

        return penyidikanData;
    } catch (error) {
        return error;
    }
}

async function List (penyidikanData) {
    const { nip } = penyidikanData;
    log('[Penyidikan] List', penyidikanData);
    try {
        let where;
        (nip) 
            ? (where = { '$user_jaksa.nip$': nip })
            : (where = {});

        const penyidikanData = await Penyidikan.findAll({ 
            include: [
                {
                    model: User_jaksa,
                    attributes: [
                        'id', 
                        'id_penyidikan',
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

        return penyidikanData;
    } catch (error) {
        return error;
    }
}

async function ListNotExists (penyidikanData) {
    const { nip } = penyidikanData;
    log('[Penyidikan] ListNotExists', penyidikanData);
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
                        'id_penyidikan',
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
                        `not exists (select * from "Penyidikan" as p where "Penyelidikan"."id" = "p"."id_penyidikan")`
                    )
                ]
            },
            raw: true 
        });

        return penyelidikanData;
    } catch (error) {
        return error;
    }
}

async function TotalData (penyidikanData) {
    const { nip, status } = penyidikanData;
    log('[Penyidikan] Total Data', penyidikanData);
    try {
        let whereByNip;
        let whereByUserFile;
        if (nip !== '') {
            whereByNip = { '$user_jaksa.nip$': nip };
            whereByUserFile = { '$penyidikan.user_jaksa.nip$': nip };
        }

        let whereByStatus;
        let whereByStatusFile;
        if (status !== '') {
            whereByStatus = {
                status
            };

            whereByStatusFile = {
                '$penyidikan.status$': status
            };
        }

        let total_surat;
        let total_berkas;
        if (nip) {
            [total_surat, total_berkas] = await Promise.all([
                Penyidikan.count({ 
                    include: {
                        model: User_jaksa,
                        as: 'user_jaksa',
                        required: (nip) ? true : false,
                        duplicating: (nip) ? false : true
                    },
                    where: {
                        [Op.and]: [
                            whereByNip,
                            whereByStatus 
                        ]   
                    }
                }),
                File_penyidikan.count({ 
                    include: {
                        model: Penyidikan,
                        as: 'penyidikan',
                        include: {
                            model: User_jaksa,
                            as: 'user_jaksa',
                            required: (nip) ? true : false,
                            duplicating: (nip) ? false : true
                        }
                    },
                    where: {
                        [Op.and]: [
                            whereByUserFile,
                            whereByStatusFile 
                        ]
                    }
                })
            ]);
        } else {
            [total_surat, total_berkas] = await Promise.all([
                Penyidikan.count({ 
                    where: {
                        [Op.and]: [
                            whereByStatus 
                        ]   
                    }
                }),
                File_penyidikan.count({ 
                    include: {
                        model: Penyidikan,
                        as: 'penyidikan'
                    },
                    where: {
                        [Op.and]: [
                            whereByStatusFile 
                        ]
                    }
                })
            ]);
        }

        return { total_surat, total_berkas };
    } catch (error) {
        return error;
    }
}

async function GetDatatables (penyidikanData) {
    const { 
        draw, 
        // order, 
        start, 
        length, 
        // search, 
        nama_tersangka,
        nama_perkara,
        id_penyelidikan,
        no_sprintdik,
        keterangan, 
        status, 
        startDate,
        endDate,
        nip,
        urutan
    } = penyidikanData;
    log('[Penyidikan] GetDatatables', penyidikanData);
    try {
        let whereByNoSprintdik;
        (no_sprintdik) 
            ? (whereByNoSprintdik = { no_sprintdik: { [Op.iLike]: `%${no_sprintdik}%` } })
            : (whereByNoSprintdik = {});
        
        let whereByNamaPerkara;
        (nama_perkara)
            ? (whereByNamaPerkara = { nama_perkara: { [Op.iLike]: `%${nama_perkara}%` } })
            : (whereByNamaPerkara = {});

        let whereByTersangka;
        (nama_tersangka)
            ? (whereByTersangka = { nama_tersangka: { [Op.iLike]: `%${nama_tersangka}%` } })
            : (whereByTersangka = {});

        let whereByPenyelidikan;
        (id_penyelidikan)
            ? (whereByPenyelidikan = { id_penyelidikan })
            : (whereByPenyelidikan = {});

        let whereByStatus;
        (status)
            ? (whereByStatus = { status })
            : (whereByStatus = {});

        let whereByDate;
        (startDate || endDate)
            ? 
            (whereByDate = { 
                [Op.and]: [
                    { tanggal_sprintdik: { [Op.gte]: moment(startDate).format() } },
                    { tanggal_sprintdik: { [Op.lte]: moment(endDate).format() } }
                ]
            })
            : (whereByDate = {});

        let whereByNip;
        (nip)
            ? (whereByNip = { '$user_jaksa.nip$': nip })
            : (whereByNip = {});

        let whereByKeterangan;
        (keterangan)
            ? (whereByKeterangan = { keterangan })
            : (whereByKeterangan = {});

        const where = {
            ...whereByPenyelidikan,
            ...whereByNoSprintdik,
            ...whereByNamaPerkara,
            ...whereByStatus,
            ...whereByDate,
            ...whereByTersangka,
            ...whereByNip,
            ...whereByKeterangan
        };

        let searchOrder;
        if (urutan !== '') {
            searchOrder = [['createdAt', urutan]];
        };

        let newData = [];
        let recordsTotal;
        let recordsFiltered;
        let data;
        if (nip) {
            [recordsTotal, recordsFiltered, data] = await Promise.all([
                Penyidikan.count({}),
                Penyidikan.count({ 
                    include: {
                        model: User_jaksa,
                        as: 'user_jaksa',
                        required: (nip) ? true : false,
                        duplicating: (nip) ? false : true
                    },
                    where 
                }),
                Penyidikan.findAll({
                    include: [
                        {
                            model: Penyelidikan,
                            as: 'penyelidikan'
                        },
                        {
                            model: File_penyidikan,
                            attributes: [
                                'id', 
                                'id_penyidikan', 
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
                                'id_penyidikan',
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
        } else {
            [recordsTotal, recordsFiltered, data] = await Promise.all([
                Penyidikan.count({}),
                Penyidikan.count({ where }),
                Penyidikan.findAll({
                    include: [
                        {
                            model: Penyelidikan,
                            as: 'penyelidikan'
                        },
                        {
                            model: File_penyidikan,
                            attributes: [
                                'id', 
                                'id_penyidikan', 
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
                                'id_penyidikan',
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
        }

        for (let i of data) {
            const total_file = await File_penyidikan.count({
                where: { 
                    id_penyidikan: i.id,
                    filename: { [Op.ne]: null }
                }
            });
            newData.push({
                id: i.id,
                inst_nama: i.inst_nama,
                no_sprintdik: i.no_sprintdik,
                tanggal_sprintdik: i.tanggal_sprintdik,
                nama_tersangka: i.nama_tersangka,
                nama_perkara: i.nama_perkara,
                tppu: i.tppu,
                keterangan: i.keterangan,
                status: i.status,   
                total_file: total_file,
                created_by: i.created_by,
                createdAt: i.createdAt,
                updatedAt: i.updatedAt,
                penyelidikan: i.penyelidikan,
                files: i.files,
                user_jaksa: i.user_jaksa
            });
        }
        
        return {
            draw,
            recordsTotal,
            recordsFiltered,
            data: newData
        };
    } catch (error) {
        return error;
    }
}

async function DatatablesSearchValue (penyidikanData) {
    const { 
        draw, 
        // order, 
        start, 
        length, 
        search,
        status,
        nip
    } = penyidikanData;
    log('[Penyidikan] DatatablesSearchValue', penyidikanData);
    try {
        let whereByNip;
        (nip)
            ? (whereByNip = { '$user_jaksa.nip$': nip })
            : (whereByNip = {});

        let whereByStatus
        (status)
            ? (whereByStatus = { status })
            : (whereByStatus = {})
        
        let where;
        !isEmpty(search.value)
            ? (where = {
                [Op.and]: [
                    {
                        [Op.or]: {
                            inst_nama: {
                                [Op.iLike]: `%${search.value}%`
                            },
                            nama_perkara: {
                                [Op.iLike]: `%${search.value}%`
                            },
                            jenis_perkara: {
                                [Op.iLike]: `%${search.value}%`
                            },
                            no_sprintdik: {
                                [Op.iLike]: `%${search.value}%`
                            },
                            nama_tersangka: {
                                [Op.iLike]: `%${search.value}%`
                            },
                            keterangan: {
                                [Op.iLike]: `%${search.value}%` 
                            },
                            tppu: {
                                [Op.iLike]: `%${search.value}%`
                            }
                        }
                    },
                    whereByNip,
                    whereByStatus
                ]
            })
            : (where = {
                [Op.and]: [
                    whereByNip,
                    whereByStatus
                ]
            });

        let recordsTotal;
        let recordsFiltered;
        let data;
        if (nip) {
            [recordsTotal, recordsFiltered, data] = await Promise.all([
                Penyidikan.count({}),
                Penyidikan.count({ 
                    include: {
                        model: User_jaksa,
                        as: 'user_jaksa',
                        required: (nip) ? true : false,
                        duplicating: (nip) ? false : true
                    },
                    where 
                }),
                Penyidikan.findAll({
                    include: [
                        { 
                            model: Penyelidikan,
                            as: 'penyelidikan'
                        },
                        {
                            model: File_penyidikan,
                            attributes: [
                                'id', 
                                'id_penyidikan', 
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
                                'id_penyidikan',
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
        } else {
            [recordsTotal, recordsFiltered, data] = await Promise.all([
                Penyidikan.count({}),
                Penyidikan.count({ 
                    where 
                }),
                Penyidikan.findAll({
                    include: [
                        { 
                            model: Penyelidikan,
                            as: 'penyelidikan'
                        },
                        {
                            model: File_penyidikan,
                            attributes: [
                                'id', 
                                'id_penyidikan', 
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
                                'id_penyidikan',
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
        }

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
    UpdateStatus,
    Delete,
    List,
    ListNotExists,
    GetById,
    Get,
    GetByNo,
    TotalData,
    GetDatatables,
    DatatablesSearchValue
}