const debug = require('debug');
const log = debug('perkara-service:services:');

const { 
    isEmpty, 
    toInteger, 
    map, 
    intersection, 
    split,
    includes
} = require('lodash');
const moment = require('moment');

const { 
    Kategori_perkara, 
    Perkara, 
    File_perkara, 
    Logs,
    Master_file_perkara,
    Log_perkara,
    Satker,
    User_jaksa
} = require('../models');
const { Op } = require('sequelize');
const sequelizeV2 = require('sequelize');

async function Create (perkaraData, user) {
    const { 
        inst_nama,
        tanggal_berkas,
        tanggal_terima,
        nama_tersangka,
        tppu,
        keterangan,
        no_perkara, 
        judul_perkara, 
        uraian, 
        tahun, 
        bulan,
        jenis, 
        kondisi, 
        lokasi_berkas,
        kategori_id,
        id_satker 
    } = perkaraData;
    log('[Perkara] Create', { perkaraData, user });
    try {
        const checkPerkara = await Perkara.findAll({ 
            where: { no_perkara },
            raw: true
        });
        if (checkPerkara.length > 0) throw { error: 'Nomor perkara sudah tersedia.' };

        if (!kategori_id) {    
            const created = await Perkara.create({
                inst_nama,
                tanggal_berkas,
                tanggal_terima,
                nama_tersangka,
                tppu,
                keterangan,
                no_perkara,
                judul_perkara,
                uraian, 
                tahun, 
                bulan,
                jenis, 
                kondisi,
                lokasi_berkas,
                id_satker,
                created_by: user.id
            });

            // const checkMasterFile = await Master_file_perkara.findAll({});
            // checkMasterFile.forEach(data => {
            //     File_perkara.create({
            //         id_perkara: created.id,
            //         id_master_file: data.id
            //     });
            // });

            await Logs.create({
                ip_address: user.ip_address,
                browser: user.browser,
                browser_version: user.browser_version,
                os: user.os,
                logdetail: `(Tambah) data perkara dengan nomor perkara ${created.no_perkara}.`,
                user_id: user.id
            });

            return {
                message: 'Data perkara berhasil dibuat.',
                data: await Perkara.findOne({
                    where: { id: created.id },
                    raw: true
                })
            };
        } else {
            const checkKategori = await Kategori_perkara.findOne({
                where: { id: kategori_id },
                raw: true
            });
            if (!checkKategori) throw { error: 'Kategori perkara tidak tersedia.' };

            const created = await Perkara.create({
                inst_nama,
                tanggal_berkas,
                tanggal_terima,
                nama_tersangka,
                tppu,
                keterangan,
                no_perkara,
                judul_perkara,
                uraian, 
                tahun, 
                bulan,
                jenis, 
                kondisi,
                lokasi_berkas,
                kategori_id,
                id_satker,
                created_by: user.id
            });

            // const checkMasterFile = await Master_file_perkara.findAll({});
            // checkMasterFile.forEach(data => {
            //     File_perkara.create({
            //         id_perkara: created.id,
            //         id_master_file: data.id
            //     });
            // });

            await Logs.create({
                ip_address: user.ip_address,
                browser: user.browser,
                browser_version: user.browser_version,
                os: user.os,
                logdetail: `(Tambah) data perkara dengan nomor perkara ${created.no_perkara}.`,
                user_id: user.id
            });

            return {
                message: 'Data perkara berhasil dibuat.',
                data: await Perkara.findOne({
                    where: { id: created.id },
                    raw: true
                })
            };
        }
    } catch (error) {
        return error;
    }
}

