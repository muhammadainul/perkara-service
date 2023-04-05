const debug = require('debug');
const log = debug('perkara-service:services:');

const { 
    Perkara, 
    Kategori_perkara, 
    File_perkara,
    Log_perkara,
    Users,
    Penyidikan,
    File_penyidikan,
    Log_penyidikan,
    Lapdumas,
    File_lapdumas,
    File_penyelidikan,
    Penyelidikan,
    User_jaksa,
    sequelize
} = require('../models');   
const { Op } = require('sequelize');
const { QueryTypes } = require('sequelize');
const sequelizev2 = require('sequelize');

const { 
    map, 
    toInteger
} = require('lodash');
const moment = require('moment');

async function GetNotif (notifData) {
    const { nip } = notifData;
    log('[Report] GetNotif', notifData);
    try {
        // if (!nip) throw { error: 'NIP harus dilampirkan.' };
        let whereByNip;
        if (nip) {
            whereByNip = { '$user_jaksa.nip$': nip };

            const checkUser = await Users.findOne({
                where: { nip },
                raw: true
            });
            if (!checkUser) throw { error: 'User tidak tersedia.' };
        }

        const kategoriData = await Kategori_perkara.findAll({
            raw: true
        });

        const data = [];
        for (let i of kategoriData) {
            var perkaraLengkap = await Perkara.count({
                where: {
                    [Op.and]: [
                        { kategori_id: i.id },
                        { status: true },
                        whereByNip
                    ]
                },
                include: {
                    model: User_jaksa,
                    as: 'user_jaksa',
                    required: (nip) ? true : false,
                    duplicating: (nip) ? false : true
                }
            });
            var perkaraBelumLengkap = await Perkara.count({
                where: {
                    [Op.and]: [
                        { kategori_id: i.id },
                        { status: false },
                        whereByNip
                    ]
                },
                include: {
                    model: User_jaksa,
                    as: 'user_jaksa',
                    required: (nip) ? true : false,
                    duplicating: (nip) ? false : true
                }
            });

            data.push({
                perkara: i.kategori,
                total_lengkap: perkaraLengkap,
                total_belum_lengkap: perkaraBelumLengkap
            });
        }

        let penyidikanData = [];
        const [berkasLengkap, berkasBelumLengkap] = await Promise.all([
            Penyidikan.count({
                where: {
                    [Op.and]: [
                        { status: true },
                        whereByNip
                    ]
                },
                include: {
                    model: User_jaksa,
                    as: 'user_jaksa',
                    required: (nip) ? true : false,
                    duplicating: (nip) ? false : true
                }
            }),
            Penyidikan.count({
                where: {
                    [Op.and]: [
                        { status: false },
                        whereByNip
                    ]
                },
                include: {
                    model: User_jaksa,
                    as: 'user_jaksa',
                    required: (nip) ? true : false,
                    duplicating: (nip) ? false : true
                }
            }),
        ]);
        penyidikanData.push({
            perkara: 'Penyidikan',
            total_lengkap: berkasLengkap,
            total_belum_lengkap: berkasBelumLengkap
        });

        return {
            perkara: data,
            penyidikan: penyidikanData
        };
    } catch (error) {
        return error;
    }
}

