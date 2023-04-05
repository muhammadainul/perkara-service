const debug = require('debug');
const log = debug('perkara-service:services:');

const {
    Bantuan, 
    Users, 
    Logs 
} = require('../models');

async function Create (bantuanData, user) {
    const { 
        keluhan, 
        user_id 
    } = bantuanData;
    log('[Bantuan] Create', { bantuanData, user });
    try {
        if (!user_id && !keluhan) throw { error: 'Keluhan dan user_id harus dilampirkan.' };

        const checkUsers = await Users.findOne({
            where: { id: user_id },
            raw: true
        });
        if (!checkUsers) throw { error: 'User tidak tersedia.' };

        const created = await Bantuan.create({ 
            reported_by: user_id, 
            keluhan 
        });

        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Tambah) pesan dengan keterangan '${keluhan}'.`,
            user_id: user.id
        });

        return {
            message: 'Bantuan berhasil dibuat.',
            data: await Bantuan.findOne({
                where: { id: created.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Update (bantuanId, bantuanData, user) {
    const {
        status = true,
        keterangan
    } = bantuanData;
    log('[Bantuan] Update', { bantuanId, bantuanData, user });
    try {
        if (!keterangan && !status) throw { error: 'Status dan keterangan harus dilampirkan.' };

        const checkBantuan = await Bantuan.findOne({ 
            where: { id: bantuanId },
            raw: true
        })
        if (!checkBantuan) throw { error: 'Bantuan tidak tersedia.' };

        await Bantuan.update({
            status,
            keterangan
            },
            { where: { id: bantuanId }}
        );

        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Update) bantuan dengan keterangan '${keterangan}'.`,
            user_id: user.id
        });

        return {
            message: 'Bantuan berhasil diubah.',
            data: await Bantuan.findOne({
                where: { id: checkBantuan.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Delete (bantuanId, user) {
    log('[Bantuan] Delete', { bantuanId, user });
    try {
        const checkBantuan = await Bantuan.findOne({ 
            where: { id: bantuanId },
            raw: true
        })
        if (!checkBantuan) throw { error: 'Bantuan tidak tersedia.' };

        const checkUsers = await Users.findOne({
            where: { id: checkBantuan.reported_by },
            raw: true
        });
        
        await Bantuan.destroy({ where: { id: bantuanId }});
       
        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Hapus) bantuan atas nama ${checkUsers.username}.`,
            user_id: user.id
        });

        return {
            message: 'Bantuan berhasil dihapus.'
        };
    } catch (error) {
        return error;
    }
}

async function GetById (bantuanId) {
    log('[Bantuan] GetById', bantuanId);
    try {
        const checkBantuan = await Bantuan.findOne({ 
            include: {
                model: Users,
                attributes: ['username', 'nama_lengkap'],
                as: 'reported'
            },  
            where: { id: bantuanId },
            raw: true,
            nest: true    
        })
        if (!checkBantuan) throw { error: 'Bantuan tidak tersedia.' };
        
        return checkBantuan;
    } catch (error) {
        return error;
    }
}

async function Get () {
    log('[Bantuan] Get');
    try {
        const bantuanData = await Bantuan.findAll({ raw: true });
        
        return bantuanData;
    } catch (error) {
        return error;
    }
}

async function GetDatatables (bantuanData) {
    const { 
        draw, 
        // order, 
        start, 
        length, 
        urutan,
        user_id,
        keluhan,
        status
        // search 
    } = bantuanData;
    log('[Bantuan] GetDatatables', bantuanData);
    try {
        let whereByUser;
        if (user_id !== '') {
            whereByUser = {
                reported_by: user_id
            };
        }

        let whereByKeluhan;
        if (keluhan !== '') {
            whereByKeluhan = {
                keluhan
            };
        }

        let whereByStatus;
        if (status !== '') {
            whereByStatus = {
                status
            };
        }

        if (urutan !== '') {
            searchOrder = [['createdAt', urutan]];
        }

        const where = {
            ...whereByUser,
            ...whereByKeluhan,
            ...whereByStatus
        }

        const [recordsTotal, recordsFiltered, data] = await Promise.all([
            Bantuan.count({}),
            Bantuan.count({ where }),
            Bantuan.findAll({
                include: {
                    model: Users,
                    attributes: ['username', 'nama_lengkap'],
                    as: 'reported'
                },
                where,
                order: searchOrder,
                offset: start,
                limit: length,
                raw: true,
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
    Delete,
    GetById,
    Get,
    GetDatatables
}