async function Update (perkaraId, perkaraData, user) {
    const { 
        inst_nama,
        tanggal_berkas,
        tanggal_terima,
        nama_tersangka,
        tppu,
        keterangan,
        no_perkara, 
        judul_perkara, 
        uraian, 
        tahun, 
        bulan,
        jenis, 
        kondisi, 
        lokasi_berkas,
        kategori_id,
        id_satker
    } = perkaraData;
    log('[Perkara] Update', { perkaraId, perkaraData, user });
    try {
        const checkPerkara = await Perkara.findOne({ 
            where: { id: perkaraId },
            raw: true
        })
        if (!checkPerkara) throw { error: 'Data perkara tidak tersedia.' };

        if (!kategori_id) {
            await Perkara.update({
                inst_nama,
                tanggal_berkas,
                tanggal_terima,
                nama_tersangka,
                tppu,
                keterangan,
                no_perkara,
                judul_perkara,
                uraian, 
                tahun, 
                bulan,
                jenis, 
                kondisi,
                lokasi_berkas,
                id_satker,
                },
                { where: { id: perkaraId }}
            );
    
            await Logs.create({
                ip_address: user.ip_address,
                browser: user.browser,
                browser_version: user.browser_version,
                os: user.os,
                logdetail: `(Update) data perkara dengan nomor perkara ${checkPerkara.no_perkara}.`,
                user_id: user.id
            });
    
            return {
                message: 'Data perkara berhasil diubah.',
                data: await Perkara.findOne({
                    where: { id: checkPerkara.id },
                    raw: true
                })
            };
        } else {
            const checkKategori = await Kategori_perkara.findOne({
                where: { id: kategori_id },
                raw: true
            });
            if (!checkKategori) throw { error: 'Kategori perkara tidak tersedia.' };
    
            await Perkara.update({
                inst_nama,
                tanggal_berkas,
                tanggal_terima,
                nama_tersangka,
                tppu,
                keterangan,
                no_perkara,
                judul_perkara,
                uraian, 
                tahun, 
                bulan,
                jenis, 
                kondisi,
                lokasi_berkas,
                kategori_id,
                id_satker,
                },
                { where: { id: perkaraId }}
            );
    
            await Logs.create({
                ip_address: user.ip_address,
                browser: user.browser,
                browser_version: user.browser_version,
                os: user.os,
                logdetail: `(Update) data perkara dengan nomor perkara ${checkPerkara.no_perkara}.`,
                user_id: user.id
            });
    
            return {
                message: 'Data perkara berhasil diubah.',
                data: await Perkara.findOne({
                    where: { id: checkPerkara.id },
                    raw: true
                })
            };
        }
    } catch (error) {
        return error;
    }
}

async function UpdateStatus (perkaraId, perkaraData, user) {
    const { status } = perkaraData;
    log('[Perkara] UpdateStatus', { perkaraId, perkaraData, user });
    try {
        const checkPerkara = await Perkara.findOne({ 
            where: { id: perkaraId },
            raw: true
        })
        if (!checkPerkara) throw { error: 'Data perkara tidak tersedia.' };

        if (status == true) {
            await Perkara.update({
                status: true
                },
                { where: { id: perkaraId }}
            );
    
            await Logs.create({
                ip_address: user.ip_address,
                browser: user.browser,
                browser_version: user.browser_version,
                os: user.os,
                logdetail: `(Update) status perkara dengan nomor perkara ${checkPerkara.no_perkara}.`,
                user_id: user.id
            });
    
            return {
                message: 'Data perkara berhasil diubah.',
                data: await Perkara.findOne({
                    where: { id: checkPerkara.id },
                    raw: true
                })
            };
        } else {
            return {
                message: 'Data perkara gagal diubah.'
            };
        }
    } catch (error) {
        return error;
    }
}