async function Get (reportData, user) {
    const { nip } = reportData;
    log('[Report] Get', { reportData, user });
    try {
        let totalPerkaraTipikor; 
        let totalBerkasPerkaraTipikor;
        let totalPerkaraPenyidikan;
        let totalBerkasPerkaraPenyidikan;
        let totalPerkaraKapabean; 
        let totalBerkasPerkaraKapabean;
        let totalPerkaraPerpajakan; 
        let totalBerkasPerkaraPerpajakan;
        let totalPerkaraHam;
        let totalBerkasPerkaraHam;
        let totalPerkaraPencucian;
        let totalBerkasPerkaraPencucian;
        if (nip) {
            [
                totalPerkaraTipikor, 
                totalBerkasPerkaraTipikor,
                totalPerkaraPenyidikan,
                totalBerkasPerkaraPenyidikan,
                totalPerkaraKapabean, 
                totalBerkasPerkaraKapabean,
                totalPerkaraPerpajakan, 
                totalBerkasPerkaraPerpajakan,
                totalPerkaraHam,
                totalBerkasPerkaraHam,
                totalPerkaraPencucian,
                totalBerkasPerkaraPencucian
            ] = await Promise.all([
                Perkara.count({ 
                    include: {
                        model: User_jaksa,
                        as: 'user_jaksa',
                        required: (nip) ? true : false,
                        duplicating: (nip) ? false : true
                    },
                    where: { 
                        [Op.and]: [
                            { kategori_id: 1  },
                            (nip) ? { '$user_jaksa.nip$': nip } : {}
                        ]
                    }
                }),
                File_perkara.count({
                    include: {
                        model: Perkara,
                        attributes: ['kategori_id'],
                        as: 'perkara',
                        include: {
                            model: User_jaksa,
                            as: 'user_jaksa',
                            required: (nip) ? true : false,
                            duplicating: (nip) ? false : true
                        }
                    },
                    where: { 
                        [Op.and]: [
                            (nip) ? { '$perkara.user_jaksa.nip$': nip } : {},
                            { '$perkara.kategori_id$': 1 }
                        ]
                    },
                }),
                Penyidikan.count({
                    include: {
                        model: User_jaksa,
                        as: 'user_jaksa',
                        required: (nip) ? true : false,
                        duplicating: (nip) ? false : true
                    },
                    where: (nip) ? { '$user_jaksa.nip$': nip } : {}
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
                    where: (nip) ? { '$penyidikan.user_jaksa.nip$': nip } : {}
                }),
                Perkara.count({ 
                    include: {
                        model: User_jaksa,
                        as: 'user_jaksa',
                        required: (nip) ? true : false,
                        duplicating: (nip) ? false : true
                    },
                    where: {
                        [Op.and]: [
                            { kategori_id: 2  },
                            (nip) ? { '$user_jaksa.nip$': nip } : {}
                        ] 
                    } 
                }),
                File_perkara.count({
                    include: {
                        model: Perkara,
                        attributes: ['kategori_id'],
                        as: 'perkara',
                        include: {
                            model: User_jaksa,
                            as: 'user_jaksa',
                            required: (nip) ? true : false,
                            duplicating: (nip) ? false : true
                        }
                    },
                    where: { 
                        [Op.and]: [
                            (nip) ? { '$perkara.user_jaksa.nip$': nip } : {},
                            { '$perkara.kategori_id$': 2 },
                        ]
                    }
                }),
                Perkara.count({ 
                    include: {
                        model: User_jaksa,
                        as: 'user_jaksa',
                        required: (nip) ? true : false,
                        duplicating: (nip) ? false : true
                    },
                    where: { 
                        [Op.and]: [
                            { kategori_id: 3 }, 
                            (nip) ? { '$user_jaksa.nip$': nip } : {}
                        ]
                    }
                }),
                File_perkara.count({
                    where: { 
                        [Op.and]: [
                            { '$perkara.kategori_id$': 3 },   
                            (nip) ? { '$perkara.user_jaksa.nip$': nip } : {}
                        ]
                    },
                    include: {
                        model: Perkara,
                        attributes: ['kategori_id'],
                        as: 'perkara',
                        include: {
                            model: User_jaksa,
                            as: 'user_jaksa',
                            required: (nip) ? true : false,
                            duplicating: (nip) ? false : true
                        }
                    }
                }),
                Perkara.count({ 
                    include: {
                        model: User_jaksa,
                        as: 'user_jaksa',
                        required: (nip) ? true : false,
                        duplicating: (nip) ? false : true
                    },
                    where: { 
                        [Op.and]: [
                            { kategori_id: 4 },
                            (nip) ? { '$user_jaksa.nip$': nip } : {}
                        ]                    
                    }
                }),
                File_perkara.count({
                    where: { 
                        [Op.and]: [
                            { '$perkara.kategori_id$': 4 },
                            (nip) ? { '$perkara.user_jaksa.nip$': nip } : {}
                        ]
                    },
                    include: {
                        model: Perkara,
                        attributes: ['kategori_id'],
                        as: 'perkara',
                        include: {
                            model: User_jaksa,
                            as: 'user_jaksa',
                            required: (nip) ? true : false,
                            duplicating: (nip) ? false : true
                        }
                    }
                }),
                Perkara.count({ 
                    include: {
                        model: User_jaksa,
                        as: 'user_jaksa',
                        required: (nip) ? true : false,
                        duplicating: (nip) ? false : true
                    },
                    where: { 
                        [Op.and]: [
                            { kategori_id: 6 },
                            (nip) ? { '$user_jaksa.nip$': nip } : {}
                        ]
                    } 
                }),
                File_perkara.count({
                    where: { 
                        [Op.and]: [
                            { '$perkara.kategori_id$': 6 },
                            (nip) ? { '$perkara.user_jaksa.nip$': nip } : {}
                        ]
                    },
                    include: {
                        model: Perkara,
                        attributes: ['kategori_id'],
                        as: 'perkara',
                        include: {
                            model: User_jaksa,
                            as: 'user_jaksa',
                            required: (nip) ? true : false,
                            duplicating: (nip) ? false : true
                        }
                    }
                })
            ]);   
        } else {
            [
                totalPerkaraTipikor, 
                totalBerkasPerkaraTipikor,
                totalPerkaraPenyidikan,
                totalBerkasPerkaraPenyidikan,
                totalPerkaraKapabean, 
                totalBerkasPerkaraKapabean,
                totalPerkaraPerpajakan, 
                totalBerkasPerkaraPerpajakan,
                totalPerkaraHam,
                totalBerkasPerkaraHam,
                totalPerkaraPencucian,
                totalBerkasPerkaraPencucian
            ] = await Promise.all([
                Perkara.count({ 
                    where: { kategori_id: 1 } 
                }),
                File_perkara.count({
                    where: { '$perkara.kategori_id$': 1 },
                    include: {
                        model: Perkara,
                        attributes: ['kategori_id'],
                        as: 'perkara'
                    }
                }),
                Penyidikan.count({}),
                File_penyidikan.count({}),
                Perkara.count({ 
                    where: { kategori_id: 2 } 
                }),
                File_perkara.count({
                    where: { '$perkara.kategori_id$': 2 },
                    include: {
                        model: Perkara,
                        attributes: ['kategori_id'],
                        as: 'perkara'
                    }
                }),
                Perkara.count({ 
                    where: { kategori_id: 3 } 
                }),
                File_perkara.count({
                    where: { '$perkara.kategori_id$': 3 },
                    include: {
                        model: Perkara,
                        attributes: ['kategori_id'],
                        as: 'perkara'
                    }
                }),
                Perkara.count({ 
                    where: { kategori_id: 4 } 
                }),
                File_perkara.count({
                    where: { '$perkara.kategori_id$': 4 },
                    include: {
                        model: Perkara,
                        attributes: ['kategori_id'],
                        as: 'perkara'
                    }
                }),
                Perkara.count({ 
                    where: { kategori_id: 6 } 
                }),
                File_perkara.count({
                    where: { '$perkara.kategori_id$': 6 },
                    include: {
                        model: Perkara,
                        attributes: ['kategori_id'],
                        as: 'perkara'
                    }
                })
            ]);
        }

        return {
            perkara_tipikor: {
                totalPerkaraTipikor, 
                totalBerkasPerkaraTipikor
            },
            penyidikan_tipikor: {
                totalPerkaraPenyidikan,
                totalBerkasPerkaraPenyidikan
            },
            perkara_kapabean: {
                totalPerkaraKapabean, 
                totalBerkasPerkaraKapabean
            },
            perkara_perpajakan: {
                totalPerkaraPerpajakan, 
                totalBerkasPerkaraPerpajakan
            },
            perkara_ham: {
                totalPerkaraHam,
                totalBerkasPerkaraHam
            },
            perkara_pencucian: {
                totalPerkaraPencucian,
                totalBerkasPerkaraPencucian
            }
        };
    } catch (error) {
        return error;
    }
}

async function GetTopPerkara () {
    log('[Report] GetTopPerkara');
    try {
        const result = await Perkara.findAll({
            attributes: [
                sequelize.literal('DISTINCT ON("kategori_id") "Perkara"."kategori_id"'),
                'id',
                'no_perkara',
                'judul_perkara',
                'kategori_id',
                'tanggal_berkas'
            ],
            include: {
                model: Kategori_perkara,
                attributes: ['kategori'],
                as: 'kategori_perkara'
            },
            order: ['kategori_id', ['tanggal_berkas', 'desc']],
            where: { 
                [Op.and]: [
                    { kategori_id: { [Op.ne]: 5 } },
                    { kategori_id: { [Op.ne]: 0 } },
                    { kategori_id: { [Op.ne]: null } }
                ]
            },
            raw: true,
            nest: true
        });

        const penyidikan = await Penyidikan.findOne({
            attributes: [
                sequelize.literal('DISTINCT ON("tanggal_sprintdik") "Penyidikan"."tanggal_sprintdik"'),
                'id',
                'no_sprintdik',
                'nama_perkara',
                'jenis_perkara'
            ],
            order: [['tanggal_sprintdik', 'desc']],
            raw: true
        });

        return { 
            perkara: result,
            penyidikan 
        };
    } catch (error) {
        return error;
    }
}