async function Delete (perkaraId, user) {
    log('[Perkara] Delete', { perkaraId, user });
    try {
        const checkPerkara = await Perkara.findOne({ 
            where: { id: perkaraId },
            raw: true
        });
        if (!checkPerkara) throw { error: 'Data perkara tidak tersedia.' };

        await File_perkara.destroy({ 
            where: { id_perkara: perkaraId }
        });

        await Log_perkara.destroy({
            where: { id_perkara: perkaraId }
        });

        await Perkara.destroy({ 
            where: { id: perkaraId } 
        });

        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Hapus) data perkara dengan nomor perkara ${checkPerkara.no_perkara}.`,
            user_id: user.id
        });

        return {
            message: 'Data perkara berhasil dihapus.'
        };
    } catch (error) {
        return error;
    }
}

async function GetById (perkaraData) {
    const { nip, perkara_id } = perkaraData
    log('[Perkara] GetById', perkaraData);
    try {
        if (!perkara_id) throw { error: 'Perkara id harus dilampirkan.' };
        
        const checkMasterFile = await Master_file_perkara.findAll({ raw: true })

        const checkPerkara = await Perkara.findOne({ 
            include: [
                {
                    model: File_perkara,
                    attributes: [
                        'id', 
                        'id_perkara', 
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
                    model: Kategori_perkara,
                    attributes: ['id', 'kategori'],
                    as: 'kategori_perkara'
                },
                {
                    model: User_jaksa,
                    attributes: [
                        'id', 
                        'id_perkara',
                        'username',
                        'nama_lengkap', 
                        'nip', 
                        'email'
                    ],
                    as: 'user_jaksa',
                    required: (nip) ? true : false,
                    duplicating: (nip) ? false : true
                },
                {
                    model: Satker,
                    attributes: ['id', 'nama_satker'],
                    as: 'satker'
                }
            ], 
            where: { 
                [Op.and]: [
                    { id: perkara_id },
                    (nip) ? { '$user_jaksa.nip$': nip } : {} 
                ]
            },
            nest: true
        });

        if (nip) {
            if (!checkPerkara) throw { error: 'Data perkara tidak tersedia.' };
    
            let newData = [];
            // for (let i of checkPerkara) {
                const file_perkara = checkPerkara.files;
    
                const nama = map(checkMasterFile, (row) => {
                    return row.nama;
                });
    
                const file = map(checkPerkara.files, (row) => {
                    const dokumen = split(row.keterangan, " ")[0];
                    return dokumen;
                });
    
                const exists = intersection(nama, file);
    
                const finish = [];
                map(file_perkara, (row) => {
                    if (includes(exists, split(row.keterangan, " ")[0])) finish.push(row)
                });
    
                newData.push({
                    id: checkPerkara.id,
                    inst_nama: checkPerkara.inst_nama,
                    tanggal_berkas: checkPerkara.tanggal_berkas,
                    tanggal_terima: checkPerkara.tanggal_terima,
                    nama_tersangka: checkPerkara.nama_tersangka,
                    tppu: checkPerkara.tppu,
                    keterangan: checkPerkara.keterangan,
                    no_perkara: checkPerkara.no_perkara,
                    judul_perkara: checkPerkara.judul_perkara,
                    status: checkPerkara.status,
                    kategori_id: checkPerkara.kategori_id,
                    id_satker: checkPerkara.id_satker,
                    uraian: checkPerkara.uraian,
                    tahun: checkPerkara.tahun,
                    bulan: checkPerkara.bulan,
                    jenis: checkPerkara.jenis,
                    kondisi: checkPerkara.kondisi,
                    lokasi_berkas: checkPerkara.lokasi_berkas,
                    created_by: checkPerkara.created_by,
                    createdAt: checkPerkara.createdAt,
                    updatedAt: checkPerkara.updatedAt,
                    user_jaksa: checkPerkara.user_jaksa,
                    files: finish,
                    kategori_perkara: checkPerkara.kategori_perkara,
                    user: checkPerkara.user,
                    satker: checkPerkara.satker
                });
                return newData[0];
            // }    
        } 
    
        return checkPerkara;
    } catch (error) {
        return error;
    }
}

async function GetByNo (perkaraData) {
    const { no_perkara } = perkaraData;
    log('[Perkara] GetByNo', perkaraData);
    try {
        const checkPerkara = await Perkara.findOne({ 
            include: [
                {
                    model: File_perkara,
                    attributes: [
                        'id', 
                        'id_perkara', 
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
                    model: Kategori_perkara,
                    attributes: ['id', 'kategori'],
                    as: 'kategori_perkara'
                },
                {
                    model: User_jaksa,
                    attributes: [
                        'id', 
                        'id_perkara',
                        'username',
                        'nama_lengkap', 
                        'nip', 
                        'email'
                    ],
                    as: 'user_jaksa'
                },
                {
                    model: Satker,
                    attributes: ['id', 'nama_satker'],
                    as: 'satker'
                }
            ], 
            where: { no_perkara },
            nest: true
        });
        if (!checkPerkara) throw { error: 'Data perkara tidak tersedia.' };
        
        return {
            data: checkPerkara
        };
    } catch (error) {
        return error;
    }
}

async function List (perkaraData) {
    const { kategori_id, nip } = perkaraData;
    log('[Perkara] List', perkaraData);
    try {
        let whereByKategori;
        (kategori_id) ? (whereByKategori = { kategori_id }) : (whereByKategori = {});

        let whereByNip;
        (nip) ? (whereByNip = { '$user_jaksa.nip$': nip }) : (whereByNip = {});

        const where = {
            ...whereByKategori,
            ...whereByNip
        };

        const perkaraData = await Perkara.findAll({ 
            include: {
                model: User_jaksa,
                attributes: [
                    'id', 
                    'id_perkara',
                    'username',
                    'nama_lengkap', 
                    'nip', 
                    'email'
                ],
                as: 'user_jaksa',
                required: (nip) ? true : false,
                duplicating: (nip) ? false : true
            },
            where,
            // raw: true,
            nest: true
        });

        return perkaraData;
    } catch (error) {
        return error;
    }
}

async function Get () {
    log('[Perkara] Get');
    try {
        const perkaraData = await Perkara.findAll({ 
            attributes: ['id', 'no_perkara'],
            raw: true
        });

        return perkaraData;
    } catch (error) {
        return error;
    }
}

async function TotalData (perkaraData) {
    const { 
        kategori_id, 
        nip,
        status 
    } = perkaraData;
    log('[Perkara] Total Data', perkaraData);
    try {
        if (!kategori_id) throw { error: 'Kategori dan status harus dilampirkan,' };

        let whereByUserFile;
        let whereByNip;
        if (nip !== '') {
            whereByNip = { '$user_jaksa.nip$': nip };
            whereByUserFile = { '$perkara.user_jaksa.nip$': nip };

        } 

        let whereByStatus;
        let whereByStatusFile;
        if (status !== '') {
            whereByStatus = {
                status
            };

            whereByStatusFile = {
                '$perkara.status$': status
            };
        }

        let total_surat;
        let total_berkas;
        if (nip) {
            [total_surat, total_berkas] = await Promise.all([
                Perkara.count({
                    include: {
                        model: (nip) ? User_jaksa : {},
                        as: (nip) ? 'user_jaksa' : '',
                        required: (nip) ? true : false,
                        duplicating: (nip) ? false : true
                    } ,
                    where: {
                        [Op.and]: [
                            { kategori_id },
                            whereByStatus,
                            whereByNip
                        ]
                    }
                }),
                File_perkara.count({
                    include: {
                        model: Perkara,
                        as: 'perkara',
                        include: {
                            model: (nip) ? User_jaksa : {},
                            as: (nip) ? 'user_jaksa' : '',
                            required: (nip) ? true : false,
                            duplicating: (nip) ? false : true
                        } 
                    },
                    where: {
                        [Op.and]: [
                            { '$perkara.kategori_id$': kategori_id },
                            whereByStatusFile,
                            whereByUserFile
                        ]
                    }
                })
            ]);
        } else {
            [total_surat, total_berkas] = await Promise.all([
                Perkara.count({
                    where: {
                        [Op.and]: [
                            { kategori_id },
                            whereByStatus
                        ]
                    }
                }),
                File_perkara.count({
                    include: {
                        model: Perkara,
                        as: 'perkara'
                    },
                    where: {
                        [Op.and]: [
                            { '$perkara.kategori_id$': kategori_id },
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

async function GetDatatables (perkaraData) {
    const { 
        draw, 
        // order, 
        start, 
        length, 
        // search, 
        no_perkara,
        judul_perkara,
        lokasi_berkas,
        nama_tersangka,
        status, 
        keterangan,
        satker,
        kategori_id,
        tahun,
        startDate,
        endDate,
        nip,
        urutan
    } = perkaraData;
    log('[Perkara] GetDatatables', perkaraData);
    try {
        let whereByKategori;
        (kategori_id) 
            ? (whereByKategori = { kategori_id })
            : (whereByKategori = {});

        let whereByNoPerkara;
        (no_perkara) 
            ? (whereByNoPerkara = { no_perkara: { [Op.iLike]: `%${no_perkara}%` } })
            : (whereByNoPerkara = {});
        
        let whereByJudulPerkara;
        (judul_perkara)
            ? (whereByJudulPerkara = { judul_perkara: { [Op.iLike]: `%${judul_perkara}%` } })
            : (whereByJudulPerkara = {});

        let whereByLokasiBerkas;
        (lokasi_berkas)
            ? (whereByLokasiBerkas = { lokasi_berkas: { [Op.iLike]: `%${lokasi_berkas}%` } })
            : (whereByLokasiBerkas = {});

        let whereBySatker;
        (satker)
            ? (whereBySatker = { id_satker: satker })
            : (whereBySatker = {});

        let whereByStatus;
        (status)
            ? (whereByStatus = { status })
            : (whereByStatus = {});

        let whereByTersangka;
        (nama_tersangka)
            ? (whereByTersangka = { nama_tersangka: { [Op.iLike]: `%${nama_tersangka}%` } })
            : (whereByTersangka = {});

        let whereByDate;
        (startDate || endDate)
            ? 
            (whereByDate = { 
                [Op.and]: [
                    { tanggal_berkas: { [Op.gte]: moment(startDate).format() } },
                    { tanggal_berkas: { [Op.lte]: moment(endDate).format() } }
                ]
            })
            : (whereByDate = {});

        let whereByYear;
        (tahun)
            ? (whereByYear = { tahun })
            : (whereByYear = {});

        let whereByNip;
        (nip)
            ? (whereByNip = { '$user_jaksa.nip$': nip })
            : (whereByNip = {});

        let whereByKeterangan;
        (keterangan)
            ? (whereByKeterangan = { keterangan })
            : (whereByKeterangan = {});

        const where = {
            ...whereByKategori,
            ...whereByNoPerkara,
            ...whereByJudulPerkara,
            ...whereByLokasiBerkas,
            ...whereBySatker,
            ...whereByStatus,
            ...whereByTersangka,
            ...whereByDate,
            ...whereByYear,
            ...whereByNip,
            ...whereByKeterangan
        };

        let searchOrder;
        if (urutan !== '') {
            searchOrder = [['createdAt', urutan]];
        };

        const checkMasterFile = await Master_file_perkara.findAll({ raw: true })

        let newData = [];
        if (nip) {
            var [recordsTotal, recordsFiltered, data] = await Promise.all([
                Perkara.count({}),
                Perkara.count({ 
                    include: {
                        model: User_jaksa,
                        as: 'user_jaksa',
                        required: (nip) ? true : false,
                        duplicating: (nip) ? false : true
                    },
                    where 
                }),
                Perkara.findAll({
                    include: [
                        {
                            model: File_perkara,
                            attributes: [
                                'id', 
                                'id_perkara', 
                                'destination', 
                                'filename', 
                                'path', 
                                'tanggal',
                                'keterangan'
                            ],
                            as: 'files'
                        },
                        {
                            model: Kategori_perkara,
                            attributes: ['id', 'kategori'],
                            as: 'kategori_perkara'
                        },
                        {
                            model: User_jaksa,
                            attributes: [
                                'id', 
                                'id_perkara',
                                'username',
                                'nama_lengkap', 
                                'nip', 
                                'email'
                            ],
                            as: 'user_jaksa',
                            required: (nip) ? true : false,
                            duplicating: (nip) ? false : true
                        },
                        // {
                        //     model: Satker,
                        //     attributes: ['id', 'nama_satker'],
                        //     as: 'satker'
                        // }
                    ],
                    where,
                    order: searchOrder,
                    offset: start,
                    limit: length,
                    nest: true
                })
            ]);

            for (let i of data) {
                const total_file = await File_perkara.count({
                    where: { 
                        id_perkara: i.id,
                        filename: { [Op.ne]: null }
                    }
                });

                const file_perkara = i.files;

                const nama = map(checkMasterFile, (row) => {
                    return row.nama;
                });

                const file = map(i.files, (row) => {
                    const dokumen = split(row.keterangan, " ")[0];
                    return dokumen;
                });

                const exists = intersection(nama, file);

                const finish = [];
                map(file_perkara, (row) => {
                    if (includes(exists, split(row.keterangan, " ")[0])) finish.push(row)
                });

                newData.push({
                    id: i.id,
                    inst_nama: i.inst_nama,
                    tanggal_berkas: i.tanggal_berkas,
                    tanggal_terima: i.tanggal_terima,
                    nama_tersangka: i.nama_tersangka,
                    tppu: i.tppu,
                    keterangan: i.keterangan,
                    no_perkara: i.no_perkara,
                    judul_perkara: i.judul_perkara,
                    status: i.status,
                    kategori_id: i.kategori_id,
                    id_satker: i.id_satker,
                    uraian: i.uraian,
                    tahun: i.tahun,
                    bulan: i.bulan,
                    jenis: i.jenis,
                    kondisi: i.kondisi,
                    lokasi_berkas: i.lokasi_berkas,
                    total_file: total_file,
                    created_by: i.created_by,
                    createdAt: i.createdAt,
                    updatedAt: i.updatedAt,
                    user_jaksa: i.user_jaksa,
                    files: finish,
                    kategori_perkara: i.kategori_perkara,
                    user: i.user,
                    satker: i.satker
                });
            }
        } else {
            var [recordsTotal, recordsFiltered, data] = await Promise.all([
                Perkara.count({}),
                Perkara.count({ 
                    // include: {
                    //     model: User_jaksa,
                    //     as: 'user_jaksa',
                    //     required: (nip) ? true : false,
                    //     duplicating: (nip) ? false : true
                    // },
                    where 
                }),
                Perkara.findAll({
                    include: [
                        {
                            model: File_perkara,
                            attributes: [
                                'id', 
                                'id_perkara', 
                                'destination', 
                                'filename', 
                                'path', 
                                'tanggal',
                                'keterangan'
                            ],
                            as: 'files'
                        },
                        {
                            model: Kategori_perkara,
                            attributes: ['id', 'kategori'],
                            as: 'kategori_perkara'
                        },
                        {
                            model: User_jaksa,
                            attributes: [
                                'id', 
                                'id_perkara',
                                'username',
                                'nama_lengkap', 
                                'nip', 
                                'email'
                            ],
                            as: 'user_jaksa',
                            required: (nip) ? true : false,
                            duplicating: (nip) ? false : true
                        },
                        // {
                        //     model: Satker,
                        //     attributes: ['id', 'nama_satker'],
                        //     as: 'satker'
                        // }
                    ],
                    where,
                    order: searchOrder,
                    offset: start,
                    limit: length,
                    nest: true
                })
            ]);

            for (let i of data) {
                const total_file = await File_perkara.count({
                    where: { 
                        id_perkara: i.id,
                        filename: { [Op.ne]: null }
                    }
                });
                newData.push({
                    id: i.id,
                    inst_nama: i.inst_nama,
                    tanggal_berkas: i.tanggal_berkas,
                    tanggal_terima: i.tanggal_terima,
                    nama_tersangka: i.nama_tersangka,
                    tppu: i.tppu,
                    keterangan: i.keterangan,
                    no_perkara: i.no_perkara,
                    judul_perkara: i.judul_perkara,
                    status: i.status,
                    kategori_id: i.kategori_id,
                    id_satker: i.id_satker,
                    uraian: i.uraian,
                    tahun: i.tahun,
                    bulan: i.bulan,
                    jenis: i.jenis,
                    kondisi: i.kondisi,
                    lokasi_berkas: i.lokasi_berkas,
                    total_file: total_file,
                    created_by: i.created_by,
                    createdAt: i.createdAt,
                    updatedAt: i.updatedAt,
                    user_jaksa: i.user_jaksa,
                    files: i.files,
                    kategori_perkara: i.kategori_perkara,
                    user: i.user,
                    satker: i.satker
                });
            }
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

// async function DatatablesAllReport (perkaraData) {
//     const { 
//         draw, 
//         // order, 
//         start, 
//         length, 
//         // search, 
//         no_perkara,
//         judul_perkara,
//         lokasi_berkas,
//         nama_tersangka,
//         status, 
//         keterangan,
//         satker,
//         kategori_id,
//         tahun,
//         startDate,
//         endDate,
//         nip,
//         urutan
//     } = perkaraData;
//     log('[Perkara] GetDatatables', perkaraData);
// }

async function DatatablesAdvancedSearch (perkaraData) {
    const { 
        draw, 
        // order, 
        start, 
        length, 
        search, 
        status,
        kategori_id,
        nip
        // urutan
    } = perkaraData;
    log('[Perkara] DatatablesAdvancedSearch', perkaraData);
    try {
        if (!kategori_id) throw { error: 'Kategori dan status harus dilampirkan.' };

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
                            inst_nama: {
                                [Op.iLike]: `%${search.value}%`
                            },
                            nama_tersangka: {
                                [Op.iLike]: `%${search.value}%`
                            },
                            keterangan: {
                                [Op.iLike]: `%${search.value}%`
                            },
                            no_perkara: {
                                [Op.iLike]: `%${search.value}%`
                            },
                            judul_perkara: {
                                [Op.iLike]: `%${search.value}%`
                            },
                            lokasi_berkas: {
                                [Op.iLike]: `%${search.value}%`
                            },
                            uraian: {
                                [Op.iLike]: `%${search.value}%` 
                            },
                            jenis: {
                                [Op.iLike]: `%${search.value}%`
                            },
                            kondisi: {
                                [Op.iLike]: `%${search.value}%`
                            },
                            tppu: {
                                [Op.iLike]: `%${search.value}%`
                            },
                            tahun: toInteger(search.value),
                            bulan: toInteger(search.value)
                        }
                    },
                    { kategori_id },
                    { status },
                    whereByNip
                ]
            })
            : (where = { 
                [Op.and]: [
                    { kategori_id },
                    { status },
                    whereByNip
                ]
            });

        let newData = [];
        let recordsTotal;
        let recordsFiltered;
        if (nip) {
            [recordsTotal, recordsFiltered, data] = await Promise.all([
                Perkara.count({}),
                Perkara.count({ 
                    include: [
                        {
                            model: User_jaksa,
                            as: 'user_jaksa',
                            required: (nip) ? true : false,
                            duplicating: (nip) ? false : true
                        },
                        {
                            model: Kategori_perkara,
                            attributes: ['id', 'kategori'],
                            as: 'kategori_perkara'
                        },
                        {
                            model: Satker,
                            attributes: ['id', 'nama_satker'],
                            as: 'satker'
                        }
                    ], 
                    where
                }),
                Perkara.findAll({
                    include: [
                        {
                            model: File_perkara,
                            attributes: [
                                'id', 
                                'id_perkara', 
                                'destination', 
                                'filename', 
                                'path', 
                                'keterangan'
                            ],
                            as: 'files'
                        },
                        {
                            model: Kategori_perkara,
                            attributes: ['id', 'kategori'],
                            as: 'kategori_perkara'
                        },
                        {
                            model: User_jaksa,
                            attributes: [
                                'id', 
                                'id_perkara',
                                'username',
                                'nama_lengkap', 
                                'nip', 
                                'email'
                            ],
                            as: 'user_jaksa',
                            required: (nip) ? true : false,
                            duplicating: (nip) ? false : true
                        },
                        {
                            model: Satker,
                            attributes: ['id', 'nama_satker'],
                            as: 'satker'
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
                Perkara.count({}),
                Perkara.count({ 
                    include: [
                        // {
                        //     model: User_jaksa,
                        //     as: 'user_jaksa',
                        //     required: (nip) ? true : false,
                        //     duplicating: (nip) ? false : true
                        // },
                        {
                            model: Kategori_perkara,
                            attributes: ['id', 'kategori'],
                            as: 'kategori_perkara'
                        },
                        {
                            model: Satker,
                            attributes: ['id', 'nama_satker'],
                            as: 'satker'
                        }
                    ], 
                    where
                }),
                Perkara.findAll({
                    include: [
                        {
                            model: File_perkara,
                            attributes: [
                                'id', 
                                'id_perkara', 
                                'destination', 
                                'filename', 
                                'path', 
                                'keterangan'
                            ],
                            as: 'files'
                        },
                        {
                            model: Kategori_perkara,
                            attributes: ['id', 'kategori'],
                            as: 'kategori_perkara'
                        },
                        {
                            model: User_jaksa,
                            attributes: [
                                'id', 
                                'id_perkara',
                                'username',
                                'nama_lengkap', 
                                'nip', 
                                'email'
                            ],
                            as: 'user_jaksa',
                            required: (nip) ? true : false,
                            duplicating: (nip) ? false : true
                        },
                        {
                            model: Satker,
                            attributes: ['id', 'nama_satker'],
                            as: 'satker'
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

        for (let i of data) {
            const total_file = await File_perkara.count({
                where: { 
                    id_perkara: i.id,
                    filename: { [Op.ne]: null }
                }
            });
            newData.push({
                id: i.id,
                inst_nama: i.inst_nama,
                tanggal_berkas: i.tanggal_berkas,
                tanggal_terima: i.tanggal_terima,
                nama_tersangka: i.nama_tersangka,
                tppu: i.tppu,
                keterangan: i.keterangan,
                no_perkara: i.no_perkara,
                judul_perkara: i.judul_perkara,
                status: i.status,
                kategori_id: i.kategori_id,
                id_satker: i.id_satker,
                uraian: i.uraian,
                tahun: i.tahun,
                bulan: i.bulan,
                jenis: i.jenis,
                kondisi: i.kondisi,
                lokasi_berkas: i.lokasi_berkas,
                total_file: total_file,
                created_by: i.created_by,
                createdAt: i.createdAt,
                updatedAt: i.updatedAt,
                penyelidikan: i.penyelidikan,
                files: i.files,
                kategori_perkara: i.kategori_perkara,
                user_jaksa: i.user_jaksa,
                satker: i.satker
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

async function DatatablesSearch (perkaraData) {
    const { 
        draw, 
        // order, 
        start, 
        length, 
        // search, 
        nip,
        cari
    } = perkaraData;
    log('[Perkara] DatatablesSearch', perkaraData);
    try {
        let where;
        (cari)
            ? (where = {
                [Op.and]: [
                    {
                        [Op.or]: [
                            { inst_nama: { [Op.iLike]: `%${cari}%` } }, 
                            { keterangan: { [Op.iLike]: `%${cari}%` } },
                            { nama_tersangka: { [Op.iLike]: `%${cari}%` } },
                            { no_perkara: { [Op.iLike]: `%${cari}%` } },
                            { judul_perkara: { [Op.iLike]: `%${cari}%` } },
                            { lokasi_berkas: { [Op.iLike]: `%${cari}%` } },
                            { uraian: { [Op.iLike]: `%${cari}%` } },
                            { jenis: { [Op.iLike]: `%${cari}%` } },
                            { kondisi: { [Op.iLike]: `%${cari}%` } },
                            { tppu: { [Op.iLike]: `%${cari}%` } },
                            sequelizeV2.where(
                                sequelizeV2.cast(sequelizeV2.col("Perkara.tahun"), 'varchar'),
                                { [Op.iLike]: `%${cari}%` }
                            ),
                            sequelizeV2.where(
                                sequelizeV2.cast(sequelizeV2.col("Perkara.tahun"), 'varchar'),
                                { [Op.iLike]: `%${cari}%` }
                            ),
                            // { '$kategori_perkara.kategori$': { [Op.iLike]: `%${cari}%` } },
                            // { '$user_jaksa.nama_lengkap$': { [Op.iLike]: `%${cari}%` } },
                            // { '$user_jaksa.jabatan$': { [Op.iLike]: `%${cari}%` } },
                            // { '$user_jaksa.pangkat$': { [Op.iLike]: `%${cari}%` } },
                            // { '$user_jaksa.nip$': { [Op.iLike]: `%${cari}%` } }
                        ]
                    },
                    (nip) ? { '$user_jaksa.nip$': nip } : {}
                ]
            })
            : (where = (nip) ? { '$user_jaksa.nip$': nip } : {});

        // let newData = [];
        if (nip) {
            [recordsTotal, recordsFiltered, data] = await Promise.all([
                Perkara.count({}),
                Perkara.count({ 
                    include: [
                        // {
                        //     model: User_jaksa,
                        //     as: 'user_jaksa',
                        //     required: (cari) ? true : false,
                        //     duplicating: (cari) ? false : true
                        // },
                        {
                            model: Kategori_perkara,
                            as: 'kategori_perkara'
                        },
                        // {
                        //     model: Satker,
                        //     attributes: ['id', 'nama_satker'],
                        //     as: 'satker'
                        // }
                    ], 
                    where
                }),
                Perkara.findAll({
                    include: [
                        // {
                        //     model: User_jaksa,
                        //     attributes: [
                        //         'id', 
                        //         'id_perkara',
                        //         'username',
                        //         'nama_lengkap', 
                        //         'nip', 
                        //         'email'
                        //     ],
                        //     as: 'user_jaksa',
                        //     required: (cari) ? true : false,
                        //     duplicating: (cari) ? false : true
                        // },
                        // {
                        //     model: File_perkara,
                        //     attributes: [
                        //         'id', 
                        //         'id_perkara', 
                        //         'destination', 
                        //         'filename', 
                        //         'path', 
                        //         'keterangan'
                        //     ],
                        //     as: 'files'
                        // },
                        {
                            model: Kategori_perkara,
                            attributes: ['id', 'kategori'],
                            as: 'kategori_perkara',
                            // duplicating: (cari) ? false : true,
                            // required: (cari) ? true : false
                        },
                        // {
                        //     model: Satker,
                        //     attributes: ['id', 'nama_satker'],
                        //     as: 'satker'
                        // }
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
                Perkara.count({}),
                Perkara.count({ 
                    include: [
                        {
                            model: Kategori_perkara,
                            as: 'kategori_perkara'
                        },
                        // {
                        //     model: Satker,
                        //     attributes: ['id', 'nama_satker'],
                        //     as: 'satker'
                        // }
                    ], 
                    where
                }),
                Perkara.findAll({
                    include: [
                        // {
                        //     model: User_jaksa,
                        //     attributes: [
                        //         'id', 
                        //         'id_perkara',
                        //         'username',
                        //         'nama_lengkap', 
                        //         'nip', 
                        //         'email'
                        //     ],
                        //     as: 'user_jaksa',
                        //     required: (cari) ? true : false,
                        //     duplicating: (cari) ? false : true
                        // },
                        // {
                        //     model: File_perkara,
                        //     attributes: [
                        //         'id', 
                        //         'id_perkara', 
                        //         'destination', 
                        //         'filename', 
                        //         'path', 
                        //         'keterangan'
                        //     ],
                        //     as: 'files'
                        // },
                        {
                            model: Kategori_perkara,
                            attributes: ['id', 'kategori'],
                            as: 'kategori_perkara',
                            // duplicating: (cari) ? false : true,
                            // required: (cari) ? true : false
                        },
                        // {
                        //     model: Satker,
                        //     attributes: ['id', 'nama_satker'],
                        //     as: 'satker'
                        // }
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
    TotalData,
    GetById,
    Get,
    GetByNo,
    GetDatatables,
    DatatablesAdvancedSearch,
    DatatablesSearch
}