async function GetGraphPerkara (reportData) {
    const { time = '1years' } = reportData;
    log('[Report] GetGraphPerkara', reportData);
    try {
        let days;
        if (time == '7days') days = 7;
        else if (time == '1months') days = 30;
        else if (time == '3months') days = 90;
        else days = 365; 

        let totalKategori = [];
        const kategoriData = await Kategori_perkara.findAll({
            attributes: ['id', 'kategori'],
            raw: true
        });

        let data = [];
        for (let kategori of kategoriData) {
            data = await sequelize.query(`select Months.m AS month, count("Perkara"."tanggal_berkas") as total from 
                (
                    select 1 as m 
                    union select 2 as m 
                    union select 3 as m 
                    union select 4 as m 
                    union select 5 as m 
                    union select 6 as m 
                    union select 7 as m 
                    union select 8 as m 
                    union select 9 as m 
                    union select 10 as m 
                    union select 11 as m 
                    union select 12 as m
                ) as Months
                left join "Perkara" on Months.m = extract(month from "Perkara"."tanggal_berkas") 
                and "Perkara"."tanggal_berkas" >= '${moment().startOf('year').format()}' 
                and "Perkara"."tanggal_berkas" <= '${moment().endOf('year').format()}'
                and "Perkara".kategori_id = ${kategori.id}
                group by Months.m
                order by Months.m asc`,
                { type: QueryTypes.SELECT }
            )   

            totalKategori.push({ 
                kategori: kategori.kategori,
                data: map(data, (i) => {
                    return toInteger(i.total);
                })
            });
        }

        let totalPenyidikan = [];
        const penyidikan = await sequelize.query(`select Months.m AS month, count("Penyidikan"."tanggal_sprintdik") as total
        from
            (
                select 1 as m 
                union select 2 as m 
                union select 3 as m 
                union select 4 as m 
                union select 5 as m 
                union select 6 as m 
                union select 7 as m 
                union select 8 as m 
                union select 9 as m 
                union select 10 as m 
                union select 11 as m 
                union select 12 as m
            ) as Months
            left join "Penyidikan" on Months.m = extract(month from "Penyidikan"."tanggal_sprintdik") 
            and "Penyidikan"."tanggal_sprintdik" >= '${moment().startOf('year').format()}' 
            and "Penyidikan"."tanggal_sprintdik" <= '${moment().endOf('year').format()}'
            group by Months.m
            order by Months.m asc`,
            { type: QueryTypes.SELECT }
        )
        
        totalPenyidikan.push({
            kategori: 'Penyidikan',
            penyidikan: map(penyidikan, (i) => {
                return toInteger(i.total);
            })
        })
        return { 
            perkara: totalKategori,
            penyidikan: totalPenyidikan
        };
    } catch (error) {
        return error;
    }
}

async function GetLogTraffic (kategoriData) {
    const { 
        draw, 
        // order, 
        start, 
        length, 
        // search, 
        kategori_id,
        start_date = moment().startOf('day').format(),
        end_date = moment().endOf('day').format(),
     } = kategoriData;
    log('[Report] GetLogTraffic', kategoriData);
    try {
        let data = [];

        let whereByKategori;
        (kategori_id) 
            ? (whereByKategori = { kategori_id })
            : (whereByKategori = {});

        let whereByDate;
        (start_date && end_date) 
            ? 
                (whereByDate = {
                    [Op.and]: [
                        { logtime: { [Op.gte]: moment(start_date).format() } },
                        { logtime: { [Op.lte]: moment(end_date).format() } }
                    ]
                })
            :
                (whereByDate = {});

        const where = {
            ...whereByKategori,
            ...whereByDate
        };

        const logPerkara = await Log_perkara.findAll({
            attributes: [
                sequelize.literal('DISTINCT ON("perkara.no_perkara") "perkara"."no_perkara"'),
                'id'
            ],
            include: {
                model: Perkara,
                attributes: ['id', 'no_perkara'],
                as: 'perkara',
                include: {
                    model: Kategori_perkara,
                    attributes: ['id', 'kategori'],
                    as: 'kategori_perkara'
                }
            },
            where,
            offset: start,
            limit: length
        });

        for (let log of logPerkara) {
            const [totalDownload, totalUpload, totalView] = await Promise.all([
                Log_perkara.count({
                    include: {
                        model: Perkara,
                        attributes: ['no_perkara'],
                        as: 'perkara'
                    },
                    where: {
                        [Op.and]: [
                            {
                                logdetail: {
                                    [Op.iLike]: `%Download%`
                                }
                            },
                            { '$perkara.no_perkara$': log.perkara.no_perkara }
                        ]
                    }
                }),
                Log_perkara.count({
                    include: {
                        model: Perkara,
                        attributes: ['kategori_id'],
                        as: 'perkara'
                    },
                    where: {
                        [Op.and]: [
                            {
                                logdetail: {
                                    [Op.iLike]: `%Upload%`
                                }
                            },
                            { '$perkara.no_perkara$': log.perkara.no_perkara }
                        ]
                    }
                }),
                Log_perkara.count({
                    include: {
                        model: Perkara,
                        attributes: ['no_perkara'],
                        as: 'perkara'
                    },
                    where: {
                        [Op.and]: [
                            {
                                logdetail: {
                                    [Op.iLike]: `%View%`
                                }
                            },
                            { '$perkara.no_perkara$': log.perkara.no_perkara }
                        ]
                    }
                })
            ]);

            data.push({
                id: log.perkara.id,
                no_perkara: log.perkara.no_perkara,
                kategori_perkara: log.perkara.kategori_perkara.kategori,
                download: totalDownload,
                upload: totalUpload,
                view: totalView ? totalView : 0
            });
        }

        const recordsTotal = await Log_perkara.count({});

        return {
            draw,
            recordsTotal,
            recordsFiltered: data.length,
            data
        };
    } catch (error) {
        return error;
    }
}

async function GetGraphTraffic () {
    log('[Report] GetGraphTraffic');
    try {
        let data = [];

        const logPerkara = await Log_perkara.findAll({
            attributes: [
                sequelize.literal('DISTINCT ON("perkara.kategori_id") "perkara"."kategori_id"'),
                'kategori_id'
            ],
            include: {
                model: Perkara,
                attributes: ['kategori_id'],
                as: 'perkara',
                include: {
                    model: Kategori_perkara,
                    attributes: ['kategori'],
                    as: 'kategori_perkara'
                }
            },
            raw: true,
            nest: true
        });

        for (let log of logPerkara) {
            const [totalDownload, totalUpload, totalView] = await Promise.all([
                Log_perkara.count({
                    include: {
                        model: Perkara,
                        attributes: ['kategori_id'],
                        as: 'perkara'
                    },
                    where: {
                        [Op.and]: [
                            {
                                logdetail: {
                                    [Op.iLike]: `%Download%`
                                }
                            },
                            { '$perkara.kategori_id$': log.kategori_id }
                        ]
                    }
                }),
                Log_perkara.count({
                    include: {
                        model: Perkara,
                        attributes: ['kategori_id'],
                        as: 'perkara'
                    },
                    where: {
                        [Op.and]: [
                            {
                                logdetail: {
                                    [Op.iLike]: `%Upload%`
                                }
                            },
                            { '$perkara.kategori_id$': log.kategori_id }
                        ]
                    }
                }),
                Log_perkara.count({
                    include: {
                        model: Perkara,
                        attributes: ['kategori_id'],
                        as: 'perkara'
                    },
                    where: {
                        [Op.and]: [
                            {
                                logdetail: {
                                    [Op.iLike]: `%View%`
                                }
                            },
                            { '$perkara.kategori_id$': log.kategori_id }
                        ]
                    }
                })
            ]);
            data.push({
                kategori_id: log.kategori_id,
                kategori_perkara: log.perkara.kategori_perkara.kategori,
                download: totalDownload,
                upload: totalUpload,
                view: totalView ? totalView : 0
            });
        }

        return data;
    } catch (error) {
        return error;
    }
}

async function GetDatatablesDigital (reportData) {
    const {
        start_date, 
        end_date,
        nip
    } = reportData;
    log('[Report] GetDatatablesDigital', reportData);
    try {
        let whereByDate;
        (start_date && end_date) 
            ? 
            (whereByDate = {
                [Op.and]: [
                    { createdAt: { [Op.gte]: moment(start_date).format() } },
                    { createdAt: { [Op.lte]: moment(end_date).format() } }
                ]
            })
            :
            (whereByDate = {});

        let whereByLogtime;
        (start_date && end_date) 
            ? 
            (whereByLogtime = {
                [Op.and]: [
                    { logtime: { [Op.gte]: moment(start_date).format() } },
                    { logtime: { [Op.lte]: moment(end_date).format() } }
                ]
            })
            :
            (whereByLogtime = {});

        let whereByNip;
        (nip) ? (whereByNip = { '$user_jaksa.nip$': nip }) : (whereByNip = {});

        let whereByNipFile;
        (nip) ? (whereByNipFile = { '$perkara.user_jaksa.nip$': nip }) : (whereByNipFile = {});

        let checkUser;
        if (nip) {
            checkUser = await Users.findOne({
                where: { nip },
                raw: true
            });
        }

        let data = [];

        const kategoriData = await Kategori_perkara.findAll({ raw: true });
        
        for (let log of kategoriData) {
            console.log('i', log);
            const [
                totalBerkas,
                totalSurat,
                totalDownload,
                totalUpload, 
                totalView
            ] = await Promise.all([
                File_perkara.count({
                    include: {
                        model: Perkara,
                        attributes: ['kategori_id'],
                        as: 'perkara',
                        include: {
                            model: User_jaksa,
                            as: 'user_jaksa'
                        }
                    },
                    where: { 
                        [Op.and]: [
                            { '$perkara.kategori_id$': log.id },
                            whereByDate,
                            whereByNipFile
                        ]
                    }
                }),
                Perkara.count({
                    include: {
                        model: User_jaksa,
                        as: 'user_jaksa'
                    },
                    where: {
                        [Op.and]: [
                            { kategori_id: log.id },
                            whereByDate,
                            whereByNip
                        ]
                    } 
                }),
                Log_perkara.count({
                    include: [
                        {
                            model: Perkara,
                            attributes: ['kategori_id'],
                            as: 'perkara'
                        },
                        {
                            model: Users,
                            as: 'user'
                        }
                    ],
                    where: {
                        [Op.and]: [
                            {
                                logdetail: {
                                    [Op.iLike]: `%Download%`
                                }
                            },
                            { '$perkara.kategori_id$': log.id },
                            whereByLogtime,
                            (nip) ? { user_id: checkUser.id } : {}
                        ]
                    }
                }),
                Log_perkara.count({
                    include: {
                        model: Perkara,
                        attributes: ['kategori_id'],
                        as: 'perkara'
                    },
                    where: {
                        [Op.and]: [
                            {
                                logdetail: {
                                    [Op.iLike]: `%Upload%`
                                }
                            },
                            { '$perkara.kategori_id$': log.id },
                            whereByLogtime,
                            (nip) ? { user_id: checkUser.id } : {}
                        ]
                    }
                }),
                Log_perkara.count({
                    include: {
                        model: Perkara,
                        attributes: ['kategori_id'],
                        as: 'perkara'
                    },
                    where: {
                        [Op.and]: [
                            {
                                logdetail: {
                                    [Op.iLike]: `%View%`
                                }
                            },
                            { '$perkara.kategori_id$': log.id },
                            whereByLogtime,
                            (nip) ? { user_id: checkUser.id } : {}
                        ]
                    }
                })
            ]);
            
            data.push({
                kategori: log.kategori,
                total_surat: totalSurat,
                total_berkas: totalBerkas,
                download: totalDownload,
                upload: totalUpload,
                view: totalView ? totalView : 0
            });
        }

        let penyidikanData = [];

        const [
            totalBerkasPenyidikan,
            totalSuratPenyidikan,
            totalDownloadPenyidikan,
            totalUploadPenyidikan,
            totalViewPenyidikan
        ] = await Promise.all([
            File_penyidikan.count({
                include: {
                    model: Penyidikan,
                    as: 'penyidikan',
                    include: {
                        model: User_jaksa,
                        as: 'user_jaksa'
                    }
                },
                where: { 
                    [Op.and]: [
                        whereByDate,
                        (nip) ? { '$penyidikan.user_jaksa.nip$': nip } : {}
                    ] 
                }
            }),
            Penyidikan.count({
                include: {
                    model: User_jaksa,
                    as: 'user_jaksa'
                },
                where: { 
                    [Op.and]: [
                        whereByDate,
                        (nip) ? { '$user_jaksa.nip$': nip } : {}
                    ] 
                }
            }),
            Log_penyidikan.count({
                where: {
                    [Op.and]: [
                        {
                            logdetail: {
                                [Op.iLike]: `%Download%`
                            }
                        },
                        whereByLogtime,
                        (nip) ? { user_id: checkUser.id } : {}
                    ]
                }
            }),
            Log_penyidikan.count({
                where: {
                    [Op.and]: [
                        {
                            logdetail: {
                                [Op.iLike]: `%Upload%`
                            }
                        },
                        whereByLogtime,
                        (nip) ? { user_id: checkUser.id } : {}
                    ]
                }
            }),
            Log_penyidikan.count({
                where: {
                    [Op.and]: [
                        {
                            logdetail: {
                                [Op.iLike]: `%View%`
                            }
                        },
                        whereByLogtime,
                        (nip) ? { user_id: checkUser.id } : {}
                    ]
                }
            })
        ])

        penyidikanData.push({
            kategori: 'Penyidikan',
            total_surat: totalSuratPenyidikan,
            total_berkas: totalBerkasPenyidikan,
            download: totalDownloadPenyidikan,
            upload: totalUploadPenyidikan,
            view: totalViewPenyidikan ? totalViewPenyidikan : 0
        });

        return {
            perkara: data,
            penyidikan: penyidikanData
        };
    } catch (error) {
        return error;
    }
}

async function GetReportExporter (reportData) {
    const {
        start_date,
        end_date,
        nip,
        type = 'perkara'
    } = reportData;
    log('[Report] GetReportExporter', reportData);
    try {
        if (!start_date || !end_date) throw { error: 'Rentan tanggal harus dilampirkan.' };

        if (!type) throw { error: 'Tipe laporan harus dilampirkan (lapdumas/penyidikan/penyelidikan/perkara).' };

        let whereByNip;
        (nip) ? (whereByNip = { '$user_jaksa.nip$': nip }) : (whereByNip = {});

        let report = []
        if (type == 'lapdumas') {
            data = await Lapdumas.findAll({
                attributes: [
                    'id',
                    'no_laporan',
                    [sequelizev2.fn('upper', sequelizev2.col('kasus_posisi')), 'kasus_posisi'],
                ],
                include: [
                    {
                        model: File_lapdumas,
                        attributes: ['destination'],
                        as: 'files'
                    }
                ],
                where: {
                    [Op.and]: [
                        whereByNip,
                        { tanggal_surat: { [Op.gte]: moment(start_date).format() } },
                        { tanggal_surat: { [Op.lte]: moment(end_date).format() } },
                        { '$files.filename$': { [Op.ne]: '' } }
                    ]
                },
                nest: true
            })
            for (let i of data) {
                const total = await File_lapdumas.count({ 
                    where: { 
                        id_lapdumas: i.id, 
                        filename: { [Op.ne]: '' }
                    } 
                })
                report.push({
                    nomor_perkara: i.no_laporan,
                    nama_perkara: i.kasus_posisi,
                    jumlah_dokumen: toInteger(total),
                    dokumen: map(i.files, (i) => {
                        let label;
                        i.destination ? label = i.destination : label = 'nama dokumen tidak tertera';

                        return label;
                    })
                });
            }
        } else if (type == 'penyelidikan') {
            data = await Penyelidikan.findAll({
                attributes: [
                    'id',
                    'no_sprintlid',
                    [sequelizev2.fn('upper', sequelizev2.col('kasus_posisi')), 'kasus_posisi'],
                ],
                include: [
                    {
                        model: File_penyelidikan,
                        attributes: ['destination'],
                        as: 'files'
                    },
                    {
                        model: User_jaksa,
                        as: 'user_jaksa'
                    }
                ],
                where: {
                    [Op.and]: [
                        whereByNip,
                        { tanggal_sprintlid: { [Op.gte]: moment(start_date).format() } },
                        { tanggal_sprintlid: { [Op.lte]: moment(end_date).format() } },
                        { '$files.filename$': { [Op.ne]: '' } }
                    ]
                },
                nest: true
            })
            for (let i of data) {
                const total = await File_penyelidikan.count({ 
                    where: { 
                        id_penyelidikan: i.id, 
                        filename: { [Op.ne]: '' }
                    } 
                })
                report.push({
                    nomor_perkara: i.no_sprintlid,
                    nama_perkara: i.kasus_posisi,
                    jumlah_dokumen: toInteger(total),
                    dokumen: map(i.files, (i) => {
                        let label;
                        i.destination ? label = i.destination : label = 'nama dokumen tidak tertera';

                        return label;
                    })
                });
            }
        } else if (type == 'penyidikan') {
            data = await Penyidikan.findAll({
                attributes: [
                    'id',
                    'no_sprintdik',
                    [sequelizev2.fn('upper', sequelizev2.col('nama_perkara')), 'nama_perkara'],
                ],
                include: [
                    {
                        model: File_penyidikan,
                        attributes: ['destination'],
                        as: 'files'
                    },
                    {
                        model: User_jaksa,
                        as: 'user_jaksa'
                    }
                ],
                where: {
                    [Op.and]: [
                        whereByNip,
                        { tanggal_sprintdik: { [Op.gte]: moment(start_date).format() } },
                        { tanggal_sprintdik: { [Op.lte]: moment(end_date).format() } },
                        { '$files.filename$': { [Op.ne]: '' } }
                    ]
                },
                nest: true
            })
            for (let i of data) {
                const total = await File_penyidikan.count({ 
                    where: { 
                        id_penyidikan: i.id, 
                        filename: { [Op.ne]: '' }
                    } 
                })
                report.push({
                    nomor_perkara: i.no_sprintdik,
                    nama_perkara: i.nama_perkara,
                    jumlah_dokumen: toInteger(total),
                    dokumen: map(i.files, (i) => {
                        let label;
                        i.destination ? label = i.destination : label = 'nama dokumen tidak tertera';

                        return label;
                    })
                });
            }
        } else if (type == 'perkara') {
            data = await Perkara.findAll({
                attributes: [
                    'id',
                    'no_perkara',
                    [sequelizev2.fn('upper', sequelizev2.col('judul_perkara')), 'judul_perkara'],
                ],
                include: [
                    {
                        model: File_perkara,
                        attributes: ['destination'],
                        as: 'files'
                    },
                    {
                        model: User_jaksa,
                        as: 'user_jaksa'
                    }
                ],
                where: {
                    [Op.and]: [
                        whereByNip,
                        { tanggal_berkas: { [Op.gte]: moment(start_date).format() } },
                        { tanggal_berkas: { [Op.lte]: moment(end_date).format() } },
                        { '$files.filename$': { [Op.ne]: '' } }
                    ]
                },
                nest: true
            })
            for (let i of data) {
                const total = await File_perkara.count({ 
                    where: { 
                        id_perkara: i.id,
                        filename: { [Op.ne]: '' }
                        
                    } 
                })
                report.push({
                    nomor_perkara: i.no_perkara,
                    nama_perkara: i.judul_perkara,
                    jumlah_dokumen: toInteger(total),
                    dokumen: map(i.files, (i) => {
                        let label;
                        i.destination ? label = i.destination : label = 'nama dokumen tidak tertera';

                        return label;
                    })
                });
            }
        } 

        // const data = await sequelize.query(`
        //     (SELECT 'Modul Lapdumas' as jenis_laporan,
        //     nomor_laporan as nomor_perkara,
        //     CONCAT("File_lapdumas".destination, '~', "File_lapdumas".filename) AS filename,
        //     'Lapdumas' as kategori
        //     FROM "Lapdumas"
        //     LEFT JOIN "File_lapdumas" ON "File_lapdumas".id_lapdumas = "Lapdumas".id
        //     WHERE
        //     "Lapdumas"."tanggal_surat" >= '${moment(start_date).format()}' AND
        //     "Lapdumas"."tanggal_surat" <= '${moment(end_date).format()}')
        //     UNION ALL
        //     (SELECT 'Modul Penyelidikan' AS jenis_laporan,
        //     CONCAT("File_penyelidikan".destination, '~', "File_penyelidikan".filename) AS filename,
        //     'Penyelidikan' as kategori
        //     FROM "Penyelidikan" 
        //     LEFT JOIN "File_penyelidikan" ON "File_penyelidikan".id_penyelidikan = "Penyelidikan".id
        //     LEFT JOIN "User_jaksa" ON "User_jaksa".id_penyelidikan = "Penyelidikan".id
        //     WHERE
        //     "Penyelidikan"."tanggal_sprintlid" >= '${moment(start_date).format()}' AND
        //     "Penyelidikan"."tanggal_sprintlid" <= '${moment(end_date).format()}'
        //     ${whereByNip}) 
        //     UNION ALL
        //     (SELECT 'Modul Penyidikan' AS jenis_laporan,
        //     CONCAT("File_penyidikan".destination, '~', "File_penyidikan".filename) AS filename,
        //     'Penyidikan' as kategori
        //     FROM "Penyidikan" 
        //     LEFT JOIN "File_penyidikan" ON "File_penyidikan".id_penyidikan = "Penyidikan".id
        //     LEFT JOIN "User_jaksa" ON "User_jaksa".id_penyidikan = "Penyidikan".id
        //     WHERE
        //     "Penyidikan"."tanggal_sprintdik" >= '${moment(start_date).format()}' AND
        //     "Penyidikan"."tanggal_sprintdik" <= '${moment(end_date).format()}'
        //     ${whereByNip})
        //     UNION ALL
        //     (SELECT 'Modul Perkara' AS jenis_laporan,
        //     CONCAT("File_perkara".destination, '~', "File_perkara".filename) AS filename,
        //     "Kategori_perkara".kategori as kategori
        //     FROM "Perkara" 
        //     LEFT JOIN "File_perkara" ON "File_perkara".id_perkara = "Perkara".id
        //     LEFT JOIN "Kategori_perkara" ON "Kategori_perkara".id = "Perkara".kategori_id
        //     LEFT JOIN "User_jaksa" ON "User_jaksa".id_perkara = "Perkara".id
        //     WHERE
        //     "Perkara"."tanggal_berkas" >= '${moment(start_date).format()}' AND
        //     "Perkara"."tanggal_berkas" <= '${moment(end_date).format()}'
        //     ${whereByNip})`
        // );

        // let report = [];
        // forEach(data[0], (i) => {
        //     let found = findIndex(report, { jenis_laporan: i.jenis_laporan });

        //     if (found != -1) {
        //         report[found].filename.push(i.filename);
        //         report[found].kategori.push(i.kategori);
        //     }
        //     else report.push({ jenis_laporan: i.jenis_laporan, filename: [i.filename], kategori: [i.kategori] });
        // });
        
        return report;
    } catch (error) {
        return error;
    }
}

module.exports = {
    Get,
    GetNotif,
    GetTopPerkara,
    GetGraphPerkara,
    GetLogTraffic,
    GetGraphTraffic,
    GetDatatablesDigital,
    GetReportExporter
}